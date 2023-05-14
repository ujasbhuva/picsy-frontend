import {
  ArrowUpIcon,
  PhotoIcon
} from '@heroicons/react/20/solid'
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
import { sessionLogin, SignInWith } from '../../../apiHelper/user'
import ImageBox from './ImageBox'
import GoogleButton from '../../../utils/googleButton'
import { getToken } from '../../../utils/auth'

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
  const [isLoadingWithGoogle, setIsLoadingWithGoogle] = useState<boolean>(false)

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
    const res = await axios.get('https://geolocation-db.com/json/')
    setCountry(res.data.country_name)
    setIPv4(res.data.IPv4)
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

  const onGoogle = async (idToken: string) => {
    try {
      setIsLoadingWithGoogle(true)
      const signInWith = SignInWith.SIGN_WITH_GOOGLE
      const { email: _email } = await sessionLogin({
        idToken,
        signInWith
      })
    } catch (error: any) {
      toast.error('Failed to login')
    } finally {
      setIsLoadingWithGoogle(false)
    }
  }

  return (
    <>
      {/* {!getToken() && (
        <div className='w-full flex justify-end bg-none'>
          <GoogleButton
            handleSignIn={onGoogle}
            isLoading={isLoadingWithGoogle}
            disabled={isLoadingWithGoogle}
            buttonWidth={200}
          />
        </div>
      )} */}
      {isLoading && <Loader loading={isLoading} />}
      <div className='flex flex-col items-start mt-10 mobile:mt-6'>
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
          {/* <div className="flex flex-col ml-5 mobile:ml-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-2 to-teal-500">
            <h1
              className="text-[3rem] mobile:text-[2rem] font-[500]"
              onClick={() => {
                router.push("/");
              }}
            >
            </h1>
          </div> */}
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
      {/* {totalResult && totalResult > 0 ? (
        <p className="mt-4 text-blue-2">{totalResult} Results found,</p>
      ) : null} */}

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
      {/* {images.length > 0 && (
        <button
          className='text-white cursor-pointer flex items-center py-2 px-5 bg-blue-2 bg-opacity-40 rounded-xl mb-10'
          onClick={() => {
            getData(true)
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load more'}
          {!isLoading ? (
            <ChevronDownIcon className='w-6 h-6' />
          ) : (
            <CommonLoader
              parentClassName='ml-2 flex w-full items-end'
              childClassName=' h-6 w-6 border-2'
            />
          )}
        </button>
      )} */}
      {isOpenDialog && (
        <ImageDialog
          isOpen={isOpenDialog}
          setIsOpen={setIsOpenDialog}
          data={currentImage}
        />
      )}
      <div className='w-full flex flex-col gap-4 items-start px-40 tablet:px-10 mobile:px-4'>
        {/* <div className='w-1/2 mobile:w-full border-l border-blue-1 rounded-xl bg-white bg-opacity-20 p-5'>
          <Link
            href={'/blog/generative-ai-for-images-a-revolutionary-innovation'}
          >
            <Image
              src={
                'https://api.picsy.art/image/990816855088328734/1075328060997517322/birdlg_neural_network_chatbot_603f9e9b-c34f-4538-b59d-1fc9d559dd10.png'
              }
              height={200}
              width={300}
              alt='Image by picsy'
              className='object-cover w-full h-80 rounded-xl tablet:h-60 mobile:w-full'
            />
            <div className='pt-3'>
              <h2 className='text-2xl mobile:text-md text-blue-1 font-[500] mb-4'>
                Generative AI for Images - A Revolutionary Innovation
              </h2>
              <p className='text-gray-300 text-md mobile:text-sm w-auto mobile:w-full'>
                Generative AI for images, also known as GANs, is a rapidly
                evolving field that has made a significant impact on the
                creative industry.
              </p>
            </div>
          </Link>
        </div> */}
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
