export interface UserAnswerDTO {
  questionId: number;
  optionId: number;
}

export interface UserAnswer {
  id: number;
  questionId: number;
  selectedOptionId: number;
}

export interface SubmitTestDTO {
  username: string;
  answers: UserAnswerDTO[];
}

export interface TestResult {
  id: number;
  username: string;
  score: number;
  total: number;
  createdAt: Date;
  answers: UserAnswer[];
}
