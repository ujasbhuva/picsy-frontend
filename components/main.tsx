import { NextComponentType, NextPage, NextPageContext } from 'next'
import { ReactElement, ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'

export type NextPageWithLayout<P = {}> = NextPage<P, P> & {
  getLayout?: (page: ReactElement) => ReactNode
}

interface MainProps {
  Component: NextComponentType<NextPageContext, any, {}> & NextPageWithLayout
  pageProps: any
}

const Main: React.FC<MainProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Toaster position='bottom-center' />
      <Component {...pageProps} />
    </>
  )
}

export default Main
