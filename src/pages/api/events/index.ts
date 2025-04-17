
import type { NextApiRequest, NextApiResponse } from 'next';

const NJIT_API_URL = 'https://njit.campuslabs.com/engage/api/discovery/event/search';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const query = req.query.query as string || '';
  
  // Construct the URL for the NJIT API
  const njitApiUrl = new URL(NJIT_API_URL);
  njitApiUrl.searchParams.append('endsAfter', new Date().toISOString());
  njitApiUrl.searchParams.append('orderByField', 'endsOn');
  njitApiUrl.searchParams.append('orderByDirection', 'ascending');
  njitApiUrl.searchParams.append('status', 'Approved');
  njitApiUrl.searchParams.append('take', '100');
  
  if (query) {
    njitApiUrl.searchParams.append('query', query);
  }
  
  try {
    console.log("API Route: Fetching from NJIT API:", njitApiUrl.toString());
    
    // Make the request from the server side
    const response = await fetch(njitApiUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`API Route: NJIT API error (${response.status}): ${response.statusText}`);
      return res.status(response.status).json({ 
        error: `Failed to fetch data from NJIT API: ${response.statusText}` 
      });
    }
    
    const data = await response.json();
    console.log(`API Route: Successfully fetched ${data.value?.length || 0} events from NJIT API`);
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('API Route: Error fetching from NJIT API:', error);
    return res.status(500).json({ error: 'Failed to fetch data from NJIT API' });
  }
}
