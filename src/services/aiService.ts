import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getProductAdvice(productName: string, productDescription: string, userQuery: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          text: `You are Velure Concierge, a high-end luxury fashion consultant for a 2026 boutique. 
          You are assisting a customer with the following product: ${productName}.
          Description: ${productDescription}
          
          User Query: ${userQuery}
          
          Respond with elegance, expertise, and a focus on craftsmanship, styling tips, and exclusivity. Keep it concise but sophisticated.`
        }
      ],
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Our concierge is currently attending to another guest. Please try again in a moment.";
  }
}

export async function getAdminInsights(orders: any[], products: any[]) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            text: `As an AI Luxury Business Analyst, analyze the current inventory and order history.
            Orders: ${JSON.stringify(orders)}
            Products: ${JSON.stringify(products)}
            
            Provide a brief executive summary of performance, top-moving items, and strategic inventory suggestions.`
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini Error:", error);
      return null;
    }
}
