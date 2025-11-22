export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return Response.json(
        { error: "GROQ_API_KEY environment variable is missing" },
        { status: 500 }
      );
    }

    const systemPrompt = {
      role: "system",
      content: `YOU ARE YAVUZ'S AI ASSISTANT.

ABOUT YAVUZ:
- Name: Yavuz
- Profession: Senior Frontend Developer
- Expertise: React, Next.js, JavaScript, TypeScript, AI integrations
- Skills: Frontend development, AI integration, web technologies
- Experience: 5+ years in web development

PERSONALITY:
- Friendly, helpful, and professional
- Knowledgeable about technology and development
- Enthusiastic about helping people learn about Yavuz

RULES:
1. Answer questions about Yavuz's skills, experience, and background
2. Be helpful and provide useful information
3. If you don't know something, say so politely
4. Keep responses conversational but informative
5. You can discuss general tech topics when relevant`,
    };

    // const availableModels = [
    //   "llama-3.1-8b-instant", // fast and free
    //   "llama-3.1-70b-versatile", // more intelligent
    //   "mixtral-8x7b-32768", // more intelligent
    //   "gemma2-9b-it", // new model
    // ];

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [systemPrompt, ...messages],
          stream: false,
          max_tokens: 500,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        { error: `Groq API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json({
      message: data.choices[0].message,
    });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
