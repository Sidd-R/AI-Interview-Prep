import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { start } from "repl";

export interface TechInterviewState {
  questions: string[];
  answers: string[];
  currentAnswer: string;
  code: string;
  resumeText: string;
  hasStarted: boolean;
  scores: any[];
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
    }
  },
});

export const { nextQuestion, setCode, setResumeText, startInterview, addScore } = techInterviewSlice.actions;
export default techInterviewSlice.reducer;