import Head from 'next/head'
import { useRouter } from 'next/router'
import GenerateImage from '../components/pages/GenerateImage'
import AuthLayout from '../components/common/authLayout'

export default function Index () {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Generate Image</title>
        <meta name='description' content='Generate Image' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AuthLayout children={<GenerateImage />} />
    </>
  )
}
