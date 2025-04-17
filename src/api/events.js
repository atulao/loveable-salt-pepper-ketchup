
// This file provides a handler for the /api/events endpoint in development
// It proxies requests to the NJIT Campus Labs API

export const handleEventsRequest = async (req) => {
  const url = new URL(req.url);
  const query = url.searchParams.get('query') || '';
  
  const NJIT_API_URL = 'https://njit.campuslabs.com/engage/api/discovery/event/search';
  
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
    console.log("API Endpoint: Fetching from NJIT API:", njitApiUrl.toString());
    
    // Make the request to the NJIT API
    const response = await fetch(njitApiUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`API Endpoint: NJIT API error (${response.status}): ${response.statusText}`);
      return new Response(
        JSON.stringify({ error: `Failed to fetch data from NJIT API: ${response.statusText}` }),
        { 
          status: response.status,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const data = await response.json();
    console.log(`API Endpoint: Successfully fetched ${data.value?.length || 0} events from NJIT API`);
    
    return new Response(
      JSON.stringify(data),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('API Endpoint: Error fetching from NJIT API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch data from NJIT API' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
