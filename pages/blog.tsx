import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Index() {
  return (
    <>
      <Head>
        <title>Picsy - blog</title>
        <meta
          name="description"
          content="Picsy Art blogs - Power of AI in Art"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="msvalidate.01" content="223D9979439CC0D3878A9B5736BC49F9" />
      </Head>
      <div className="w-full p-10 flex flex-col items-center font-satoshi mobile:p-5">
        <h1 className="text-[3rem] font-semibold mb-[3rem] mobile:text-[1.5rem] tablet:text-[1.5rem]">
          Picsy Art blogs - Power of AI in Art
        </h1>
        <div className="w-8/12 mobile:w-full tablet:w-full">
          <div className="w-full grid grid-cols-3 mobile:grid-cols-1 tablet:grid-cols-2 gap-10">
            <div className="rounded-xl cursor-pointer bg-black-2">
              <Link
                href={
                  "/blog/generative-ai-for-images-a-revolutionary-innovation"
                }
              >
                <Image
                  src={
                    "https://api.picsy.art/image/990816855088328734/1075328060997517322/birdlg_neural_network_chatbot_603f9e9b-c34f-4538-b59d-1fc9d559dd10.png"
                  }
                  height={200}
                  width={350}
                  alt="Image by picsy"
                  className="object-cover w-full h-80 rounded-t-xl shadow-lg tablet:h-60"
                />
                <div className="p-3">
                  <h2 className="text-blue-1 text-xl mb-2">
                    Generative AI for Images - A Revolutionary Innovation
                  </h2>
                  <p className="text-gray-400 text-md">
                    Generative AI for images, also known as GANs, is a rapidly
                    evolving field that has made a significant impact on the
                    creative industry.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
