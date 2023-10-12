import {
  ArrowDownIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  PhotoIcon
} from '@heroicons/react/20/solid'
import { saveAs } from 'file-saver'
import Image from 'next/image'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { CommonLoader } from '../../common/loader/CommonLoader'
import { promptModifier } from '../../../utils/promptmodifier'

const ImageBox = ({ setIsOpenDialog, setCurrentImage, data, current }: any) => {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const downloadImage = (url: string) => {
    try {
      setDownloading(true)
      saveAs(url, 'picsy_' + uuid() + '.png')
    } catch (e) {
      console.log(e)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className='relative group text-white'>
      <Image
        onClick={() => {
          setIsOpenDialog(true)
          setCurrentImage(data)
        }}
        className='w-full object-cover rounded-xl'
        src={
          current?.url +
          `?width=${current?.width / 4}&height=${current?.height / 4}`
        }
        alt={promptModifier(data.content).slice(0, 50)}
        unoptimized
        width={current?.width / 3}
        height={current?.height / 3}
      />
      {data.images.length > 1 && (
        <div className='flex invisible mobile:visible flex-row w-full justify-end bg-gradient-to-t from-transparent to-black/80 absolute top-0 right-0 rounded-t-xl group-hover:visible gap-1 mobile:hidden py-2'>
          <p className='flex items-center gap-1 text-sm px-2'>
            <PhotoIcon className='w-4 h-4' />x {data.images.length}
          </p>
        </div>
      )}
      <div className='w-full flex invisible justify-between mobile:visible flex-row absolute bottom-0 right-0 p-2 bg-gradient-to-b from-transparent to-black/80 group-hover:visible gap-1 rounded-b-xl items-end'>
        <p className='line-clamp-2 leading-4'>{promptModifier(data.content)}</p>
        <div className='flex gap-1'>
          <button
            className='z-[2] w-8 h-8 flex justify-center items-center rounded-full mobile:w-fit p-1 bg-white bg-opacity-30 hover:bg-opacity-50 ring-0 outline-0'
            onClick={e => {
              e.preventDefault()
              navigator.clipboard.writeText(data.content)
              setCopied(true)
              setTimeout(() => {
                setCopied(false)
              }, 500)
            }}
          >
            {copied ? (
              <CheckCircleIcon className='text-blue-1 w-4 h-4' />
            ) : (
              <DocumentDuplicateIcon className='w-4 h-4' />
            )}
          </button>
          <button
            className='relative z-[2] w-8 h-8 flex justify-center items-center rounded-full mobile:w-fit p-1 bg-white bg-opacity-30 hover:bg-opacity-50 ring-0 outline-0'
            onClick={() => downloadImage(current.url)}
          >
            {downloading ? (
              <CommonLoader
                parentClassName='float-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                childClassName='w-4 h-4 border-[3px]'
              />
            ) : (
              <ArrowDownIcon className='cursor-pointer w-4 h-4' />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageBox
