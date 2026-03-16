//OpenWeatherMap API
//https://openweathermap.org/api


export async function GET(request) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city")?.trim() || "London";

    if (!apiKey) {
      return Response.json({ error: "API key missing" }, { status: 500 });
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      return Response.json(
        { error: "City not found or weather unavailable" },
        { status: 400 }
      );
    }

    const data = await response.json();
    return Response.json({
      city: data.name,
      temperature: data.main.temp,
      condition: data.weather[0].main,
      icon: data.weather[0].icon,
    });
  } catch (error) {
    return Response.json(
      { error: "Unable to fetch weather" },
      { status: 500 }
    );
  }
}
