
import { handleEventsRequest } from './api/events';

// Middleware function for the Vite dev server
export async function eventsMiddleware(req, res, next) {
  // Only handle /api/events routes
  if (req.url.startsWith('/api/events')) {
    console.log('API Middleware: Handling request for', req.url);
    try {
      const response = await handleEventsRequest(req);
      
      // Set the status code
      res.statusCode = response.status;
      
      // Set headers from the response
      for (const [key, value] of response.headers.entries()) {
        res.setHeader(key, value);
      }
      
      // Send the response body
      const body = await response.text();
      res.end(body);
    } catch (error) {
      console.error('API Middleware Error:', error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  } else {
    // Not an API route, continue to the next middleware
    next();
  }
}
