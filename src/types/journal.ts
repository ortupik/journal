export interface JournalEntry {
    id: string;
    title: string;
    content: string;
    category?: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  }
  