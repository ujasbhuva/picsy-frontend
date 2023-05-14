import Home from "../../components/pages/Home";
import Layout from "../../components/common/layout";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();
  const { imageId } = router.query;
  return (
    <Layout
    title={`Picsy - Art Search`}
    description="Picsy contains more than 6 million digital arts created by Generative AI - Image Generative AI. Picsy is the only platform that allows searching of Generative AI generated arts or images. You can collect or download these images using Picsy for general objectives including research, education, and personal experience."
  >
      <Home imageId={imageId?.toString()} />
    </Layout>
  );
}
