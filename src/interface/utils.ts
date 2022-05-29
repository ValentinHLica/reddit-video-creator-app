export type ExamOptions = "solved" | "help" | "normal";

export type Question = {
  text: string;
  answer: boolean;
  image?: string;
};

export type QuestionData = {
  withImage: Question[];
  noImage: Question[];
};

export type QuestionList = Question & {
  userAnswer: boolean | null;
};
