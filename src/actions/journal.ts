import sendApiReq from '@/app/api/utils/sendApiReq';
import endPoints from '@/app/api/utils/endPoints';
import { PROMPTS } from '@/app/api/ai/prompts'; // ✅ Import prompts

export type JournalEntryData = {
  title: string;
  content: string;
  category: string;
  sentiment: string;
  summary: string;
  suggestions: string;
};

export type JournalResponse = {
  id: string;
  title: string;
  content: string;
  category: string;
  sentiment: string;
  summary: string;
  suggestions: string;
  createdAt: string;
  updatedAt: string;
};

// ✅ Fetch all journal entries
export function getAllJournals(): Promise<JournalResponse[]> {
  return sendApiReq<JournalResponse[]>({
    url: endPoints.journals,
    method: 'GET'
  });
}

// ✅ Fetch a single journal entry by ID
export function getJournalById(id: string): Promise<JournalResponse> {
  return sendApiReq<JournalResponse>({
    url: `${endPoints.journals}/${id}`,
    method: 'GET'
  });
}

// ✅ Create a new journal entry
export function createJournal(
  data: JournalEntryData
): Promise<JournalResponse> {
  return sendApiReq<JournalResponse>({
    url: endPoints.journals,
    method: 'POST',
    data
  });
}

// ✅ Update an existing journal entry
export function updateJournal(
  id: string,
  data: JournalEntryData
): Promise<JournalResponse> {
  return sendApiReq<JournalResponse>({
    url: `${endPoints.journals}/${id}`,
    method: 'PUT',
    data
  });
}

// ✅ Delete a journal entry
export function deleteJournal(id: string): Promise<{ message: string }> {
  return sendApiReq<{ message: string }>({
    url: `${endPoints.journals}/${id}`,
    method: 'DELETE'
  });
}

// ✅ Supported AI Processing Types
export type PromptType = keyof typeof PROMPTS;

// ✅ Centralized AI Processing Function
export function processAI<T>(
  promptType: PromptType,
  content: string
): Promise<T> {
  return sendApiReq<T>({
    url: `${endPoints.journals}/process-ai`,
    method: 'POST',
    data: { promptType, content },
    isAuthenticated: false // ✅ AI processing may not require authentication
  });
}

// ✅ Suggest a category based on content
export function suggestCategory(
  content: string
): Promise<{ suggestedCategory: string }> {
  return processAI<{ suggestedCategory: string }>('category', content);
}

// ✅ Determine sentiment analysis
export function suggestSentiment(
  content: string
): Promise<{ sentiment: string }> {
  return processAI<{ sentiment: string }>('sentiment', content);
}

// ✅ Generate a summary of the journal entry
export function generateSummary(content: string): Promise<{ summary: string }> {
  return processAI<{ summary: string }>('summary', content);
}
