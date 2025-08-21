import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Ensure this is a legitimate cron request
    // In a real-world app, you might want to add authorization here
    
    console.log('Running weekly scraper job...');
    
    // Run the scraper script
    const { stdout, stderr } = await execAsync('node scripts/scrape.js');
    
    if (stderr) {
      console.error('Scraper error:', stderr);
      return new NextResponse('Scraper error', { status: 500 });
    }
    
    console.log('Scraper output:', stdout);
    
    return NextResponse.json({ success: true, message: 'Scraping job completed' });
  } catch (error) {
    console.error('Error running scraper:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}