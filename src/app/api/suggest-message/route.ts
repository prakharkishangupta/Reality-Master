// route.ts

import { GoogleGenerativeAI } from "@google/generative-AI"; // Assuming you're using Gemini

// **Security:** Never expose the API key directly in the code.
// Use environment variables or a secure configuration management system.

// **Example (replace with your actual retrieval method):**
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function GET(req: Request) {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY environment variable");
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

//   async function suggestMessage() {
    try {
      // **Model Selection:**
      // Choose the appropriate model based on your specific needs.
      // Gemini 1.5 models are versatile, but explore other options if necessary.
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // **Prompt:**
      const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What is a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be? || What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
        console.log(text);
        return new Response(JSON.stringify({ message: text }), {
            status: 200,
            headers: { "Content-Type": "application/json" }, // Set appropriate content type
          });
    //   return text;
    } catch (error) {
      console.error("Error generating suggestion:", error);
       // Handle errors gracefully
       return Response.json({
        success: false
       })
    }
//   }

//   const suggestedMessage = await suggestMessage();

//   return new Response(JSON.stringify({ message: suggestedMessage }), {
//     status: 200,
//     headers: { "Content-Type": "application/json" }, // Set appropriate content type
//   });
}
