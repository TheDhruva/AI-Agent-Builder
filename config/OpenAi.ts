import OpenAi from "openai";

const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

export const openai = new OpenAi({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: apiKey ?? "",
});