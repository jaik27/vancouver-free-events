function generateTestEvents() {
    console.log('Generating test events for development...');
    
    // Current date
    const now = new Date();
    
    // Generate dates for next 7 days
    const dates = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(now.getDate() + i);
      dates.push(date);
    }
    
    const events = [
      {
        title: "Free Vancouver Art Gallery Open House",
        description: "Explore Vancouver Art Gallery's latest exhibitions with free admission for all visitors.",
        date: dates[0],
        location: "Vancouver Art Gallery, 750 Hornby St, Vancouver",
        image_url: "https://images.unsplash.com/photo-1518998053901-5348d3961a04",
        source_url: "https://example.com/events/art-gallery",
        source_name: "Test Source",
        isFree: true
      },
      {
        title: "Stanley Park Nature Walk",
        description: "Join our expert guides for a free educational walk through Stanley Park's forest trails.",
        date: dates[1],
        location: "Stanley Park, Vancouver",
        image_url: "https://images.unsplash.com/photo-1551524559-8af4e6624178",
        source_url: "https://example.com/events/nature-walk",
        source_name: "Test Source",
        isFree: true
      },
      {
        title: "Sunset Beach Yoga Class",
        description: "Free community yoga class at Sunset Beach. Bring your own mat.",
        date: dates[2],
        location: "Sunset Beach Park, Vancouver",
        image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
        source_url: "https://example.com/events/beach-yoga",
        source_name: "Test Source",
        isFree: true
      },
      {
        title: "Granville Island Farmers Market",
        description: "Special free edition of the farmers market with local produce and crafts.",
        date: dates[3],
        location: "Granville Island, Vancouver",
        image_url: "https://images.unsplash.com/photo-1488459716781-31db52582fe9",
        source_url: "https://example.com/events/farmers-market",
        source_name: "Test Source",
        isFree: true
      },
      {
        title: "Science World Community Day",
        description: "Free admission to Science World for all Vancouver residents.",
        date: dates[4],
        location: "Science World, 1455 Quebec St, Vancouver",
        image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        source_url: "https://example.com/events/science-world",
        source_name: "Test Source",
        isFree: true
      }
    ];
    
    console.log(`Generated ${events.length} test events`);
    return events;
  }
  
  module.exports = generateTestEvents;