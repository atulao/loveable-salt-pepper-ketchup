
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Fetch data from NJIT Campus Labs API
    const response = await fetch(
      "https://njit.campuslabs.com/engage/api/discovery/event/search",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add any required API authorization headers here if needed
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Transform data to match our application's event format
    const transformedEvents = data.value.map((event: any) => ({
      id: event.id.toString(),
      title: event.name,
      description: event.description || "",
      location: event.location || "TBD",
      date: event.startsOn.split("T")[0], // Extract date part
      time: formatTime(event.startsOn),
      end_time: formatTime(event.endsOn),
      organization: event.organizationName || "NJIT",
      categories: event.categoryNames || [],
      has_free_food: event.categoryNames?.some((cat: string) => 
        cat.toLowerCase().includes("food") || 
        cat.toLowerCase().includes("refreshment")
      ) || false,
      image_url: event.imagePath || undefined,
      created_at: new Date().toISOString(),
      created_by: undefined
    }));

    // Return the transformed events with CORS headers
    return new Response(
      JSON.stringify(transformedEvents),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});

// Helper function to format time from ISO string
function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  } catch {
    return "TBD";
  }
}
