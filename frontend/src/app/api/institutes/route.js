import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const query = url.searchParams.get("query");

  const rapidAPIKey = process.env.RAPIDAPI_KEY;
  const rapidAPIUrl = `https://local-business-data.p.rapidapi.com/search-nearby?query=${query}&lat=7.291418&lng=80.636696&limit=50&language=en&region=LK&extract_emails_and_contacts=false`;

  try {
    const response = await fetch(rapidAPIUrl, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": rapidAPIKey,
        "X-RapidAPI-Host": "local-business-data.p.rapidapi.com",
      },
    });

    const data = await response.json();

    // Check if data.data exists and is an array
    if (!data.data || !Array.isArray(data.data)) {
      console.error("Unexpected API response structure:", data);
      return NextResponse.json({ error: "Invalid API response" }, { status: 500 });
    }

    // Extract only required details
    const results = data.data.map((institute) => ({
      name: institute.name,
      full_address: institute.full_address,
      rating: institute.rating,
      place_link: institute.place_link,
      phone_number: institute.phone_number,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
