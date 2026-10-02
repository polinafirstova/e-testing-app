export interface UserAnswer {
  id: number;
  questionId: number;
  selectedOptionId: number;
  correctAnswer: number;
}

export interface UserAnswerDTO {
  questionId: number;
  optionId: number;
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
  createdAt: string;
  answers: UserAnswer[];
}
