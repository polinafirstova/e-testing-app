import { Option } from "./Option";

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
  correctAnswerId: number;
  isHidden: boolean;
}
