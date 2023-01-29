import {
  FaceSmileIcon,
  FingerPrintIcon,
  FolderIcon,
  HeartIcon,
  HomeIcon
} from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

export interface HeaderOption {
  name: string
  link: string
  key: string
  colorClass: string
  icon: ReactNode
}

export default function Header () {
  const router = useRouter()
  const AllOptions: HeaderOption[] = [
    {
      name: 'About',
      link: '/',
      key: 'about',
      colorClass: 'text-medium',
      icon: <HomeIcon className='w-6 h-6 mobile:w-5 mobile:h-5 mr-1' />
    },
    {
      name: 'Blog',
      link: '/blog',
      key: 'blog',
      colorClass: 'text-medium',
      icon: <FolderIcon className='w-6 h-6 mobile:w-5 mobile:h-5 mr-1' />
    },
    {
      name: 'Careers',
      link: '/Careers',
      key: 'Careers',
      colorClass: 'text-medium',
      icon: <FaceSmileIcon className='w-6 h-6 mobile:w-5 mobile:h-5 mr-1' />
    }
  ]

  return (
    <>
      <div
        className={`relative flex py-4 w-full bg-blue-50 justify-between text-xl mobile:p-2 mobile:text-md`}
      >
        <div
          className='flex flex-col justify-center items-center cursor-pointer'
          onClick={() => router.push('/')}
        >
          <HeartIcon className='absolute left-5 h-14 w-14 mobile:h-10 mobile:w-10 text-blue-500' />
        </div>
        <div className='flex justify-center gap-5 items-center'>
          {AllOptions &&
            AllOptions.map((data: HeaderOption, index: number) => {
              return (
                <span
                  className={`flex justify-start items-center cursor-pointer ${data.colorClass}`}
                  onClick={() => {
                    router.push(data.link)
                  }}
                  key={index}
                >
                  {/* {data.icon} */}
                  {data.name}
                </span>
              )
            })}
          <FingerPrintIcon className='mr-5 h-10 w-10 mobile:h-8 mobile:w-8 rounded-full p-1 cursor-pointer bg-blue-500 text-blue-50' />
        </div>
      </div>
    </>
  )
}
