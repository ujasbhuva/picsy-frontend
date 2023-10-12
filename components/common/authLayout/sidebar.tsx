import {
  FolderOpenIcon,
  HeartIcon,
  HomeIcon,
  PhotoIcon
} from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

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
      icon: <HomeIcon className='w-5 h-5 mobile:w-5 mobile:h-5 mr-1' />
    },
    {
      name: 'Generate Image',
      link: '/generateimage',
      key: 'generateimage',
      colorClass: 'text-[18px]',
      icon: <PhotoIcon className='w-5 h-5 mobile:w-5 mobile:h-5 mr-1' />
    },
    {
      name: 'History',
      link: '/history',
      key: 'history',
      colorClass: 'text-[18px]',
      icon: <FolderOpenIcon className='w-5 h-5 mobile:w-5 mobile:h-5 mr-1' />
    },
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
        className={`relative overflow-hidden flex flex-col gap-5 w-[15%] min-w-fit max-h-screen bg-white bg-opacity-5 text-xl mobile:text-md shadow-3xl shadow-black`}
      >
        <img
          src={'/full-logo.svg'}
          alt='Picsy'
          className='object-fit my-8 mx-3 h-[2.5rem] mobile:h-[2rem] cursor-pointer'
          onClick={() => router.push('/')}
        />
        <div className='flex flex-col justify-start gap-5 items-start'>
          {AllOptions &&
            AllOptions.map((data: SidebarOption, index: number) => {
              return (
                <span
                  className={`flex justify-start items-center cursor-pointer w-full pr-3 ${
                    data.colorClass
                  } ${
                    data.link === router.pathname
                      ? ' bg-gradient-to-r from-blue-2 to-teal-500 bg-clip-text text-transparent'
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
                  <p
                    className={`mr-2 ${
                      data.link === router.pathname
                        ? 'text-blue-2'
                        : 'text-white'
                    }`}
                  >
                    {data.icon}
                  </p>
                  {data.name}
                </span>
              )
            })}
        </div>
      </div>
    </>
  )
}
