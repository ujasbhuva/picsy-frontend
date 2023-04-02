import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Index() {
  return (
    <>
      <Head>
        <title>tearms-of-use</title>
        <meta
          name="description"
          content="tearms-of-use"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="msvalidate.01" content="223D9979439CC0D3878A9B5736BC49F9" />
      </Head>
      <div className="w-full p-10 flex flex-col items-center font-satoshi mobile:p-5">
        <h1 className="text-[3rem] font-semibold mb-[3rem] mobile:text-[1.5rem] tablet:text-[1.5rem]">
          Terms of use
        </h1>
      </div>
    </>
  );
}
