// import { NextResponse } from "next/server";
// import { getAITasks } from "@/lib/aiTasks";

// export async function GET() {
//   const tasks = await getAITasks();
//   return NextResponse.json(tasks);
// }


// export async function GET() {
//   try{
//     const response = await fetch("https://api.openai.com/v1/chat/completions")
//   }
//   catch (error) {
//     console.log("Error fetching AI tasks:", error);
//   }
// }








import { NextResponse } from "next/server";

// Fallback tasks (shown if OpenAI fails or API key missing)
const DEV_TASKS = [
  { title: "Block 2 hours for deep work", priority: "high", notes: "Fewer meetings today" },
  { title: "Review pull requests", priority: "medium", notes: "3 PRs waiting" },
  { title: "Update documentation", priority: "medium", notes: "Docs behind code" },
  { title: "Schedule 1:1 with team", priority: "low", notes: "No 1:1s in last 2 weeks" },
  { title: "Backup and clean branches", priority: "low", notes: "Improve repo hygiene" },
];

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;

  // If no key, shuffle DEV_TASKS and return
  if (!apiKey) {
    const shuffledTasks = DEV_TASKS.sort(() => Math.random() - 0.5);
    return NextResponse.json({ tasks: shuffledTasks });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a productivity assistant. Generate 5 task suggestions with title, priority (high/medium/low), and notes.",
          },
          {
            role: "user",
            content:
              "Respond ONLY with a JSON array. Each object should have title, priority, and notes. Do NOT add explanations.",
          },
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      // If OpenAI fails, shuffle DEV_TASKS
      const shuffledTasks = DEV_TASKS.sort(() => Math.random() - 0.5);
      return NextResponse.json({ tasks: shuffledTasks });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    // Parse JSON safely
    let tasks;
    try {
      const jsonStart = text.indexOf("[");
      const jsonText = jsonStart >= 0 ? text.slice(jsonStart) : text;
      tasks = JSON.parse(jsonText);
    } catch {
      // Fallback: shuffle DEV_TASKS if parsing fails
      tasks = DEV_TASKS.sort(() => Math.random() - 0.5);
    }

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Error fetching AI tasks:", error);
    // Fallback: shuffle DEV_TASKS
    const shuffledTasks = DEV_TASKS.sort(() => Math.random() - 0.5);
    return NextResponse.json({ tasks: shuffledTasks });
  }
}