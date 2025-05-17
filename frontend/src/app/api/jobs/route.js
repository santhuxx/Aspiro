import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const query = url.searchParams.get("query");
  const location = url.searchParams.get("location") || "";
  
  // Build search query for JSearch API
  const searchQuery = location ? `${query} jobs in ${location}` : `${query} jobs`;
  
  const rapidAPIKey =  'b7cd777caamsh4d005ea95ea1832p15b569jsn9de6b7e3689d';
  const rapidAPIUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=5&num_pages=5&date_posted=all`;

  try {
    console.log("Requesting from RapidAPI:", rapidAPIUrl);
    
    const response = await fetch(rapidAPIUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": rapidAPIKey,
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      console.error(`API Error Status: ${response.status}`);
      let errorText = '';
      try {
        errorText = await response.text();
        console.error("API Error Response:", errorText);
      } catch (e) {
        console.error("Could not parse error response");
      }
      
      return NextResponse.json(
        { error: `API returned status: ${response.status}`, details: errorText }, 
        { status: response.status }
      );
    }

    const data = await response.json();

    // Validate the response structure
    if (!data.data || !Array.isArray(data.data)) {
      console.error("Unexpected API response structure:", data);
      return NextResponse.json({ error: "Invalid API response" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}