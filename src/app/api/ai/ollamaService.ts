const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434/api/generate";
const MODEL_NAME = process.env.OLLAMA_MODEL || "phi:latest"; // Changeable via .env

export async function callOllamaAI(prompt: string): Promise<string> {
  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: prompt,
        stream: false, // Ensures direct output without reasoning
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API returned ${response.status}`);
    }

    const data = await response.json();
    return data.response?.trim() || "Other";
  } catch (error) {
    console.error("Ollama API Error:", error);
    return "Other"; // Fallback category
  }
}
