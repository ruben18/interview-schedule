import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: "",
    email: "",
    token: "",
    role: ""
  },
  reducers: {
    login: (state, action) => {
      state.name = action.payload.user.name;
      state.email = action.payload.user.email;
      state.token = action.payload.token;
      state.role = action.payload.user.role;
    },
    logout: (state, action) => {
      state.name = "";
      state.email = "";
      state.token = "";
      state.role = "";
    },
  },
})

export const { login, logout } = userSlice.actions

export default userSlice.reducer