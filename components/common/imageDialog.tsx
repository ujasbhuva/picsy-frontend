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
import Image from "next/image";

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
    saveAs(currentImage?.proxy_url ?? "", "orange.jpg"); // Put your image url here.
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
              <div className="flex min-h-full items-center justify-center p-10 px-16 mobile:p-2 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel
                    className={`relative flex flex-col itme-center justify-center rounded-2xl bg-gradient-to-r from-blue-2 to-teal-700 mobile:w-full mobile:max-h-full max-h-[calc(100vh-10px)] transform overflow-auto scrollbar-hide text-left align-middle shadow-xl transition-all w-[calc(100%-${
                      size.width-currentImage?.width
                    }px)]`}
                  >
                    <div className="relative p-1 mobile:p-0.5 rounded-xl">
                      <XMarkIcon
                        className="w-10 h-10 text-teal-700 absolute right-1 top-1 cursor-pointer z-10"
                        onClick={() => {
                          setIsOpen(false);
                        }}
                      />
                      <div className="rounded-xl mobile:rounded-[14px] inline-block align-bottom text-left transform transition-all min-h-fit overflow-auto shadow-inner shadow-gray-600">
                        <div className="flex  mobile:flex-col lg:flex-col h-full w-full items-center ">
                          <div className={`relative mobile:w-full flex flex-col items-center p-0 ${currentImage.width > currentImage.height ? " w-[75%] " : " w-full "}`}>
                            <Image
                            className="absolute w-full object-cover h-full scale-125 mobile:scale-0 transition blur-md"
                            src={currentImage.proxy_url}
                            alt={data.content}
                            width={currentImage.width}
                            height={currentImage.height}
                          />
                            <Image
                              className={`z-10 w-auto object-contain mobile:h-full transition
                            ${
                              currentImage.width > currentImage.height
                                ? "min-h-full"
                                : "h-[calc(100vh-100px)]"
                            }
                            `}
                              src={currentImage.proxy_url}
                              alt={data.content}
                              width={currentImage.width}
                              height={currentImage.height}
                              priority={true}
                            />
                          </div>
                          <div className="w-[35%] z-10 flex self-stretch justify-between flex-col items-start mobile:w-full pt-8 p-6 ml-[3px] mobile:ml-0 mobile:border-t-[1px] mobile:border-l-0 border-blue-2 mobile:p-4  gap-2 bg-black-2">
                            <p className="my-3 mobile:my-1 text-blue-1 text-md mobile:text-md w-full mobile:line-clamp-[9] line-clamp-[15]">
                              {prompt}
                            </p>
                            <div className="flex flex-col gap-2 items-center w-full">
                              {data.images && data.images.length > 1 && (
                                <div className="z-90 flex items-center justify-between w-full my-3">
                                  <button
                                    disabled={currentIndex === 0}
                                    className={
                                      "w-2/12 outline-0 ring-0 text-blue-1 disabled:text-blue-2 disabled:cursor-not-allowed cursor-pointer"
                                    }
                                    onClick={() =>
                                      changeImage(currentIndex - 1)
                                    }
                                  >
                                    <ChevronLeftIcon className="w-8 h-8" />
                                  </button>
                                  <div className="flex flex-row w-8/12 items-center justify-start content-center overflow-x-scroll scrollbar-hide">
                                    {data.images.map(
                                      (ele: any, index: number) => {
                                        return (
                                          <img
                                            key={index}
                                            src={
                                              ele.proxy_url +
                                              `?width=${
                                                data.images.sort(
                                                  (a: iImage, b: iImage) =>
                                                    Number(b.upscaled) -
                                                    Number(a.upscaled)
                                                )[0]?.width / 4
                                              }&height=${
                                                data.images.sort(
                                                  (a: iImage, b: iImage) =>
                                                    Number(b.upscaled) -
                                                    Number(a.upscaled)
                                                )[0]?.height / 4
                                              }`
                                            }
                                            className={`w-20 m-2 object-cover mobile:w-16 cursor-pointer rounded-lg ${
                                              currentImage?.url === ele.url
                                                ? "ring-1 ring-blue-1"
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
                                      "w-2/12 outline-0 ring-0 text-blue-1 disabled:text-blue-2 disabled:cursor-not-allowed cursor-pointer"
                                    }
                                    onClick={() =>
                                      changeImage(currentIndex + 1)
                                    }
                                  >
                                    <ChevronRightIcon className="w-8 h-8" />
                                  </button>
                                </div>
                              )}
                              <p className=" text-blue-1 text-lg mobile:text-sm">
                                Dimensions:{" "}
                                <strong>
                                  {currentImage?.width} X {currentImage?.height}
                                </strong>
                              </p>
                              <div className="grid grid-cols-2 gap-2 items-center w-full mt-3">
                                {copied ? (
                                  <div className="cursor-pointer w-full flex items-center justify-center gap-1 px-2 py-2 border border-black-2 shadow-inner shadow-black transition text-black-2 bg-blue-1 rounded-xl mobile:px-2">
                                    <>
                                      <CheckCircleIcon className="w-6 h-6" />
                                      Prompt copied
                                    </>
                                  </div>
                                ) : (
                                  <div
                                    className="cursor-pointer w-full flex items-center justify-center gap-1 px-2 py-2 border border-blue-2 shadow-inner shadow-black bg-black-2 text-blue-2 rounded-xl mobile:px-2"
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
                                  className="cursor-pointer w-full flex items-center justify-center gap-1 px-2 py-2 border border-blue-2 shadow-inner shadow-black bg-black-2 text-blue-2 rounded-xl"
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
