import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowDownCircleIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
  FolderArrowDownIcon,
  InformationCircleIcon,
  LinkIcon,
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
  const [showInfo, setShowInfo] = useState<boolean>(false);
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

  const handleClose = () => {
    setShowInfo(false);
    setIsOpen(false);
  };

  const rederOptionImage = () => {
    return (
      <>
        {data.images.map((ele: any, index: number) => {
          return (
            <img
              key={index}
              src={
                ele.proxy_url +
                `?width=${
                  data.images.sort(
                    (a: iImage, b: iImage) =>
                      Number(b.upscaled) - Number(a.upscaled)
                  )[0]?.width / 4
                }&height=${
                  data.images.sort(
                    (a: iImage, b: iImage) =>
                      Number(b.upscaled) - Number(a.upscaled)
                  )[0]?.height / 4
                }`
              }
              className={`w-16 m-[6px] object-cover mobile:w-16 cursor-pointer rounded-lg ${
                currentImage?.url === ele.url ? "ring-2 ring-blue-2" : ""
              }`}
              onClick={() => {
                changeImage(index);
              }}
              alt={index.toString()}
            />
          );
        })}
      </>
    );
  };
  const PromptSection = () => {
    return (
      <div className="w-full mobile:whitespace-normal whitespace-pre-line flex right-0 justify-start absolute mobile:justify-center mobile:relative mobile:ml-0 mr-[19rem] text-gold-500 max-h-[calc(100vh-300px)]">
        <div className="flex flex-col bg-white bg-opacity-20 p-2 rounded-2xl self-stretch items-center justify-between max-h-[calc(100vh-170px)] mobile:h-auto mobile:w-full">
          <div className="relative flex flex-col p-2 bg-none overflow-hidden">
            <p className="w-[16rem] mobile:w-[calc(100%-30px)] text-start text-lg mobile:text-md line-clamp-[15] mobile:line-clamp-[4]">
              {prompt}
            </p>
            <div className="w-full flex justify-end">
              <button
                className="ring-0 outline-0 rounded-full"
                onClick={() => {
                  navigator.clipboard.writeText(prompt);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 1500);
                }}
              >
                {copied ? (
                  <CheckCircleIcon className="text-blue-1 w-8 h-8 mobile:w-6 mobile:h-6" />
                ) : (
                  <DocumentDuplicateIcon className="w-8 h-8 mobile:w-6 mobile:h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      {currentImage && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => handleClose()}
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
              <Dialog.Overlay className="fixed inset-0 backdrop-blur-lg transition-opacity" />
            </Transition.Child>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="fixed inset-0 overflow-y-auto px-20 py-10 mobile:py-5 mobile:px-2 font-satoshi ">
              <div className="relative flex min-h-full items-center max-h-[calc(100vh-100px)] justify-center mobile:p-2 text-center">
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
                    className={`relative flex mobile:flex-col itme-center justify-center rounded-2xl mobile:w-full mobile:max-h-full transform scrollbar-hide shadow-xl bg-white bg-opacity-20 transition-all group  max-w-[calc(100%-500px)] mobile:max-w-full`}
                  >
                    {/* <XMarkIcon
                      className="w-10 h-10 text-blue-2 absolute right-1 top-1 cursor-pointer z-10"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    /> */}
                    <div className="block mobile:hidden">{PromptSection()}</div>
                    <div className="relative flex flex-col items-center ">
                      <Image
                        className={`w-auto object-contain rounded-2xl mobile:h-auto transition h-[calc(100vh-170px)]`}
                        src={currentImage.proxy_url}
                        alt={data.content}
                        width={currentImage.width}
                        height={currentImage.height}
                        priority={true}
                      />
                      <div className="absolute opacity-0 group-hover:opacity-90 gap-1 w-full text-end bottom-1">
                        <p className="text-lg mobile:text-sm px-2">
                          {currentImage?.width} X {currentImage?.height}
                        </p>
                      </div>
                    </div>
                    <div className="hidden mobile:block">{PromptSection()}</div>
                    <div className="w-full mobile:whitespace-normal whitespace-pre-line flex text-center justify-end absolute mobile:justify-center mobile:relative mobile:ml-0 ml-40 text-gold-500 max-h-[calc(100vh-300px)]">
                      <div className="flex flex-col self-stretch items-center justify-between h-[calc(100vh-170px)] mobile:h-auto mobile:w-full">
                        <div className="flex flex-col mobile:flex-row items-center w-full mobile:my-3">
                          {data.images && data.images.length > 1 && (
                            <div className="z-90 items-center mobile:flex justify-between w-full">
                              <button
                                disabled={currentIndex === 0}
                                className={
                                  "outline-0 ring-0 text-blue-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer p-0"
                                }
                                onClick={() => changeImage(currentIndex - 1)}
                              >
                                <div className="mobile:hidden block">
                                  <ChevronUpIcon className=" w-8 h-8" />
                                </div>
                                <div className="hidden mobile:block">
                                  <ChevronLeftIcon className=" w-8 h-8" />
                                </div>
                              </button>
                              <div className="flex flex-col mobile:flex-row items-center justify-start content-center max-h-[calc(100vh-500px)] overflow-scroll scrollbar-hide">
                                {rederOptionImage()}
                              </div>
                              <button
                                disabled={currentIndex === totalImages - 1}
                                className={
                                  "outline-0 ring-0 text-blue-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                }
                                onClick={() => changeImage(currentIndex + 1)}
                              >
                                <div className="mobile:hidden block">
                                  <ChevronDownIcon className=" w-8 h-8" />
                                </div>
                                <div className="hidden mobile:block">
                                  <ChevronRightIcon className=" w-8 h-8" />
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="mobile:mb-2 mobile:w-full mobile:justify-end flex flex-col mobile:flex-row px-2">
                          <div
                            className="flex flex-col mobile:flex-row gap-2 ring-0 outline-0 rounded-full text-white"
                          >
                            <LinkIcon className="cursor-pointer w-10 h-10 mobile:w-8 mobile:h-8 p-1 border-none bg-white bg-opacity-40 mobile:border-none border-white rounded-full" 
                            onClick={()=>{navigator.clipboard.writeText(`https://picsy.art/image/${data.id}`)}}/>
                            <ArrowDownIcon className="cursor-pointer w-10 h-10 mobile:w-8 mobile:h-8 p-1 border-none bg-white bg-opacity-40 mobile:border-none border-white rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="rounded-xl mobile:rounded-[14px] inline-block align-bottom text-left transform transition-all min-h-fit overflow-auto shadow-gray-600">
                        <div className="flex content-center overflow-hidden justify-center mobile:flex-col lg:flex-col h-full w-full items-center "> */}
                    {/* <div className="rounded-xl w-[20%] z-10 flex self-stretch justify-between flex-col items-start mobile:w-full pt-8 p-6 mobile:ml-0 mobile:border-t-[1px] mobile:border-l-0 border-blue-2 mobile:p-4  gap-2 ">
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
                                  <div className="cursor-pointer w-full flex items-center justify-center gap-1 px-2 py-2 border border-black-2 shadow-black transition text-black-2 bg-blue-1 rounded-xl mobile:px-2">
                                    <>
                                      <CheckCircleIcon className="w-6 h-6" />
                                      Prompt copied
                                    </>
                                  </div>
                                ) : (
                                  <div
                                    className="cursor-pointer w-full flex items-center justify-center gap-1 px-2 py-2 border border-blue-2 shadow-black bg-black-2 text-blue-2 rounded-xl mobile:px-2"
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
                                  className="cursor-pointer w-full flex items-center justify-center gap-1 px-2 py-2 border border-blue-2 shadow-black bg-black-2 text-blue-2 rounded-xl"
                                  onClick={downloadImage}
                                >
                                  <FolderArrowDownIcon className="w-6 h-6 " />{" "}
                                </div>
                              </div>
                            </div>
                          </div> */}

                    {/* </div>
                      </div> */}
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
