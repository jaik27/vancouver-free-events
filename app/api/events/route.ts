import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, addDays } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateFilter = searchParams.get('date');
    const searchQuery = searchParams.get('search');
    
    let query = `
      SELECT * FROM events 
      WHERE date >= NOW() 
    `;
    
    // Apply search filter
    if (searchQuery && searchQuery.trim() !== '') {
      const searchTerm = searchQuery.trim().toLowerCase();
      query += `AND (
        LOWER(title) LIKE '%${searchTerm}%' OR 
        LOWER(description) LIKE '%${searchTerm}%' OR 
        LOWER(location) LIKE '%${searchTerm}%'
      )`;
    }
    
    // Apply date filters
    if (dateFilter) {
      const now = new Date();
      
      if (dateFilter === 'today') {
        query += `AND date BETWEEN '${startOfDay(now).toISOString()}' AND '${endOfDay(now).toISOString()}'`;
      } else if (dateFilter === 'tomorrow') {
        const tomorrow = addDays(now, 1);
        query += `AND date BETWEEN '${startOfDay(tomorrow).toISOString()}' AND '${endOfDay(tomorrow).toISOString()}'`;
      } else if (dateFilter === 'weekend') {
        // Find the coming weekend
        const today = now.getDay(); // 0 = Sunday, 6 = Saturday
        const daysUntilSaturday = today === 6 ? 0 : 6 - today;
        const daysUntilSunday = today === 0 ? 0 : 7 - today;
        
        const saturday = addDays(now, daysUntilSaturday);
        const sunday = addDays(now, daysUntilSunday);
        
        query += `AND (
          (date BETWEEN '${startOfDay(saturday).toISOString()}' AND '${endOfDay(saturday).toISOString()}')
          OR 
          (date BETWEEN '${startOfDay(sunday).toISOString()}' AND '${endOfDay(sunday).toISOString()}')
        )`;
      } else if (dateFilter === 'week') {
        query += `AND date BETWEEN '${startOfDay(now).toISOString()}' AND '${endOfDay(addDays(now, 7)).toISOString()}'`;
      }
    }
    
    // Add ordering and limit
    query += ` ORDER BY date ASC LIMIT 50`;
    
    const { rows } = await sql.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database Error:', error);
    return new NextResponse('Database Error', { status: 500 });
  }
}