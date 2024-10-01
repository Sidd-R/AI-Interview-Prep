import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
// "grammar_score": assessment_scores[0],
// "relevancy_score": assessment_scores[1],
// "fluency_score": assessment_scores[2]
export type Score = {
  grammar_score: number;
  relevancy_score: number;
  fluency_score: number;
};

export interface TechInterviewState {
  questions: string[];
  answers: string[];
  currentAnswer: string;
  code: string;
  resumeText: string;
  hasStarted: boolean;
  scores: Score[];
}

const initialState: TechInterviewState = {
  questions: [],
  answers: [],
  currentAnswer: "",
  code: "",
  resumeText: "",
  hasStarted: false,
  scores: [],
};

export const techInterviewSlice = createSlice({
  name: "techInterview",
  initialState,
  reducers: {
    startInterview: (state) => {
      state.hasStarted = true;
    },
    nextQuestion: (state, action: PayloadAction<string>) => {
      state.questions = [...state.questions, action.payload];
    },
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setResumeText: (state, action: PayloadAction<string>) => {
      state.resumeText = action.payload;
    },
    addScore: (state, action: PayloadAction<any>) => {
      state.scores = [...state.scores, action.payload];
    },
    endInterview: (state) => {
      state.hasStarted = false;
    }
  },
});

export const { nextQuestion, setCode, setResumeText, startInterview, addScore, endInterview } = techInterviewSlice.actions;
export default techInterviewSlice.reducer;