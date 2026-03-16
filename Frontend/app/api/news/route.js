//NewsAPI.org API
//https://newsapi.org/


import { NextResponse } from "next/server";

// In-memory rotation tracker (dev only)
let lastIndex = 0;

export async function GET(request) {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "News API key missing" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city")?.trim();
    const query = city ? `${city} news` : "technology";

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&language=en&apiKey=${apiKey}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "News API failed", status: response.status },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Return up to 15 articles so the widget can show multiple headlines (3 visible + expand for rest)
    const total = data.articles.length;
    const maxCount = 15;
    const start = lastIndex % total;
    const end = Math.min(start + maxCount, total);

    const rotatedArticles = data.articles
      .slice(start, end)
      .map((article) => ({
        title: article.title,
        url: article.url,
        source: article.source?.name ?? "Unknown",
      }));

    lastIndex = end % total;

    return NextResponse.json({ articles: rotatedArticles });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Unable to fetch news" }, { status: 500 });
  }
}