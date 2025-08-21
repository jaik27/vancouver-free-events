const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeFromDailyHive() {
  console.log('Scraping events from Daily Hive Vancouver...');
  const events = [];
  
  try {
    // User agent to mimic browser
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'Accept-Language': 'en-US,en;q=0.9'
    };
    
    console.log('Sending request to Daily Hive...');
    const response = await axios.get('https://dailyhive.com/vancouver/listed/events', { headers });
    console.log(`Response received: ${response.status} ${response.statusText}`);
    
    const $ = cheerio.load(response.data);
    
    // Check if we got any HTML content
    const pageTitle = $('title').text();
    console.log(`Page title: ${pageTitle}`);
    
    // Log all event cards found
    const eventElements = $('.events-cards .event-card, .event-item, [class*="event"]');
    console.log(`Found ${eventElements.length} potential event elements`);
    
    // DEBUG: Print the first 100 characters of HTML to check content
    const htmlSample = response.data.substring(0, 100).replace(/\n/g, ' ');
    console.log(`HTML sample: ${htmlSample}...`);
    
    // Check for any elements with "event" in their class
    $('[class*="event"]').each((i, element) => {
      console.log(`Found element with class containing 'event': ${$(element).attr('class')}`);
    });
    
    // Try more general selectors
    $('.event-card, .event-item, .event, .events-list > *').each((i, element) => {
      try {
        // Get any visible text to identify events
        const allText = $(element).text().trim();
        console.log(`Found potential event: ${allText.substring(0, 50)}...`);
        
        const title = $(element).find('h3, .title, [class*="title"]').first().text().trim() || 
                     $(element).find('*').filter(function() {
                       return $(this).text().length > 20 && $(this).text().length < 100;
                     }).first().text().trim();
                     
        if (title) {
          const priceText = $(element).text().toLowerCase();
          const isFree = priceText.includes('free') && !priceText.includes('free parking');
          
          if (isFree) {
            console.log(`Found free event: ${title}`);
            
            // Get any date text
            let dateText = '';
            $(element).find('*').each(function() {
              const text = $(this).text().trim();
              if (text.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)\b/i)) {
                dateText = text;
                return false; // break the loop
              }
            });
            
            // Create a date - default to tomorrow if parsing fails
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            events.push({
              title: title,
              description: allText.substring(0, 200),
              date: tomorrow,
              location: 'Vancouver, BC',
              image_url: $(element).find('img').attr('src') || '',
              source_url: 'https://dailyhive.com/vancouver/listed/events',
              source_name: 'Daily Hive Vancouver',
              isFree: true
            });
          }
        }
      } catch (err) {
        console.error(`Error processing event element:`, err);
      }
    });
    
    console.log(`Completed Daily Hive scraping. Found ${events.length} free events.`);
    return events;
  } catch (error) {
    console.error('Error scraping Daily Hive:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Headers: ${JSON.stringify(error.response.headers)}`);
    }
    return [];
  }
}

module.exports = scrapeFromDailyHive;