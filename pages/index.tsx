import Home from '../components/pages/Home'
import Layout from '../components/common/layout'

export default function Index () {
  return (
    <Layout
      title={`Picsy - Art Search`}
      description="Picsy contains more than 6 million digital arts created by Midjourney - Image Generative AI. Picsy is the only platform that allows searching of Midjourney generated arts or images. You can collect or download these images using Picsy for general objectives including research, education, and personal experience."
    >
      <Home />
    </Layout>
  )
}
