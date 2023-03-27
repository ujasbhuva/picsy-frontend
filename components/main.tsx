import {
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/20/solid'
import { NextComponentType, NextPage, NextPageContext } from 'next'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { Toaster, resolveValue } from 'react-hot-toast'
import { getCurrentBrowserFingerPrint } from '@rajesh896/broprint.js'
import { freeLogin } from '../apiHelper/browser'
import axios from 'axios'

export type NextPageWithLayout<P = {}> = NextPage<P, P> & {
  getLayout?: (page: ReactElement) => ReactNode
}

interface MainProps {
  Component: NextComponentType<NextPageContext, any, {}> & NextPageWithLayout
  pageProps: any
}

const Main: React.FC<MainProps> = ({ Component, pageProps }) => {
  const [showChild, setShowChild] = useState(false)

  useEffect(() => {
    setShowChild(true)
  }, [])

  useEffect(() => {
    getCurrentBrowserFingerPrint().then(async (fingerprint: string) => {
      const res = await axios.get('https://geolocation-db.com/json/')
      let country = res.data.country_name
      let ip = res.data.IPv4
      await freeLogin({
        browser_token: fingerprint,
        client_country: country,
        client_ip: ip
      })
    })
  }, [])

  if (!showChild) {
    return null
  } else {
    return (
      <>
        <Toaster position='bottom-left'>
          {t => (
            <>
              {t.type === 'success' && (
                <div className='bg-blue-2 text-white px-4 py-2 gap-2 rounded-lg flex items-center'>
                  <CheckCircleIcon className='w-6 h-6' />
                  {resolveValue(t.message, t)}
                </div>
              )}
              {t.type === 'error' && (
                <div className='bg-red-400 text-white px-4 py-2 gap-2 rounded-lg flex items-center'>
                  <ExclamationCircleIcon className='w-6 h-6' />
                  {resolveValue(t.message, t)}
                </div>
              )}
            </>
          )}
        </Toaster>
        <Component {...pageProps} />
      </>
    )
  }
}

export default Main
