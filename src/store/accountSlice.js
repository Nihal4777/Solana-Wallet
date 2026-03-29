import { createSlice } from '@reduxjs/toolkit'
const accountSlice = createSlice({
  name: 'account',
  initialState: {
    accounts: [],
    selected : null
  },
  reducers: {
    addAccount: (state, action) => {
      state.accounts=action.payload;
    },
    changeAccount:(state,action)=>{
      state.selected=action.payload
    }
  },
})
export const { addAccount,changeAccount } = accountSlice.actions
export default accountSlice.reducer