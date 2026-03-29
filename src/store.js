// import { legacy_createStore as createStore } from 'redux'
import {configureStore,} from '@reduxjs/toolkit'
import accountReducer from './store/accountSlice'
import errorReducer from './store/errorSlice'
const initialState = {
  sidebarShow: true,
  theme: 'light',
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = configureStore({
  reducer: {
    changeState: changeState,
    account: accountReducer,
    error: errorReducer
  }
})
export default store
