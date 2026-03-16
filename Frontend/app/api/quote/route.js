//ZenQuotes API
//https://zenquotes.io/api
//Returns random quote.

export async function GET() {
    try {
      const response = await fetch("https://zenquotes.io/api/random");
  
      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }
  
      const data = await response.json();
  
      return Response.json({
        content: data[0].q,
        author: data[0].a,
      });
  
    } catch (error) {
      return Response.json(
        { error: "Unable to fetch quote" },
        { status: 500 }
      );
    }
  }