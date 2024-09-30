import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/user'
import techInterviewReducer from './features/techInterview'
export const store = configureStore({
  reducer: {
    user: userReducer,
    techInterview: techInterviewReducer,

  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch