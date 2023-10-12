import Head from 'next/head'
import { ReactNode, useState } from 'react'
import Sidebar from './sidebar'

export default function AuthLayout ({
  title = '',
  description = '',
  children
}: {
  title?: string
  description?: string
  children: ReactNode
}) {
  const [openWaitList, setOpenWaitList] = useState(false)
  return (
    <div className={`font-satoshi bg-black-1 relative`}>
      <Head>
        {title && <title>{title}</title>}
        {description && <meta name='description' content={description} />}
        <link rel='icon' href='/favicon.ico' />
        <meta name='msvalidate.01' content='223D9979439CC0D3878A9B5736BC49F9' />
      </Head>
      <main className={`flex min-h-[100vh] w-full`}>
        <Sidebar />
        <div className='flex w-[85%] items-start max-h-screen overflow-y-auto px-8 py-5 mobile:px-3'>
          <img className='z-0 w-full object-contain fixed top-0 right-0 left-0' src={'/images/globalbg.avif'} />
          <div className='z-[5] w-full'>{children}</div>
        </div>
      </main>
    </div>
  )
}
