import {
  ArrowsPointingOutIcon,
  PhotoIcon,
  ScaleIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { generateImages } from '../../../apiHelper/images'
import { getToken } from '../../../utils/auth'
import ImageRatioCombobox from '../../combobox/imageRatioCombobox'
import SchedulerCombobox from '../../combobox/schedulerCombobox'
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

export default function GenerateImage () {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [output, setOutput] = useState<any>()
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
        <h1 className='text-[1.5rem] flex gap-2 items-center mobile:text-[1.5rem] tablet:text-[1.5rem] font-bold'>
          Generate Images <SparklesIcon className='w-6 h-6' />
        </h1>
      </div>
      <div className='w-full flex items-start justify-start gap-5'>
        <div className='w-9/12 flex flex-col items-start gap-6'>
          <div className='w-full flex rounded-xl justify-center items-center gap-3 z-10'>
            <textarea
              className={`scrollbar-hide overflow-scroll w-full p-3.5 py-1.5 rounded-2xl outline-none bg-[#131f29] placeholder:opacity-70 h-14 max-h-30 border-[2px] mr-2 text-md ${
                inputError?.prompt
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
              className={`h-14 rounded-2xl px-8 py-2 border-[2px] font-bold text-md outline-none w-34 disabled:cursor-not-allowed ${
                !isLoading
                  ? 'bg-gradient-to-tr from-blue-2 to-teal-500 border-blue-1'
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
          <div className='w-full flex items-center justify-center mt-4'>
            <div className={`w-full flex justify-center items-center`}>
              {output?.data?.output.images.length > 0 ? (
                <>
                  <div
                    className={`w-full grid ${
                      inputs.count === '5'
                        ? 'grid-cols-3'
                        : inputs.count === '1'
                        ? 'grid-cols-1'
                        : inputs.count === '3'
                        ? 'grid-cols-3'
                        : 'grid-cols-2'
                    } gap-2`}
                  >
                    {output?.data?.output.images.map((data: string) => {
                      return (
                        <img
                          src={data}
                          className='rounded-xl max-h-[calc(100vh-208px)]'
                        />
                      )
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`w-full flex items-center text-2xl justify-center z-[5] h-[calc(100vh-208px)] opacity-20`}
                  >
                    <div className='rounded-xl bg-blue-1 bg-opacity-20 flex items-center justify-center p-24 border-2 border-blue-1 border-opacity-20 gap-4'>
                    <PhotoIcon className='w-16 h-16 text-blue-1' />{' '}
                    <XMarkIcon className='w-8 h-8' /> {inputs.count}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className='w-3/12 flex flex-col items-center justify-center gap-6 z-[5]'>
          <div className='w-full animate-roll-in rounded-xl bg-[#131f29] p-4 max-h-[calc(100vh-110px)] border-2 border-blue-1 border-opacity-10 overflow-y-auto scrollbar scrollbar-thumb-blue-1 scrollbar-track-black-1 scrollbar-w-1 scrollbar-track-rounded-full scrollbar-thumb-rounded-full'>
            <div className='w-2/3 sm:w-full'>
              <p className='text-md flex items-center gap-2 font-bold'>
                <span>
                  <ArrowsPointingOutIcon className='w-6 h-6' />
                </span>{' '}
                Image Ratio
              </p>
              <ImageRatioCombobox
                selected={ratios.find(val => {
                  if (
                    val.width === inputs.width &&
                    val.height === inputs.height
                  ) {
                    return val
                  }
                })}
                setSelected={(value: any) => {
                  setInputs((preVal: any) => {
                    return {
                      ...preVal,
                      width: value.width,
                      height: value.height
                    }
                  })
                }}
              />
            </div>
            <div className='w-2/3 sm:w-full'>
              <p className='text-md flex items-center gap-2 font-bold mt-8'>
                <RectangleGroupIcon /> Scheduler
              </p>
              <SchedulerCombobox
                selected={inputs.scheduler}
                setSelected={(value: any) => {
                  setInputs((preVal: any) => {
                    return {
                      ...preVal,
                      scheduler: value.value
                    }
                  })
                }}
              />
            </div>
            <div className='w-2/3 sm:w-full'>
              <p className='text-md flex items-center gap-2 font-bold mt-8'>
                <span>
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
                      d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
                    />
                  </svg>
                </span>
                Image Count
              </p>
              <div className='flex gap-2 mt-3 items-center'>
                <div className='p-1.5 text-center rounded-lg outline-none bg-blue-1 bg-opacity-10 placeholder:opacity-70 border-[2px] border-white border-opacity-20 mr-2 text-sm w-12'>
                  {inputs.count}
                </div>
                <div className='flex flex-col space-y-2 w-64'>
                  <input
                    type='range'
                    className='w-full outline-none'
                    min='1'
                    max='4'
                    step='1'
                    value={inputs.count}
                    onChange={e => {
                      setInputs((preVal: any) => {
                        return { ...preVal, count: e.target.value }
                      })
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='w-2/3 sm:w-full'>
              <p className='text-md flex items-center gap-2 font-bold mt-8'>
                <ScaleIcon className='w-6 h-6' /> Guidance Scale
              </p>
              <div className='flex gap-2 mt-3 items-center'>
                <div className='p-1.5 text-center rounded-lg outline-none bg-blue-1 bg-opacity-10 placeholder:opacity-70 border-[2px] border-white border-opacity-20 mr-2 text-sm w-12'>
                  {inputs.guidance_scale}
                </div>
                <div className='flex flex-col space-y-2 w-64'>
                  <input
                    type='range'
                    className='w-full outline-none'
                    min='1'
                    max='10'
                    step='0.1'
                    value={inputs.guidance_scale}
                    onChange={e => {
                      setInputs((preVal: any) => {
                        return {
                          ...preVal,
                          guidance_scale: e.target.value
                        }
                      })
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='w-2/3 sm:w-full'>
              <p className='text-md flex items-center gap-2 font-bold mt-8'>
                <BoltIcon /> Prompt Strength
              </p>
              <div className='flex gap-2 mt-3 items-center'>
                <div className='p-1.5 text-center rounded-lg outline-none bg-blue-1 bg-opacity-10 placeholder:opacity-70 border-[2px] border-white border-opacity-20 mr-2 text-sm w-12'>
                  {inputs.prompt_strength}
                </div>
                <div className='flex flex-col space-y-2 w-64'>
                  <input
                    type='range'
                    className='w-full outline-none'
                    min='0.5'
                    max='1'
                    step='0.01'
                    value={inputs.prompt_strength}
                    onChange={e => {
                      setInputs((preVal: any) => {
                        return {
                          ...preVal,
                          prompt_strength: e.target.value
                        }
                      })
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='w-2/3 sm:w-full'>
              <p className='text-md flex items-center gap-2 font-bold mt-8'>
                <SquareStackIcon /> Inference Steps
              </p>
              <div className='flex gap-2 mt-3 items-center'>
                <div className='p-1.5 text-center rounded-lg outline-none bg-blue-1 bg-opacity-10 placeholder:opacity-70 border-[2px] border-white border-opacity-20 mr-2 text-sm w-12'>
                  {inputs.num_inference_steps}
                </div>
                <div className='flex flex-col space-y-2 w-64'>
                  <input
                    type='range'
                    className='w-full outline-none'
                    min='20'
                    max='80'
                    step='10'
                    value={inputs.num_inference_steps}
                    onChange={e => {
                      setInputs((preVal: any) => {
                        return {
                          ...preVal,
                          num_inference_steps: e.target.value
                        }
                      })
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className='bg-black h-full'>
          <Image
            // onClick={() => {
            //   setIsOpenDialog(true)
            //   setCurrentImage(data)
            // }}
            alt={"output"}
            className='object-cover rounded-xl'
            src={"https://api.picsy.art/image/989268410171006976/1071812133299433543/agabrielapaula_cute_babyrobot_in_orange_color_cartoon_d4743e33-b3da-4239-9da7-a91cb4e44ccc.png?width=1024&height=1024"}
            unoptimized
            width={1024}
            height={1024}
          />
        </div> */}
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
