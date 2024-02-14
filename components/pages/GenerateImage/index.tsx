import {
  PhotoIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { generateImages } from '../../../apiHelper/images'
import { getToken } from '../../../utils/auth'
import { CommonLoader } from '../../common/loader/CommonLoader'

export const ratios: any[] = [
  {
    name: 'Square (1024 x 1024)',
    width: 1024,
    height: 1024,
    class: 'w-[20.48px] h-[20.48px]'
  },
  {
    name: 'Portrait (683 x 1024)',
    width: 683,
    height: 1024,
    class: 'w-[13.66px] h-[20.48px]'
  },
  {
    name: 'Mobile (576 x 1024)',
    width: 576,
    height: 1024,
    class: 'w-[11.52px] h-[20.48px]'
  },
  {
    name: 'Desktop (1024 x 576)',
    width: 1024,
    height: 576,
    class: 'w-[20.48px] h-[11.52px]'
  },
  {
    name: 'Squarish (819 x 1024)',
    width: 819,
    height: 1024,
    class: 'w-[16.38px] h-[20.48px]'
  },
  {
    name: 'Photo (1024 x 768)',
    width: 1024,
    height: 768,
    class: 'w-[20.48px] h-[15.36px]'
  },
  {
    name: 'Cinematic (1024 x 455)',
    width: 1024,
    height: 455,
    class: 'w-[20.48px] h-[9.1px]'
  }
]

export default function GenerateImage() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [output, setOutput] = useState<any>()
  const [currentURI, setCurrentURI] = useState("")
  const [inputError, setInputError] = useState<any>({})
  const [inputs, setInputs] = useState<any>({
    prompt: '',
    width: 1024,
    height: 1024,
    count: 2,
    guidance_scale: 7.5,
    scheduler: 'DDIM',
    high_noise_frac: 0.8,
    prompt_strength: 0.8,
    num_inference_steps: 50
  })

  useEffect(() => {
    if (!getToken()) {
      router.push('/')
    }
  }, [])

  const generateImage = async () => {
    try {
      setIsLoading(true)
      if (!inputs.prompt) {
        setInputError((preVal: any) => {
          return { ...preVal, prompt: 'Please enter a value' }
        })
      } else {
        const res = await generateImages(inputs)
        setOutput(res)
        setCurrentURI(res?.data?.output.images[0])
      }
    } catch (err: any) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className='w-full pb-5 flex gap-3 font-satoshi mobile:p-2 z-10'>
        <h1 className='text-[1.5rem] flex gap-2 mobile:text-[1.5rem] tablet:text-[1.5rem] font-bold items-end'>
          Generate Images <SparklesIcon className='w-6 h-6' />
          <i className='font-thin text-gray-500 text-sm'>powered by <strong>Meta</strong></i>
        </h1>
      </div>
      <div className='w-full flex items-center justify-center gap-5'>
        <div className='w-9/12 flex flex-col items-start gap-3 mobile:w-full mobile:flex-col tablet:w-full'>
          <div className='w-full flex rounded-xl justify-center items-center gap-3 z-10 mobile:flex-col'>
            <textarea
              className={`scrollbar-hide overflow-scroll w-full p-3.5 py-1.5 rounded-2xl outline-none bg-[#131f29] placeholder:opacity-70 h-14 max-h-[150px] min-h-[55px] border mr-2 text-md mobile:rounded-xl mobile:mr-0 mobile:mt-8 ${inputError?.prompt
                ? 'border-orange-500 border-opacity-70'
                : 'border-white border-opacity-20'
                }`}
              placeholder='Image description'
              name='prompt'
              value={inputs.prompt}
              onChange={e => {
                setInputError((preVal: any) => {
                  return { ...preVal, prompt: '' }
                })
                setInputs((preVal: any) => {
                  return { ...preVal, prompt: e.target.value }
                })
              }}
            />
            <button
              className={`h-14 rounded-2xl px-8 py-1.5 border text-md outline-none w-34 disabled:cursor-not-allowed mobile:w-full mobile:h-10 mobile:rounded-xl ${!isLoading
                ? 'bg-gradient-to-tr from-blue-2 to-teal-500 border-blue-1 flex items-center justify-center'
                : 'bg-gray-800 border-gray-700'
                }`}
              onClick={generateImage}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <CommonLoader childClassName='w-7 h-7 border-[3px]' />
                </>
              ) : (
                'Generate'
              )}
            </button>
          </div>
          {isLoading && (
            <p className='text-sm text-blue-1'>
              Hold up for a while this may take a minute...
            </p>
          )}
          <div className='w-full flex items-center justify-center mt-4 mobile:mt-8'>
            <div className={`w-full flex justify-center items-center mobile:flex-col`}>
              {output?.data?.output.images.length > 0 ?
                (
                  <div className='w-full flex items-center justify-center mobile:flex-col'>
                    <div
                      className={`w-8/12 flex mobile:w-full mobile:h-[calc(100vw)] tablet:h-[500px] items-center text-2xl justify-center h-[calc(100vh-208px)] text-blue-1`}
                    >
                      <img
                        src={currentURI}
                        className='rounded-xl w-full object-contain'
                      />
                    </div>
                    <div className='flex flex-col ml-6 gap-3 mobile:flex-row mobile:w-full mobile:mx-2 mobile:items-center mobile:justify-center'>
                      {output?.data?.output.images.map((val: string) => {
                        return (
                          <div
                            className={`rounded-xl gap-4 mt-2 cursor-pointer flex items-center justify-center ${currentURI === val ? "ring-2 ring-blue-1" : ""}`}
                            onClick={() => { setCurrentURI(val) }}
                            key={val}
                          >
                            <img
                              src={val ?? ""}
                              className='rounded-xl w-28 h-28 mobile:h-20 mobile:w-20 tablet:w-20 tablet:h-20'
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className='w-full flex items-center justify-center mobile:flex-col'>
                      <div
                        className={`w-8/12 mobile:w-full mobile:h-[calc(100vw)] tablet:h-[500px] tablet:w-[500px] flex items-center text-2xl justify-center h-[calc(100vh-208px)] opacity-20 text-blue-1`}
                      >
                        <div className='rounded-xl bg-blue-1 bg-opacity-20 flex items-center justify-center w-full h-full border-2 border-blue-1 border-opacity-20 gap-4'>
                          <PhotoIcon className='w-16 h-16' strokeWidth={0.8} />{' '}
                          <XMarkIcon className='w-8 h-8' /> 4
                        </div>
                      </div>
                      <div className='flex flex-col ml-6 gap-3 mobile:flex-row mobile:w-full mobile:mx-2'>
                        {[1, 2, 3, 4].map((val: number) => {
                          return (
                            <div className='rounded-xl bg-blue-1 bg-opacity-20 flex items-center justify-center w-28 h-28 border border-blue-1 border-opacity-20 gap-4 mt-2 opacity-40 mobile:h-22 mobile:w-22'
                              key={val}>
                              <PhotoIcon className='w-8 h-8' strokeWidth={0.5} />{' '}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const RectangleGroupIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={2}
      stroke='currentColor'
      className='w-6 h-6'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z'
      />
    </svg>
  )
}

const BoltIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={2}
      stroke='currentColor'
      className='w-6 h-6'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z'
      />
    </svg>
  )
}

const SquareStackIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='w-6 h-6'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3'
      />
    </svg>
  )
}
