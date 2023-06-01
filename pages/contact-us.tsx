import Head from 'next/head'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { supportContactCreate } from '../apiHelper/supportContact'

export default function Index () {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [nameErr, setNameErr] = useState<string>('')
  const [emailErr, setEmailErr] = useState<string>('')
  const [messageErr, setMessageErr] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>()

  const validate = () => {
    var validate = true
    if (!name) {
      setNameErr('Please provide your name')
      validate = false
    }
    if (!email) {
      setEmailErr('Please provide your email')
      validate = false
    }
    if (!message) {
      setMessageErr('Please provide message')
      validate = false
    }
    return validate
  }

  const handleSubmit = async (e: any) => {
    if (validate()) {
      e.preventDefault()
      try {
        setIsLoading(true)
        await supportContactCreate({ email, name, message })
        toast.success('Message received our team will revert back to you!')
      } catch (e: any) {
        console.log(e)
        toast.error(e?.response?.data?.message ?? 'Something went wrong')
      } finally {
        setIsLoading(false)
        setName('')
        setEmail('')
        setMessage('')
        setNameErr('')
        setEmailErr('')
        setMessageErr('')
      }
    } else {
      toast.error('Please fill out all details')
    }
  }

  return (
    <>
      <Head>
        <title>Contact us</title>
        <meta name='description' content='Contact us' />
        <link rel='icon' href='/favicon.ico' />
        <meta name='msvalidate.01' content='223D9979439CC0D3878A9B5736BC49F9' />
      </Head>
      <div className='w-full p-10 flex flex-col items-center font-satoshi mobile:p-5'>
        <img
          src={'/full-logo.svg'}
          alt='Picsy'
          className='object-cover h-[50px] mobile:h-[30px] mb-5'
        />
        <h1 className='text-[3rem] font-semibold mb-[1rem] mobile:text-[1.5rem] tablet:text-[1.5rem]'>
          Contact us
        </h1>
        <p className='w-3/12 text-lg text-center mobile:w-full tablet:w-full mobile:p-5 tablet:p-5'>
          For any query regarding anything related to our service or sales
          please drop us an email on{' '}
          <span className='underline text-blue-1'>support@picsy.art</span>. our
          team will revert back as quickly as possible.
        </p>
        <p className='font-bold text-md my-4'>
          ---- Or fill out the form below ----
        </p>
        <div className='flex w-1/3 gap-4 mobile:w-full'>
          <div className='flex flex-col w-1/2 my-4'>
            <input
              className='text-lg border border-gray-600 bg-black mobile:w-full tablet:w-full mobile:p-5 tablet:p-5 rounded-xl px-3 py-2 focus:ring-2 outline-none focus:ring-gray-700 '
              placeholder='First name'
              value={name}
              onChange={e => {
                setNameErr(''), setName(e.target.value)
              }}
              disabled={isLoading}
            />
            {nameErr && <p className='text-red-500'>{nameErr}</p>}
          </div>
          <div className='flex flex-col w-1/2 my-4'>
            <input
              className='text-lg border border-gray-600 bg-black mobile:w-full tablet:w-full mobile:p-5 tablet:p-5 rounded-xl px-3 py-2 focus:ring-2 outline-none focus:ring-gray-700'
              placeholder='email'
              value={email}
              onChange={e => {
                setEmailErr(''), setEmail(e.target.value)
              }}
              disabled={isLoading}
            />
            {emailErr && <p className='text-red-500'>{emailErr}</p>}
          </div>
        </div>
        <div className='flex flex-col w-1/3 mb-4 mobile:w-full'>
          <textarea
            className='text-lg border border-gray-600 bg-black mobile:w-full tablet:w-full mobile:p-5 tablet:p-5 rounded-xl px-3 py-2 focus:ring-2 outline-none focus:ring-gray-700 h-[180px] max-h-[200px]'
            placeholder='Message'
            value={message}
            onChange={e => {
              setMessageErr(''), setMessage(e.target.value)
            }}
            disabled={isLoading}
          />
          {messageErr && <p className='text-red-500'>{messageErr}</p>}
        </div>
        <button
          className='w-1/3 py-2 bg-gray-900 outline-none rounded-xl mobile:w-full'
          onClick={handleSubmit}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </>
  )
}
