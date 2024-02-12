import {
  ArrowDownIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { saveAs } from 'file-saver'
import Image from 'next/image'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { promptModifier } from '../../../utils/promptmodifier'
import { CommonLoader } from '../../common/loader/CommonLoader'

const HistoryImageBox = ({ setIsOpenDialog, data, current }: any) => {
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
        }}
        className='w-full object-cover rounded-xl'
        src={current}
        alt={promptModifier(data?.prompt ?? '')}
        unoptimized
        width={1024}
        height={1024}
      />
      {data?.output?.images.length > 1 && (
        <div className='flex w-full bg-gradient-to-t from-transparent to-black/70 invisible mobile:visible flex-row absolute top-0 right-0 rounded-t-xl group-hover:visible gap-1 mobile:hidden justify-end py-2'>
          <p className='flex items-center gap-1 text-sm px-2'>
            <PhotoIcon className='w-4 h-4' />x {data?.output?.images.length}
          </p>
        </div>
      )}
      <div className='w-full flex invisible justify-between items-end mobile:visible flex-row absolute rounded-b-xl bottom-0 p-2 group-hover:visible gap-1 bg-gradient-to-b from-transparent to-black/70 leading-4 text-sm'>
        <p className='line-clamp-2'>{promptModifier(data?.prompt ?? '')}</p>
        <div className='flex gap-1'>
          <button
            className='z-[2] w-6 h-6 justify-center items-center rounded-full mobile:w-fit p-1 bg-white bg-opacity-30 hover:bg-opacity-50 ring-0 outline-none'
            onClick={e => {
              e.preventDefault()
              navigator.clipboard.writeText(data.prompt)
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
            className='relative z-[2] w-6 h-6 flex justify-center items-center rounded-full mobile:w-fit p-1 bg-white bg-opacity-30 hover:bg-opacity-50 ring-0 outline-none'
            onClick={() => downloadImage(current)}
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

export default HistoryImageBox
