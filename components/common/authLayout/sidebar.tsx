import {
  ArrowLeftOnRectangleIcon,
  FolderOpenIcon,
  HeartIcon,
  HomeIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { clearAllCookie } from '../../../utils/auth'

export interface SidebarOption {
  name: string
  link: string
  key: string
  colorClass: string
  icon: ReactNode
}

export default function Sidebar () {
  const router = useRouter()
  const AllOptions: SidebarOption[] = [
    {
      name: 'Explore',
      link: '/',
      key: '',
      colorClass: 'text-[18px]',
      icon: <HomeIcon className='w-5 h-5 mobile:w-5 mobile:h-5' />
    },
    {
      name: 'Generate Image',
      link: '/generateimage',
      key: 'generateimage',
      colorClass: 'text-[18px]',
      icon: <PhotoIcon className='w-5 h-5 mobile:w-5 mobile:h-5' />
    },
    {
      name: 'History',
      link: '/history',
      key: 'history',
      colorClass: 'text-[18px]',
      icon: <FolderOpenIcon className='w-5 h-5 mobile:w-5 mobile:h-5' />
    }
    // {
    //   name: 'Liked Images',
    //   link: '/liked',
    //   key: 'liked',
    //   colorClass: 'text-[18px]',
    //   icon: <HeartIcon className='w-5 h-5 mobile:w-5 mobile:h-5 mr-1' />
    // }
  ]

  return (
    <>
      <div
        className={`relative overflow-hidden flex flex-col gap-5 w-[15%] min-w-fit max-h-screen bg-white bg-opacity-5 text-xl mobile:text-md shadow-3xl shadow-black z-[5]`}
      >
        <img
          src={'/full-logo.svg'}
          alt='Picsy'
          className='object-fit my-8 mx-3 h-[2.5rem] mobile:h-[2rem] cursor-pointer'
          onClick={() => router.push('/')}
        />
        <div className='flex flex-col justify-between h-full'>
          <div className='flex flex-col justify-start gap-5 items-start'>
            {AllOptions &&
              AllOptions.map((data: SidebarOption, index: number) => {
                return (
                  <span
                    className={`flex justify-start items-center cursor-pointer w-full pr-3 text-sm ${
                      data.colorClass
                    } ${
                      data.link === router.pathname
                        ? ' bg-gradient-to-r from-blue-2 to-teal-500 bg-clip-text text-transparent font-bold'
                        : 'text-white'
                    }`}
                    onClick={() => {
                      router.push(data.link)
                    }}
                    key={index}
                  >
                    <div
                      className={`w-[3px] mr-3 rounded-r-full h-10 ${
                        data.link === router.pathname
                          ? ' bg-gradient-to-b from-blue-2 to-teal-500'
                          : 'bg-none'
                      }`}
                    />
                    <div
                      className={`rounded-lg w-full flex items-center py-2 px-3 ${
                        data.link === router.pathname
                          ? 'bg-blue-1 bg-opacity-5'
                          : ''
                      }`}
                    >
                      <div
                        className={`mr-2 ${
                          data.link === router.pathname
                            ? 'text-blue-2'
                            : 'text-white'
                        }`}
                      >
                        {data.icon}
                      </div>
                      {data.name}
                    </div>
                  </span>
                )
              })}
          </div>
          <div className='w-full flex justify-center p-5'>
            <button
              className='rounded-full bg-red-50 text-red-300 outline-none text-sm py-2 px-8 bg-opacity-20 flex items-center gap-2 w-fit justify-center'
              onClick={() => {
                clearAllCookie()
                router.push('/')
              }}
            >
              <ArrowLeftOnRectangleIcon className='w-6 h-6' /> Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
