import Head from 'next/head'

export default function Index () {
  return (
    <>
      <Head>
        <title>About us</title>
        <meta name='description' content='About us' />
        <link rel='icon' href='/favicon.ico' />
        <meta name='msvalidate.01' content='223D9979439CC0D3878A9B5736BC49F9' />
      </Head>
      <div className='w-full p-10 flex flex-col items-center font-satoshi mobile:p-5'>
        <h1 className='text-[3rem] font-semibold mb-[3rem] mobile:text-[1.5rem] tablet:text-[1.5rem]'>
          About us
        </h1>
        {/* <p className='w-3/12 text-lg text-center mt-5'>
          After searching for 
        </p> */}
      </div>
    </>
  )
}
