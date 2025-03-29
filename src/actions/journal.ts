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

export function getAllJournals(): Promise<JournalResponse[]> {
  return sendApiReq<JournalResponse[]>({
    url: endPoints.journal,
    method: 'GET'
  });
}

export function getJournalById(id: string): Promise<JournalResponse> {
  return sendApiReq<JournalResponse>({
    url: `${endPoints.journal}/${id}`,
    method: 'GET'
  });
}

export function createJournal(
  data: JournalEntryData
): Promise<JournalResponse> {
  return sendApiReq<JournalResponse>({
    url: endPoints.journal,
    method: 'POST',
    data
  });
}

export function updateJournal(
  id: string,
  data: JournalEntryData
): Promise<JournalResponse> {
  return sendApiReq<JournalResponse>({
    url: `${endPoints.journal}/${id}`,
    method: 'PUT',
    data
  });
}

// ✅ Delete a journal entry
export function deleteJournal(id: string): Promise<{ message: string }> {
  return sendApiReq<{ message: string }>({
    url: `${endPoints.journal}/${id}`,
    method: 'DELETE'
  });
}

export type PromptType = keyof typeof PROMPTS;

export function processAI<T>(
  promptType: PromptType,
  content: string
): Promise<T> {
  return sendApiReq<T>({
    url: `${endPoints.journal}/process-ai`,
    method: 'POST',
    data: { promptType, content },
    isAuthenticated: false // ✅ AI processing may not require authentication
  });
}

export function suggestCategory(
  content: string
): Promise<{ suggestedCategory: string }> {
  return processAI<{ suggestedCategory: string }>('category', content);
}

export function suggestSentiment(
  content: string
): Promise<{ sentiment: string }> {
  return processAI<{ sentiment: string }>('sentiment', content);
}

export function generateSummary(content: string): Promise<{ summary: string }> {
  return processAI<{ summary: string }>('summary', content);
}
