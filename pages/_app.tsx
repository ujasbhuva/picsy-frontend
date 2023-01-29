import '../styles/globals.css'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import { configureStore } from '@reduxjs/toolkit'
import reducers from '../store/reducers'
import Main from '../components/main'

const preloadedState = {}
const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware: any) =>
    process.env.NEXT_PUBLIC_ENV !== 'prod'
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware(),
  devTools: process.env.NEXT_PUBLIC_ENV !== 'prod',
  preloadedState
})

export default function App (props: any) {

  return (
    <>
      <Provider store={store}>
        <Main {...props} />
      </Provider>
    </>
  )
}
