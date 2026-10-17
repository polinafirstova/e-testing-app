export interface TestHistoryItem {
  id: number;
  username: string;
  score: number;
  total: number;
  createdAt: string;
}

export interface StatSummary {
  totalPasses: number;
  averageScore: number;
  maxScore: number;
}
