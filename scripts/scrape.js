require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@vercel/postgres');
const scrapeFromDailyHive = require('./scrapers/dailyHive');
const scrapeFromTourismVancouver = require('./scrapers/tourismVancouver');
const generateTestEvents = require('./scrapers/testEvents');

// Add more scrapers as you implement them
const scrapers = [
  { name: 'Daily Hive Vancouver', scraper: scrapeFromDailyHive },
  { name: 'Tourism Vancouver', scraper: scrapeFromTourismVancouver }
];

// Flag to use test events if scrapers fail
const USE_TEST_EVENTS = true;

async function main() {
  console.log('Starting Vancouver free events scraper...');
  
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING
  });
  
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Database connected successfully!');
    
    // Ensure the events table exists
    await ensureEventsTable(client);
    
    // Get all events from all sources
    let allEvents = [];
    let scrapedEventsCount = 0;
    
    // Try to scrape from all sources
    for (const { name, scraper } of scrapers) {
      console.log(`Starting scraper for ${name}...`);
      try {
        const events = await scraper();
        
        // Filter for free events using our enhanced detection
        const freeEvents = events.filter(event => event.isFree === true);
        
        console.log(`Found ${freeEvents.length} free events from ${name} (out of ${events.length} total)`);
        allEvents.push(...freeEvents);
        scrapedEventsCount += freeEvents.length;
      } catch (error) {
        console.error(`Error in ${name} scraper:`, error);
      }
    }
    
    // If no events were found and test events flag is true, use test events
    if (scrapedEventsCount === 0 && USE_TEST_EVENTS) {
      console.log('No events found from scrapers, using test events instead');
      const testEvents = generateTestEvents();
      allEvents = [...allEvents, ...testEvents];
    }
    
    // Save all free events to database
    console.log(`Total free events found: ${allEvents.length}`);
    let newEventsCount = 0;
    
    for (const event of allEvents) {
      const wasAdded = await saveEvent(client, event);
      if (wasAdded) newEventsCount++;
    }
    
    console.log(`Added ${newEventsCount} new events to the database`);
    console.log('Scraping completed successfully!');
  } catch (error) {
    console.error('Error during scraping process:', error);
  } finally {
    if (client) {
      await client.end();
      console.log('Database connection closed.');
    }
  }
}

async function ensureEventsTable(client) {
  try {
    // Check if table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'events'
      );
    `);
    
    // Create table if it doesn't exist
    if (!tableCheck.rows[0].exists) {
      console.log('Creating events table...');
      await client.query(`
        CREATE TABLE events (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          date TIMESTAMP NOT NULL,
          location VARCHAR(255),
          image_url VARCHAR(255),
          source_url VARCHAR(255) NOT NULL,
          source_name VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX events_date_idx ON events (date);
      `);
      console.log('Events table created successfully!');
    }
  } catch (error) {
    console.error('Error ensuring events table exists:', error);
    throw error; // Re-throw as this is critical
  }
}

async function saveEvent(client, event) {
  try {
    // Make sure we have the required fields
    if (!event.title || !event.date) {
      console.log(`Skipping event with missing title or date: ${event.title}`);
      return false;
    }
    
    // Format date properly
    let dateStr;
    try {
      dateStr = event.date instanceof Date ? 
        event.date.toISOString() : 
        new Date(event.date).toISOString();
    } catch (e) {
      console.error(`Invalid date for event "${event.title}":`, e);
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + 7);
      dateStr = fallbackDate.toISOString();
    }
    
    // Check if event already exists
    const checkResult = await client.query(
      'SELECT id FROM events WHERE title = $1 AND source_name = $2',
      [
        event.title.substring(0, 255), // Ensure within VARCHAR limits
        event.source_name.substring(0, 100)
      ]
    );
    
    if (checkResult.rows.length === 0) {
      // Insert new event
      await client.query(
        `INSERT INTO events (
          title, 
          description, 
          date, 
          location, 
          image_url, 
          source_url, 
          source_name
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          event.title.substring(0, 255),
          event.description || '',
          dateStr,
          (event.location || '').substring(0, 255),
          (event.image_url || '').substring(0, 255),
          (event.source_url || '').substring(0, 255),
          event.source_name.substring(0, 100)
        ]
      );
      
      console.log(`Saved new event: ${event.title}`);
      return true;
    } else {
      console.log(`Event already exists: ${event.title}`);
      return false;
    }
  } catch (error) {
    console.error(`Error saving event "${event.title}":`, error);
    return false;
  }
}

// Run the scraper
main().catch(error => {
  console.error('Fatal error in main function:', error);
  process.exit(1);
});