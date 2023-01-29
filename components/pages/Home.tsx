import { useState } from 'react'
import { useRouter } from 'next/router'
import { UserInfo } from '../../api/users'
import { GlobalState } from '../../store/reducers'
import { connect, useDispatch } from 'react-redux'
import axios from 'axios'
import Loader from '../common/loader'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import Image from 'next/image'
import { ChevronDoubleDownIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import ImageDialog from '../common/imageDialog'

interface HomePageProps {
  userInfo: UserInfo
}

const Home: React.FC<HomePageProps> = ({ userInfo }) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState<string>("")
  const [totalResult, setTotalResult] = useState<number>(0)
  const [offset, setOffset] = useState<number>(0)
  const [currentImage, setCurrentImage] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)
  const [images, setImages] = useState<any[]>([])

  const getData = async (start?: number) => {
    setIsLoading(true)
    let pageOffset = start ? `&${start}` : ""
    const data = await axios.get(`https://discord.com/api/v9/guilds/662267976984297473/messages/search?content=${searchText}${pageOffset}`, {
      "headers": {
        "accept": "*/*",
        "authorization": "MTA2ODkzMTMzMTg2NzgyNDE5OQ.GF0TrH.yYe8Hv_jGk-a2s7oQuJvQwqWVjbvFy5aDJKyjM",
        "x-super-properties": "eyJvcyI6Ik1hYyBPUyBYIiwiYnJvd3NlciI6IkNocm9tZSIsImRldmljZSI6IiIsInN5c3RlbV9sb2NhbGUiOiJlbi1HQiIsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzE1XzcpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMDkuMC4wLjAgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6IjEwOS4wLjAuMCIsIm9zX3ZlcnNpb24iOiIxMC4xNS43IiwicmVmZXJyZXIiOiJodHRwczovL3d3dy5nb29nbGUuY29tLyIsInJlZmVycmluZ19kb21haW4iOiJ3d3cuZ29vZ2xlLmNvbSIsInNlYXJjaF9lbmdpbmUiOiJnb29nbGUiLCJyZWZlcnJlcl9jdXJyZW50IjoiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8iLCJyZWZlcnJpbmdfZG9tYWluX2N1cnJlbnQiOiJ3d3cuZ29vZ2xlLmNvbSIsInNlYXJjaF9lbmdpbmVfY3VycmVudCI6Imdvb2dsZSIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjE3MDQ1NywiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0=",
      },
    });
    let fetchImages = data?.data?.messages ?? []
    let arr: any[] = []
    fetchImages.forEach((data: any) => {
      if (data.length > 0) {
        data.forEach((ele: any) => {
          if (ele.attachments.length > 0) {
            ele.attachments.forEach((item: any) => {
              arr.push({ ...item, content: ele?.content })
            })
          }
        })
      }
      setIsLoading(false)
    })

    setTotalResult(data?.data?.total_results)
    setImages((preval) => { return [...preval, ...arr] })
    setOffset((preval) => { return preval + data?.data?.messages?.length })
  }

  return (
    <>
      {isLoading && <Loader loading={isLoading} />}
      <div className='flex items-center mt-10 mobile:mt-6'>
        <img
          src={"/android-chrome-512x512.png"}
          alt="Orange"
          className='object-cover h-[120px]'
        />
        <div className='flex flex-col ml-5'>
          <h1
            className='text-[2.5rem] cursor-pointer font-[300] text-light dark:text-orange-100 text-medium mobile:text-[2rem]'
            onClick={() => {
              router.push('/')
            }}
          >
            AI Art Search
          </h1>
          <p className='text-lg mobile:mt-1 mobile:text-sm text-orange-200'>Search images generated in {" "}
            <a className='text-orange-500 ring-0 outline-0' href='https://midjourney.com/home/' target={"_blank"}>
              midjourney
            </a> {" "}
          </p>
        </div>
      </div>
      <div className='w-2/5 sm:w-2/5 mobile:w-full tablet:w-3/5 max-w-[600px] flex justify-end items-center relative mt-16 mobile:mt-8'>
        <input className='w-full p-3 bg-[#311808] rounded-xl border-0 outline-0 focus:ring-1 focus:ring-orange-500 text-orange-200 placeholder-[#8B4000]'
          placeholder='Search images'
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          required={true}
          disabled={isLoading}
        // onKeyDown={()=>getData()}
        />
        {searchText &&
          <div className='flex gap-1 absolute mr-2 bg-[#311808] itams-center'>
            <button disabled={isLoading}>
              <svg xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5} stroke="currentColor"
                className="cursor-pointer text-orange-500 h-7 w-7"
                onClick={() => getData(undefined)} >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            <button disabled={isLoading}>
              <svg xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="cursor-pointer text-orange-500 h-7 w-7"
                onClick={() => setSearchText("")} >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        }
      </div>
      {
        totalResult && totalResult > 0 ?
          <p className='mt-4 text-orange-200'>
            {totalResult} Results found
          </p> : null
      }

      <div className='w-full my-10'>
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 0: 1, 400: 2, 750: 3, 900: 4, 1300: 5 }}
        >
          <Masonry gutter='10px'>
            {
              images && images.length > 0 && images.map((data: any, index: number) => {
                return (
                  <div key={index} className="relative cursor-ponter" onClick={() => {
                    setIsOpenDialog(true)
                    setCurrentImage(data)
                  }}>
                    <Image
                      className="w-full object-cover rounded-xl "
                      src={data?.proxy_url}
                      alt={"prompt"}
                      placeholder="blur"
                      blurDataURL={`/apple-touch-icon.png`}
                      unoptimized
                      width={100}
                      height={200}
                    />
                    {/* <img src={data?.proxy_url} className="object-cover rounded-xl drop-shadow shadow-orange-100" /> */}
                  </div>)
              })
            }
          </Masonry>
        </ResponsiveMasonry>
      </div>
      {images.length > 0 &&
        <button className='text-orange-100 cursor-pointer flex items-center p-3 bg-[#311808] rounded-full'
          onClick={() => { getData(images.length) }}
          disabled={isLoading}
        >
          {isLoading? "Loading..." : "Load more" }<ChevronDownIcon className='w-6 h-6' />
        </button>
      }
      {isOpenDialog && <ImageDialog isOpen={isOpenDialog} setIsOpen={setIsOpenDialog} data={currentImage} />}
    </>
  )
}

const mapStateToPros = (state: GlobalState) => {
  return {
    userInfo: state.main.userInfo
  }
}

export default connect(mapStateToPros)(Home)
