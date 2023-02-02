import { Dialog, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  FolderArrowDownIcon,
  Square2StackIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import { Fragment, useState } from "react";
import { saveAs } from "file-saver";

const ImageDialog = ({ isOpen, setIsOpen, data }: any) => {
  const [copied, setCopied] = useState(false);

  const prompt = data.content
    .replaceAll("*", "")
    .replaceAll(/ *\([^)]*\) */g, "")
    .replaceAll(/ - .*@.*/g, "")
    .replaceAll(/<.*>/g, "");

  const downloadImage = () => {
    saveAs(data?.proxy_url, "orange.jpg");
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
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
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative rounded-3xl border-4 border-orange-500 mobile:border-2 w-full max-w-xl max-h-[calc(100vh-50px)] transform overflow-auto scrollbar-hide rounded-2xl text-left align-middle shadow-xl transition-all">
                  <XMarkIcon
                    className="w-10 h-10 text-orange-500 absolute right-0 cursor-pointer z-10"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  />
                  <div className="inline-block align-bottom text-left overflow-hidden transform transition-all sm:align-middle sm:max-w-xl sm:w-full">
                    <div className="flex flex-col">
                      <Image
                        src={data.proxy_url}
                        height={data.height}
                        width={data.width}
                        alt={data.content}
                        className={
                          "w-full border-b-[3px] mobile:border-b-[1px] border-orange-500"
                        }
                      />
                      <div className="p-6 mobile:p-4 flex flex-col text-orange-100 gap-2 dark:bg-[#311808] bg-orange-100">
                        <p className="dark:text-orange-200 text-orange-900 text-lg mobile:text-md">
                          {prompt}
                        </p>
                        <p className=" dark:text-orange-500 text-orange-500 text-lg mobile:text-md">
                          Dimensions: <strong>{data?.width} X {data?.height}</strong>
                        </p>
                        <div className="flex gap-2 items-center">
                          {copied ? (
                            <div className="cursor-pointer flex items-center gap-1 px-4 py-2 border border-orange-500 bg-orange-500 text-white rounded-xl mobile:px-2">
                              <>
                                <CheckCircleIcon className="w-6 h-6" />
                                Prompt copied
                              </>
                            </div>
                          ) : (
                            <div
                              className="cursor-pointer flex items-center gap-1 px-4 py-2 border border-orange-500 bg-orange-500 dark:bg-[#311808] dark:text-orange-500 text-orange-100 rounded-xl mobile:px-2"
                              onClick={() => {
                                navigator.clipboard.writeText(prompt);
                                setCopied(true);
                                setTimeout(() => {
                                  setCopied(false);
                                }, 1500);
                              }}
                            >
                              <>
                                <Square2StackIcon className="w-6 h-6 " /> Copy
                                Prompt
                              </>
                            </div>
                          )}
                          <div
                            className="cursor-pointer flex items-center gap-1 px-4 py-2 border border-orange-500 bg-orange-500 dark:bg-[#311808] dark:text-orange-500 text-orange-100 rounded-xl"
                            onClick={downloadImage}
                          >
                            <FolderArrowDownIcon className="w-6 h-6 " />{" "}
                            Download
                          </div>
                        </div>
                        {/* <input className='p-3 rounded-xl' value={prompt}/> */}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          static
          className='fixed z-90 inset-0 overflow-y-auto mobile:mx-2 '
          onClose={() => {
            setIsOpen(false)
          }}
        >
          <div className='flex font-satoshi items-center justify-center min-h-screen text-center sm:block sm:p-0 '>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0 backdrop-blur-md transition-opacity' />
            </Transition.Child>
            <span
              className='hidden sm:inline-block sm:align-middle sm:h-screen'
              aria-hidden='true'
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <div className='relative rounded-3xl border-4 border-orange-500 mobile:border-2 inline-block align-bottom text-left overflow-hidden transform transition-all sm:align-middle sm:max-w-xl sm:w-full'>
                <XMarkIcon
                  className='w-10 h-10 text-orange-500 absolute right-0 top-0 cursor-pointer z-10'
                  onClick={() => {
                    setIsOpen(false)
                  }}
                />
                <div className='flex flex-col'>
                  <Image
                    src={data.proxy_url}
                    height={data.height}
                    width={data.width}
                    alt={data.content}
                    className={'w-full border-b-[3px] border-orange-500'}
                  />
                  <div className='p-6 mobile:p-4 flex flex-col text-orange-100 gap-2 bg-[#311808] '>
                    <p className='text-orange-200 text-xl mobile:text-lg'>
                      {prompt}
                    </p>
                    <p className=' text-orange-500 text-lg font-bold'>
                      Dimensions: {data?.width} X {data?.height}
                    </p>
                    <div className='flex gap-2 items-center'>
                      <button
                        className='flex items-center gap-1 px-4 py-2 border border-orange-500 bg-[#311808] text-orange-500 rounded-xl'
                        onClick={() => {
                          navigator.clipboard.writeText(prompt)
                          toast.success('Prompt copied')
                        }}
                      >
                        <Square2StackIcon className='w-6 h-6 ' /> Copy Prompt
                      </button>
                      <button
                        className='flex items-center gap-1 px-4 py-2 border border-orange-500 bg-[#311808] text-orange-500 rounded-xl'
                        onClick={downloadImage}
                      >
                        <FolderArrowDownIcon className='w-6 h-6 ' /> Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root> */}
      {/* <input className='p-3 rounded-xl' value={prompt}/> */}
    </>
  );
};

export default ImageDialog;
