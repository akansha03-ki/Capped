import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, profile, recentTransactions } = await req.json();

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) {
      return new Response("Error: Please check your API key in the .env.local file.", { 
        status: 500, 
        headers: { "Content-Type": "text/plain; charset=utf-8" } 
      });
    }

    const googleProvider = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    const systemPrompt = `You are the Capped Advisor, a sarcastic but surprisingly helpful financial advisor for college students. The app is called "Capped", implying budgeting caps.
    
  You must act slightly snarky and judge their spending habits (light roasting), but ultimately provide sound financial advice. 

  User Context:
  - Monthly Budget: Rs. ${profile?.monthlyBudget || "Unknown"}
  - Budget Destroyer Category: ${profile?.budgetDestroyer?.join(", ") || "Unknown"}
  - Spends mostly on: ${profile?.spendHabit || "Unknown"}

  Recent Transactions Context:
  ${recentTransactions?.map((t: any) => `- ${t.date.split('T')[0]}: ${t.title} (${t.category}) - Rs. ${t.amount} [${t.type}]`).join("\n") || "No recent transactions."}

  Instructions:
  - Keep your answers concise, witty, and punchy (max 3-4 short sentences).
  - Use Gen-Z slang occasionally but naturally.
  - When they mention spending on their "Budget Destroyer" category, roast them for it.
  - If they ask for suggestions, give practical tips to save money.
  `;

    const result = await streamText({
      model: googleProvider('gemini-1.5-pro'),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response("Error: Internal Server Error or missing API key.", { 
      status: 500, 
      headers: { "Content-Type": "text/plain; charset=utf-8" } 
    });
  }
}
