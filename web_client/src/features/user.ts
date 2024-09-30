import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type Skill = {
  skill: string;
  rating: number;
}

export interface UserState {
  id: string;
  name: string;
  email: string;
  skills: Skill[];
  isLoggedIn: boolean;
}

const initialState: UserState = {
  id: '',
  name: '',
  email: '',
  skills: [],
  isLoggedIn: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
   loginUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.skills = action.payload.skills;
      state.isLoggedIn = true;

      localStorage.setItem('login',JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.id = '';
      state.name = '';
      state.email = '';
      state.skills = [];
      state.isLoggedIn = false;
      localStorage.removeItem('login');
    },
  },
})

// Action creators are generated for each case reducer function
export const { loginUser, logoutUser } = userSlice.actions

export default userSlice.reducer