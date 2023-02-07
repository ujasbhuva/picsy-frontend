import styles from '../../../styles/Home.module.css'
import Footer from './footer'
import Head from 'next/head'
import { ReactNode } from 'react'
import Header from './header'

export default function Layout ({
  title = '',
  description = '',
  children
}: {
  title?: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className={`font-satoshi relative dark:bg-none bg-gradient-to-r from-orange-300 via-orange-200 to-yellow-300`}>
      <Head>
        {title && <title>{title}</title>}
        {description && <meta name='description' content={description} />}
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {/* <Header /> */}
      <main
        className={`flex flex-col items-center min-h-[100vh] px-5 pb-[4rem] mobile:px-3`}
      >
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  )
}
