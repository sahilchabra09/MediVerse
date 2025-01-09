import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=hospital&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    
    const hospitals = data.results.map((result: any) => ({
      name: result.name,
      location: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      }
    }));

    return NextResponse.json({ hospitals });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch nearby hospitals' },
      { status: 500 }
    );
  }
}