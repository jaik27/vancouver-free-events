const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeFromTourismVancouver() {
  console.log('Scraping events from Tourism Vancouver...');
  const events = [];
  
  try {
    const response = await axios.get('https://www.destinationvancouver.com/events/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Tourism Vancouver event listings
    $('.event-item, .listerItem').each(async (i, element) => {
      try {
        const title = $(element).find('.event-title, .lister-item-header').text().trim();
        const link = $(element).find('a').attr('href');
        let fullLink = link;
        
        // Handle relative URLs
        if (link && !link.startsWith('http')) {
          fullLink = `https://www.destinationvancouver.com${link.startsWith('/') ? '' : '/'}${link}`;
        }
        
        const imageUrl = $(element).find('img').attr('src') || '';
        const dateText = $(element).find('.event-date, .date-display').text().trim();
        const location = $(element).find('.event-venue, .venue-display').text().trim();
        
        // Fetch details page for more information
        if (fullLink) {
          try {
            const detailResponse = await axios.get(fullLink, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
              }
            });
            
            const detailPage = cheerio.load(detailResponse.data);
            
            // Extract description
            const description = detailPage('.event-description, .description').text().trim() || 
                               detailPage('meta[name="description"]').attr('content') || '';
            
            // Look for price information
            const priceText = detailPage('.event-cost, .field--name-field-cost').text().trim();
            
            // Determine if the event is free
            const isFree = isFreeEvent(title, description, priceText);
            
            // Parse date
            const date = parseDate(dateText);
            
            events.push({
              title,
              description,
              date,
              location,
              image_url: imageUrl,
              source_url: fullLink,
              source_name: 'Tourism Vancouver',
              priceText,
              isFree
            });
            
            console.log(`Extracted event: ${title}`);
          } catch (detailErr) {
            console.error(`Error fetching details for ${fullLink}:`, detailErr.message);
          }
        }
      } catch (err) {
        console.error(`Error extracting event details:`, err.message);
      }
    });
    
    console.log(`Completed Tourism Vancouver scraping. Found ${events.length} events.`);
    return events;
  } catch (error) {
    console.error('Error scraping Tourism Vancouver:', error.message);
    return [];
  }
}

function isFreeEvent(title, description, priceText) {
  const textToCheck = [title, description, priceText].join(' ').toLowerCase();
  
  // Keywords that indicate free events
  const freeKeywords = ['free', 'no cost', 'no charge', 'complimentary', '$0', 'gratis'];
  
  // Exclusion words (to avoid false positives)
  const exclusionWords = ['free parking', 'free wifi', 'gluten-free', 'free with admission'];
  
  // Check if any free keywords exist
  const hasFreeKeyword = freeKeywords.some(keyword => textToCheck.includes(keyword));
  
  // Check if it only has exclusion terms
  const hasOnlyExclusion = exclusionWords.some(word => textToCheck.includes(word)) && 
                          !freeKeywords.some(keyword => 
                            textToCheck.replace(exclusionWords.join('|'), '').includes(keyword));
    
  return hasFreeKeyword && !hasOnlyExclusion;
}

function parseDate(dateText) {
  try {
    // Try to parse the date
    const date = new Date(dateText);
    
    // Check if the date is valid
    if (!isNaN(date.getTime())) {
      return date;
    }
    
    // Handle date ranges by taking the first date
    const dateMatch = dateText.match(/([A-Za-z]+\s+\d{1,2})(?:\s*-\s*[A-Za-z]*\s*\d{1,2})?,\s*(\d{4})/);
    if (dateMatch) {
      return new Date(`${dateMatch[1]}, ${dateMatch[2]}`);
    }
    
    // Fallback
    const fallbackDate = new Date();
    fallbackDate.setDate(fallbackDate.getDate() + 7);
    return fallbackDate;
  } catch (e) {
    console.error('Error parsing date:', dateText, e);
    const fallbackDate = new Date();
    fallbackDate.setDate(fallbackDate.getDate() + 7);
    return fallbackDate;
  }
}

module.exports = scrapeFromTourismVancouver;