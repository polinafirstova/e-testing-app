import type { Option } from "./Option";

export interface Question {
  id: number;
  text: string;
  options: Option[];
  isHidden: boolean;
}

export interface AdminQuestion {
  id: number;
  text: string;
  options: Option[];
  isHidden: boolean;
  correctAnswerId: number;
}

export type CreateQuestionData = {
  text: string;
  isHidden: boolean;
  options: string[];
  correctAnswerIndex: number;
};

export type EditQuestionData = {
  id: number;
  text: string;
  isHidden: boolean;
  options: { id: number; text: string }[];
  correctAnswerId: number;
};
