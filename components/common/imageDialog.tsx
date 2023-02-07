import { Dialog, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FolderArrowDownIcon,
  Square2StackIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { Fragment, useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { iImage } from "../../apiHelper/images";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState<any>({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

const ImageDialog = ({ isOpen, setIsOpen, data }: any) => {
  const [copied, setCopied] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [totalImages, setTotalImages] = useState(0);
  const [currentImage, setCurrentImage] = useState<iImage>();
  const size = useWindowSize();

  useEffect(() => {
    if (data && data.images.length > 0) {
      setCurrentIndex(0);
      setCurrentImage(data.images[0]);
      setTotalImages(data.images.length);
    }
  }, [data]);

  const prompt = data.content
    .replaceAll("*", "")
    .replaceAll(/ *\([^)]*\) */g, "")
    .replaceAll(/ - .*@.*/g, "")
    .replaceAll(/<.*>/g, "");

  const downloadImage = () => {
    saveAs(currentImage?.url ?? "", "orange.jpg"); // Put your image url here.
  };

  const changeImage = (setIndex: number) => {
    setCurrentIndex(setIndex);
    setCurrentImage(data.images[setIndex]);
  };

  return (
    <>
      {currentImage && (
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
            <div className="fixed inset-0 overflow-y-auto font-satoshi">
              <div className="flex min-h-full items-center justify-center p-4 mobile:p-2 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="relative flex flex-col itme-center justify-center rounded-3xl border-4 border-orange-900 mobile:border-2 max-w-auto mobile:w-full mobile:max-w-full max-h-[calc(100vh-150px)] transform overflow-auto scrollbar-hide text-left align-middle shadow-xl transition-all">
                    <XMarkIcon
                      className="w-10 h-10 text-orange-700 absolute right-0 top-0 cursor-pointer z-10"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    />
                    <div className="inline-block align-bottom text-left transform transition-all min-h-fit overflow-auto">
                      <div className="flex mobile:flex-col lg:flex-col h-full w-full items-center bg-[#311808]">
                        <div className="w-3/5 mobile:w-full flex flex-col items-center py-auto">
                            <div className="w-full h-full absolute left-0 top-0 bg-c-bg/50 " />
                            <img
                              className="w-full h-full  transition lg:h-full lg:contain lg:absolute lg:left-0 lg:top-0"
                              src={currentImage.proxy_url}
                              alt={data.content}
                              width={currentImage.width}
                              height={currentImage.height}
                            />
                        </div>
                        <div className="z-10 flex self-stretch justify-between flex-col items-start w-2/5 mobile:w-full pt-8 p-6 border-l-[3px] mobile:border-t-[1px] mobile:border-l-0 border-orange-900 mobile:p-4 text-orange-100 gap-2 dark:bg-[#311808] bg-orange-100">
                          <div className="">
                            <p className="my-3 dark:text-orange-200 text-orange-900 text-md mobile:text-md w-full line-clamp-[17]">
                              {prompt}
                            </p>
                            <p className=" dark:text-orange-700 text-orange-700 text-lg mobile:text-md">
                              Dimensions:{" "}
                              <strong>
                                {currentImage?.width} X {currentImage?.height}
                              </strong>
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 items-center w-full">
                            {data.images && data.images.length > 1 && (
                              <div className="z-90 flex items-center justify-between w-full my-3">
                                <button
                                  disabled={currentIndex === 0}
                                  className={
                                    "outline-0 ring-0 text-orange-700 disabled:text-orange-900 disabled:cursor-not-allowed cursor-pointer"
                                  }
                                  onClick={() => changeImage(currentIndex - 1)}
                                >
                                  <ChevronLeftIcon className="w-8 h-8" />
                                </button>
                                <div className="flex w-full items-center justify-start overflow-x-scroll scrollbar-hide">
                                  {data.images.map(
                                    (ele: any, index: number) => {
                                      return (
                                        <img
                                          key={index}
                                          src={ele.proxy_url}
                                          className={`w-20 m-2 object-cover mobile:w-16 cursor-pointer rounded-lg ${
                                            currentImage?.url === ele.url
                                              ? "ring-1 ring-orange-500"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            changeImage(index);
                                          }}
                                          alt={index.toString()}
                                        />
                                      );
                                    }
                                  )}
                                </div>
                                <button
                                  disabled={currentIndex === totalImages - 1}
                                  className={
                                    "outline-0 ring-0 text-orange-700 disabled:text-orange-900 disabled:cursor-not-allowed cursor-pointer"
                                  }
                                  onClick={() => changeImage(currentIndex + 1)}
                                >
                                  <ChevronRightIcon className="w-8 h-8" />
                                </button>
                              </div>
                            )}
                            <div className="flex gap-2 items-center w-full">
                              {copied ? (
                                <div className="cursor-pointer w-full flex items-center justify-center gap-1 px-2 py-2 border border-orange-700 bg-orange-700 text-white rounded-xl mobile:px-2">
                                  <>
                                    <CheckCircleIcon className="w-6 h-6" />
                                    Prompt copied
                                  </>
                                </div>
                              ) : (
                                <div
                                  className="cursor-pointer w-full flex items-center justify-center gap-1 px-2 py-2 border border-orange-700 bg-orange-700 dark:bg-[#311808] dark:text-orange-700 text-orange-100 rounded-xl mobile:px-2"
                                  onClick={() => {
                                    navigator.clipboard.writeText(prompt);
                                    setCopied(true);
                                    setTimeout(() => {
                                      setCopied(false);
                                    }, 1500);
                                  }}
                                >
                                  <>
                                    <Square2StackIcon className="w-6 h-6 " />{" "}
                                    Copy Prompt
                                  </>
                                </div>
                              )}
                              <div
                                className="cursor-pointer w-full flex items-center justify-center gap-1 px-2 py-2 border border-orange-700 bg-orange-700 dark:bg-[#311808] dark:text-orange-700 text-orange-100 rounded-xl"
                                onClick={downloadImage}
                              >
                                <FolderArrowDownIcon className="w-6 h-6 " />{" "}
                                Download
                              </div>
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
      )}
    </>
  );
};

export default ImageDialog;
