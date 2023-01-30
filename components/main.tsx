import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { NextComponentType, NextPage, NextPageContext } from 'next'
import { ReactElement, ReactNode } from 'react'
import { Toaster, resolveValue } from 'react-hot-toast'

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
      <Toaster position='bottom-left'>
        {t => (
          <div className='bg-orange-500 text-lg text-white px-4 py-2 gap-2 rounded-lg flex items-center'>
            <CheckCircleIcon className='w-6 h-6' />
            {resolveValue(t.message, t)}
          </div>
        )}
      </Toaster>
      <Component {...pageProps} />
    </>
  )
}

export default Main
