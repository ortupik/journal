export const PROMPTS = {
  category: (content: string) =>
    `Classify the following journal entry into one of these predefined categories: [Personal, Work, Travel, Health, Other]. 
  
  Return only the most relevant category name from this list—no explanations, no additional text.
  
  Journal Entry: "${content}"
  
  Output only: (Personal, Work, Travel, Health, Other) - No other text allowed`,

  sentiment: (content: string) =>
    `Determine the sentiment of the following journal entry. 
  
  Respond with only one of the following labels: "Positive", "Neutral", or "Negative". No explanations.
  
  Journal Entry: "${content}"
  
  Output only: (Positive, Neutral, Negative)`,

  summary: (content: string) =>
    `Summarize the following journal entry in one clear and concise sentence.  
  
    Ensure the summary explicitly includes **who** performed the action.  
    - If the user wrote about themselves, use "I".  
    - If a name is mentioned, use the person's name.  
    - Otherwise, use an appropriate pronoun like "they", "him", or "her".  
  
    Journal Entry: "${content}"  
  
    Output only: (A one-sentence summary including the subject of the action and what they did)`, 

  suggestions: (content: string) =>
    `Provide grammatical error suggestions on how to improve the wording.  
  
    Keep the suggestions short and grammatically correct in a single sentence.  
  
    Journal Entry: "${content}"  
  
    Output only: (A single-sentence suggestion)`,
};
