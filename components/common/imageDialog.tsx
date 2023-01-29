import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { Fragment } from 'react';
import { toast } from 'react-hot-toast';

const ImageDialog = ({ isOpen, setIsOpen, data }: any) => {
  const prompt = data.content.replaceAll("*", "").replaceAll(/ *\([^)]*\) */g, "").replaceAll(/ - .*@.*/g, "").replaceAll(/<*>/g, "")
  return (
    <>
      <Transition.Root
        show={isOpen}
        as={Fragment}
      >
        <Dialog
          as="div"
          static
          className="fixed z-90 inset-0 overflow-y-auto mobile:mx-2 "
          onClose={() => { setIsOpen(false) }}
        >
          <div className="flex items-center justify-center min-h-screen text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 backdrop-blur-md transition-opacity" />
            </Transition.Child>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="relative rounded-3xl border-4 border-orange-500 mobile:border-2 inline-block align-bottom text-left overflow-hidden transform transition-all sm:align-middle sm:max-w-xl sm:w-full">
                <XMarkIcon className='w-10 h-10 text-orange-500 absolute right-0 top-0 cursor-pointer' onClick={() => { setIsOpen(false) }} />
                <Image
                  src={data.proxy_url}
                  height={data.height}
                  width={data.width}
                  alt={data.content}
                />
                <div className='flex flex-col text-orange-100 gap-2 p-3 bg-[#311808] '>
                  <p className='cursor-pointer' onClick={() => { navigator.clipboard.writeText(prompt); toast.success("Prompt copied") }}>
                    {prompt}
                  </p>
                  {/* <input className='p-3 rounded-xl' value={prompt}/> */}
                  <p>Size: {data?.width} X {data?.height}</p>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export default ImageDialog;