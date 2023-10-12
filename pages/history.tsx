import Head from 'next/head'
import { useRouter } from 'next/router'
import AuthLayout from '../components/common/authLayout'
import ImageGenerationHistory from '../components/pages/GenerationHistory'

export default function Index () {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Image Generation History</title>
        <meta name='description' content='Image Generation History' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AuthLayout children={<ImageGenerationHistory />} />
    </>
  )
}
