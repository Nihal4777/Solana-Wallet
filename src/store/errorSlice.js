import { createSlice } from '@reduxjs/toolkit';
const errorSlice = createSlice({
  name: 'error',
  initialState: {
    message: "",
    id : null
  },
  reducers: {
    showError: (state, action) => {
      state.id = Date.now()
      state.message=action.payload;
    },
  },
})
export const { showError } = errorSlice.actions
export default errorSlice.reducer