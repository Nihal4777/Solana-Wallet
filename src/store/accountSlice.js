import { createSlice } from '@reduxjs/toolkit'
const accountSlice = createSlice({
  name: 'account',
  initialState: {
    accounts: [],
    selected: null
  },
  reducers: {
    addAccount: (state, action) => {
      state.accounts.push(action.payload);
      if (state.accounts.length == 1) {
        state.selected = state.accounts[0]
      }
    },
    setAccounts: (state, action) => {
      state.accounts = action.payload;
      if (state.accounts.length == 1) {
        state.selected = state.accounts[0]
      }
    }
  },
})
export const { addAccount,setAccounts } = accountSlice.actions
export default accountSlice.reducer