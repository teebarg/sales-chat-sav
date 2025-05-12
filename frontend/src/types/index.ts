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
  chatHistory: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatResponse {
  response: string;
  relevanceTag: LeadRelevance;
}

export interface ConversationState {
  hasAskedEmail: boolean;
  hasAskedCompany: boolean;
  hasAskedBudget: boolean;
  hasAskedTeamSize: boolean;
  hasAskedTimeline: boolean;
  hasFinishedQualifying: boolean;
  hasOfferedCalendly: boolean;
}