export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type LeadRelevance = 'Not relevant' | 'Weak lead' | 'Hot lead' | 'Very big potential customer';

export interface Lead {
  email: string;
  companyName: string;
  relevanceTag: LeadRelevance;
  score: number;
  chatHistory: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatResponse {
  response: string;
  relevanceTag: LeadRelevance;
}
