import { ArrowUpIcon, PhotoIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import {
  getImageByID,
  getImagesThroughNextAPI,
  iImage,
  iImagePayload
} from '../../../apiHelper/images'
import ImageDialog from '../../common/imageDialog'
import Loader from '../../common/loader/GlobalLoader'
import axios from 'axios'
import ImageBox from './ImageBox'
import { getToken } from '../../../utils/auth'
import LoginDialog from '../../common/loginDialog'

interface HomepageProps {
  imageId?: string
}

const Home: React.FC<HomepageProps> = () => {
  const router = useRouter()

  const [IPv4, setIPv4] = useState<string>('')
  const [country, setCountry] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const [offset, setOffset] = useState<number>(0)
  const [currentImage, setCurrentImage] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)
  const [images, setImages] = useState<iImagePayload[]>([])
  const [showButton, setShowButton] = useState(false)
  const [isLast, setIsLast] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    })
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const getImage = async () => {
    const { imageId: imgId } = router.query
    if (imgId) {
      const img = await getImageByID({ id: imgId as string })
      if (img.data.length > 0) {
        setCurrentImage(img.data[0])
        setIsOpenDialog(true)
      }
    }
  }

  useEffect(() => {
    getImage()
  }, [router])

  useEffect(() => {
    getData()
  }, [])

  const getBrowser = async () => {
    try {
      const res = await axios.get('https://geolocation-db.com/json/')
      setCountry(res.data.country_name)
      setIPv4(res.data.IPv4)
    } catch (err: any) {
      console.log(err)
    }
  }

  useEffect(() => {
    getBrowser()
  }, [])

  let fetching = false

  const getData = async (start?: boolean) => {
    if (!isLast) {
      try {
        fetching = true
        let inputs = searchText
          ? start
            ? {
              query: searchText,
              search_after: images[images.length - 1].id.toString(),
              location: country,
              ip: IPv4
            }
            : {
              query: searchText,
              location: country,
              ip: IPv4
            }
          : {
            type: 'random'
          }

        setIsLoading(true)
        const data = await getImagesThroughNextAPI(inputs)
        const arr = data?.images
        setImages((preval: any) => {
          return start ? [...preval, ...arr] : arr
        })
        setOffset(() => {
          return start ? offset + arr?.length : arr?.length
        })
        setIsLast(() => {
          return data.is_last
        })
      } catch (err: any) {
        console.log(err)
        toast.error('Sorry, we cannot proceed your request')
      } finally {
        fetching = false
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (
        document.documentElement.offsetHeight -
        (window.innerHeight + document.documentElement.scrollTop) >=
        200 &&
        document.documentElement.offsetHeight -
        (window.innerHeight + document.documentElement.scrollTop) <=
        2500
      ) {
        if (!fetching) {
          getData(true)
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [searchText, images, country, IPv4])

  return (
    <>
      {/* <button
        className='flex font-bold gap-1.5 items-center justify-end w-full p-2 z-[200000] bg-gradient-to-r from-blue-2 to-teal-500 absolute top-0 left-0 right-0'
        onClick={() => {
          if (getToken()) {
            router.push('/generateimage')
          } else {
            setIsOpen(true)
          }
        }}
      >
        <p>
          {getToken()
            ? 'Continue to dashboard'
            : 'Just Launched! Explore Our New Image Generator'}
        </p>
        <ImageIcon /> <ArrowRightIcon />
      </button>
      <LoginDialog isOpen={isOpen} setIsOpen={setIsOpen} /> */}
      <a
        className='flex font-bold gap-1.5 items-center justify-end w-full p-2 z-[200000] absolute top-0 left-0 right-0'
        target='_blank'
        href='https://play.google.com/store/apps/details?id=art.picsy.deltabits&pcampaignid=web_share'
      >
        <div className='flex px-5 py-1.5 rounded-full border-2 border-gray-200 items-center gap-2'>
          <p>
            Get android app now
          </p>
          <img
            className='w-8 h-8'
            src="/images/google-play.png" />
        </div>
      </a>
      <LoginDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      {isLoading && <Loader loading={isLoading} />}
      <div className='flex flex-col items-start mt-20 mobile:mt-6'>
        <div className='flex flex-col justify-center cursor-pointer'>
          <img
            src={'/full-logo.svg'}
            alt='Picsy'
            className='object-cover h-[80px] mobile:h-[40px]'
            onClick={() => {
              setSearchText('')
              router.reload()
            }}
          />
        </div>
        <div className='items-center text-blue-1 mobile:mt-1 gap-1'>
          <h1 className='text-2xl mobile:text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-2 to-teal-500'>
            #1 Searching tool for AI generated images
          </h1>
        </div>
      </div>
      <div className='mb-16 w-2/5 sm:w-2/5 mobile:w-full tablet:w-3/5 max-w-[600px] flex justify-end items-center relative mt-16 mobile:my-8'>
        <input
          className=' w-full p-3 text-white bg-blue-2 bg-opacity-20 rounded-xl border-0 outline-0 focus:ring-2 focus:ring-opacity-40 focus:ring-blue-2'
          placeholder='Search images'
          onChange={e => setSearchText(e.target.value)}
          value={searchText}
          required={true}
          disabled={isLoading}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              setIsLast(false)
              getData(false)
            }
          }}
        />
        <div className='flex absolute mr-2 itams-center text-white bg-black-2 '>
          <button disabled={isLoading}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 25 25'
              strokeWidth={1.5}
              stroke='currentColor'
              className='cursor-pointer h-7 w-7 bg-blue-2 bg-opacity-10'
              onClick={() => {
                setIsLast(false)
                getData(false)
              }}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
              />
            </svg>
          </button>
          <button disabled={isLoading || !searchText}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='cursor-pointer h-7 w-7 bg-blue-2 bg-opacity-10'
              onClick={() => setSearchText('')}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
      </div>

      <div className='w-full mb-10 mt-3'>
        {images?.length > 0 ? (
          <ResponsiveMasonry
            columnsCountBreakPoints={{
              0: 2,
              400: 2,
              750: 3,
              900: 4,
              1300: 5,
              1500: 6,
              1800: 7
            }}
          >
            <Masonry gutter='5px'>
              {images.map((data: any, index: number) => {
                const current = data.images.sort(
                  (a: iImage, b: iImage) =>
                    Number(b.upscaled) - Number(a.upscaled)
                )[0]
                return (
                  <ImageBox
                    key={index}
                    setIsOpenDialog={setIsOpenDialog}
                    setCurrentImage={setCurrentImage}
                    data={data}
                    current={current}
                  />
                )
              })}
            </Masonry>
          </ResponsiveMasonry>
        ) : (
          <>
            {!isLoading && (
              <div className='flex flex-col items-center justify-center text-center w-full h-full'>
                <p className='flex flex-col items-center text-2xl text-blue-2 my-40'>
                  <PhotoIcon className='w-20 h-20 my-3' />
                  No results found! Try search something different
                </p>
              </div>
            )}
          </>
        )}
      </div>
      {isOpenDialog && (
        <ImageDialog
          isOpen={isOpenDialog}
          setIsOpen={setIsOpenDialog}
          data={currentImage}
        />
      )}
      <div className='w-full flex flex-col gap-4 items-start px-40 tablet:px-10 mobile:px-4'>
        <div className='max-w-1/2 mobile:max-w-full border-l border-blue-1 rounded-tr-xl rounded-br-xl bg-white bg-opacity-20 p-5'>
          <h2 className='text-2xl mobile:text-md text-blue-1 font-[500] mb-4'>
            Powerful image searching tool for AI generated Images
          </h2>
          <p className='text-md mobile:text-sm text-gray-300'>
            Picsy is an image searching tool for AI generated generated images,
            that provides an inteface to search and download the images it for
            general purposes including research, education, and personal
            experience. Picsy holds data of more than 7 millon images with
            different kind of genres.
          </p>
          <h2 className='text-2xl mobile:text-md text-blue-1 font-[500] my-4'>
            What is Generative AI?
          </h2>
          <p className='text-md mobile:text-sm text-gray-300'>
            Generative Artificial Intelligence (AI) is a term used for the
            algorithms that are utilized to develop new information resembling
            human-generated sources, such as sound, coding, photographs, text,
            models and videos. This technology is trained with preexisting
            content and data, allowing for various applications like natural
            language interpretation, computer vision, metaverse, and voice
            synthesis.
          </p>
          <h2 className='text-2xl mobile:text-md text-blue-1 font-[500] my-4'>
            Example of Generative AI - Midjourney
          </h2>
          <p className='text-md mobile:text-sm text-gray-300'>
            Midjourney is an independent research lab that has invented an
            artificial intelligence program with the same name to produce images
            from verbal portrayals, similar to{' '}
            <a href='https://openai.com/' target={'_blank'}>
              OpenAI
            </a>
            's{' '}
            <a href='https://openai.com/product/dall-e-2' target={'_blank'}>
              DALL-E-2
            </a>{' '}
            and <a>Stable Diffusion</a>. People make artworks with AI model
            using{' '}
            <a href='https://midjourney.com/auth/signin/' target={'_blank'}>
              Discord
            </a>
            's Midjourney bot commands. It is inferred that the underlying
            technology is based on Stable Diffusion. The tool is at present in
            open beta, which began on July 12, 2022. The group at Midjourney is
            headed by David Holz, who was a co-founder of Leap Motion. . It is
            speculated that the underlying technology is based on Stable
            Diffusion.
          </p>
        </div>
      </div>
      {showButton && (
        <button
          onClick={scrollToTop}
          className='text-white z-[5] fixed mobile:bottom-3 mobile:right-3 bottom-10 right-10 bg-gradient-to-br from-blue-2 to-teal-600 rounded-full p-2 mobile:p-1 shadow-lg shadow-black'
        >
          <ArrowUpIcon className='w-8 h-8 ' />
        </button>
      )}
    </>
  )
}

export default Home

const ImageIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={2.5}
      stroke='currentColor'
      className='w-6 h-6'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
      />
    </svg>
  )
}

const ArrowRightIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={2.5}
      stroke='currentColor'
      className='w-6 h-6'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3'
      />
    </svg>
  )
}
