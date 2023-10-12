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
  const [IPv4, setIPv4] = useState<string>('')
  const [fp, setFp] = useState<string>('')
  const [country, setCountry] = useState<string>('')

  useEffect(() => {
    setShowChild(true)
  }, [])

  useEffect(() => {
    try {
      getCurrentBrowserFingerPrint().then(async (fingerprint: string) => {
        const res = await axios.get('https://geolocation-db.com/json/')
        setCountry(res.data.country_name)
        setIPv4(res.data.IPv4)
        setFp(fingerprint)
      })
    } catch (err: any) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    if (fp) {
      freeLogin({
        browser_token: fp,
        client_country: country,
        client_ip: IPv4
      }).then(data => {})
    }
  }, [fp, country, IPv4])

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
