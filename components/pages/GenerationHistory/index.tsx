import {
  ArrowUpIcon,
  PhotoIcon,
  QueueListIcon
} from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { getImagesHistory } from '../../../apiHelper/images'
import { getToken } from '../../../utils/auth'
import HistoryImageBox from './HistoryImageBox'
import ImageDialog from '../../common/imageDialog'
import { CommonLoader } from '../../common/loader/CommonLoader'

export default function ImageGenerationHistory () {
  const router = useRouter()

  const [images, setImages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [offset, setOffset] = useState<number>(0)
  const [showButton, setShowButton] = useState(false)
  const [isLast, setIsLast] = useState(false)
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)

  useEffect(() => {
    window.addEventListener('scroll22', () => {
      if (window.pageYOffset > 300) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    })
  }, [])

  useEffect(() => {
    if (!getToken()) {
      router.push('/')
    }
  }, [])

  useEffect(() => {
    ImageGenerationHistory()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // let fetching = false

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (
  //       document.documentElement.offsetHeight -
  //         (window.innerHeight + document.documentElement.scrollTop) >=
  //         200 &&
  //       document.documentElement.offsetHeight -
  //         (window.innerHeight + document.documentElement.scrollTop) <=
  //         2500
  //     ) {
  //       if (!fetching) {
  //         ImageGenerationHistory()
  //       }
  //     }
  //   }
  //   window.addEventListener('scroll22', handleScroll)
  //   return () => window.removeEventListener('scroll22', handleScroll)
  // }, [images])

  const ImageGenerationHistory = async () => {
    if (!isLast) {
      try {
        // fetching = true
        setIsLoading(true)
        const res = await getImagesHistory(offset)
        setImages((preval: any) => {
          return [...preval, ...res.data]
        })
        setOffset(() => {
          return offset + res.data.length
        })
        setIsLast(() => {
          return res?.is_last
        })
      } catch (err: any) {
        console.log(err)
      } finally {
        // fetching = false
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <div className='w-full pb-5 flex gap-3 font-satoshi mobile:p-2 z-10'>
        <h1 className='text-[1.5rem] flex gap-2 items-center mobile:text-[1.5rem] tablet:text-[1.5rem]'>
          Image Generation History <QueueListIcon className='w-6 h-6' />
        </h1>
      </div>

      {/* {isOpenDialog && (
        <ImageDialog
          isOpen={isOpenDialog}
          setIsOpen={setIsOpenDialog}
          data={currentImage}
        />
      )} */}

      <div className='w-full mb-10 mt-3'>
        {images?.length > 0 ? (
          <ResponsiveMasonry
            columnsCountBreakPoints={{
              0: 2,
              400: 2,
              750: 3,
              900: 4,
              1300: 4,
              1500: 4,
              1800: 7
            }}
          >
            <Masonry gutter='5px'>
              {images?.map((data: any, index: number) => {
                return (
                  <>
                    {data?.output?.images.length > 0 && (
                      <HistoryImageBox
                        key={index}
                        setIsOpenDialog={setIsOpenDialog}
                        data={data}
                        current={data?.output?.images[0]}
                      />
                    )}
                  </>
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
      {!isLast && (
        <button
          className={`h-14 rounded-2xl px-8 py-2 border-[2px] font-bold text-md outline-none w-34 disabled:cursor-not-allowed ${
            !isLoading
              ? 'bg-gradient-to-tr from-blue-2 to-teal-500 border-blue-1'
              : 'bg-gray-800 border-gray-700'
          }`}
          onClick={ImageGenerationHistory}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <CommonLoader childClassName='w-7 h-7 border-[3px]' />
            </>
          ) : (
            'Load More'
          )}
        </button>
      )}
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
