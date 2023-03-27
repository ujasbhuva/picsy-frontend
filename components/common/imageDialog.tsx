import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowDownIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
  LinkIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { Fragment, useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { iImage } from "../../apiHelper/images";
import Image from "next/image";
import { CommonLoader } from "./loader/CommonLoader";
import { uuid } from "uuidv4";

const ImageDialog = ({ isOpen, setIsOpen, data }: any) => {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadedSecond, setLoadedSecond] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [totalImages, setTotalImages] = useState(0);
  const [currentImage, setCurrentImage] = useState<iImage>();
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (data && data.images.length > 0) {
      setCurrentIndex(0);
      setCurrentImage(data.images[0]);
      setTotalImages(data.images.length);
    }
  }, [data]);

  const prompt = data.content
    .replaceAll("- Upscaled by", "")
    .replaceAll("*", "")
    .replaceAll(/ *\([^)]*\) */g, "")
    .replaceAll(/ - .*@.*/g, "")
    .replaceAll(/<.*>/g, "");

  const downloadImage = () => {
    try {
      setDownloading(true);
      saveAs(currentImage?.url ?? "", "picsy_" + uuid() + ".png");
    } catch (e) {
      console.log(e);
    } finally {
      setDownloading(false);
    }
  };

  const changeImage = (setIndex: number) => {
    setCurrentIndex(setIndex);
    setCurrentImage(data.images[setIndex]);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const rederOptionImages = () => {
    return (
      <>
        {data.images.map((ele: any, index: number) => {
          return (
            <img
              key={index}
              src={
                ele.url +
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
                if (currentImage?.url !== ele.url) {
                  setLoadedSecond(false);
                }
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
      <>
        {currentImage && (
          <div
            className={`w-full mobile:whitespace-normal whitespace-pre-line flex right-0 justify-start absolute mobile:justify-center mobile:relative mobile:ml-0 ${
              currentImage?.width > currentImage?.height
                ? "mr-[15rem] "
                : "mr-[17rem]"
            }`}
          >
            <div className="flex flex-col shadow-inner self-stretch items-center mobile:h-auto mobile:w-full">
              <div className="relative flex bg-white bg-opacity-30 mobile:bg-opacity-0 rounded-2xl flex-col p-4 mobile:p-3 bg-none overflow-hidden mobile:w-full">
                {currentImage && (
                  <p
                    className={`mobile:w-full mobile:text-white text-white text-start text-md mobile:text-sm line-clamp-[15] mobile:line-clamp-[5] ${
                      currentImage?.width > currentImage?.height
                        ? "w-[12rem]"
                        : "w-[14rem]"
                    }`}
                  >
                    {prompt}
                  </p>
                )}
              </div>
              <div className="w-full flex justify-center mt-3 mobile:mr-2 mobile:mt-0 mobile:mb-2 mobile:justify-end">
                <button
                  className="w-full text-white flex justify-center items-center rounded-xl mobile:w-fit mobile:px-4 mobile:rounded-xl p-2 py-1 bg-white bg-opacity-20 gap-2 ring-0 outline-0"
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
                  <span className="mobile:hidden">Copy Prompt</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const ActionButton = () => {
    return (
      <div className="mobile:mb-2 mobile:w-full mobile:justify-end flex flex-col mobile:flex-row px-2">
        <div className="flex flex-col mobile:flex-row gap-2 ring-0 outline-0 rounded-full text-white">
          {linkCopied ? (
            <CheckCircleIcon className="cursor-pointer w-10 h-10 mobile:w-8 mobile:h-8 p-1 border-none text-blue-1 bg-white bg-opacity-40 mobile:border-none border-white rounded-full" />
          ) : (
            <LinkIcon
              className="cursor-pointer w-10 h-10 mobile:w-8 mobile:h-8 p-1 border-none bg-white bg-opacity-40 mobile:border-none border-white rounded-full"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://picsy.art/image/${data.idx}`
                );
                setLinkCopied(true);
                setTimeout(() => {
                  setLinkCopied(false);
                }, 1500);
              }}
            />
          )}
          <ArrowDownIcon
            className="cursor-pointer w-10 h-10 mobile:w-8 mobile:h-8 p-1 border-none bg-white bg-opacity-40 mobile:border-none border-white rounded-full"
            onClick={downloadImage}
          />
        </div>
      </div>
    );
  };

  const ImageOptions = () => {
    return (
      <div className="flex flex-col mobile:flex-row items-center w-full mobile:my-3">
        {data.images && data.images.length > 1 && (
          <div className="z-90 items-center mobile:flex justify-between w-full">
            <button
              disabled={currentIndex === 0}
              className={
                "mb-2 outline-0 ring-0 text-white bg-white bg-opacity-40 w-full flex justify-center rounded-t-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mobile:rounded-xl mobile:rounded-l-none mobile:h-full mobile:w-fit "
              }
              onClick={() => changeImage(currentIndex - 1)}
            >
              <div className="mobile:hidden block">
                <ChevronUpIcon className=" w-6 h-6" />
              </div>
              <div className="hidden mobile:block">
                <ChevronLeftIcon className=" w-6 h-6" />
              </div>
            </button>
            <div className="flex flex-col mobile:flex-row items-center justify-start content-center max-h-[calc(100vh-500px)] overflow-scroll scrollbar-hide">
              {rederOptionImages()}
            </div>
            <button
              disabled={currentIndex === totalImages - 1}
              className={
                "mt-2 outline-0 ring-0 text-white bg-white bg-opacity-40 w-full flex justify-center rounded-b-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mobile:rounded-xl mobile:rounded-r-none mobile:h-full mobile:w-fit "
              }
              onClick={() => changeImage(currentIndex + 1)}
            >
              <div className="mobile:hidden block">
                <ChevronDownIcon className=" w-6 h-6" />
              </div>
              <div className="hidden mobile:block">
                <ChevronRightIcon className=" w-6 h-6" />
              </div>
            </button>
          </div>
        )}
      </div>
    );
  };

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

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
              <Dialog.Overlay className="fixed inset-0 backdrop-blur-lg bg-black bg-opacity-60 transition-opacity" />
            </Transition.Child>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="fixed inset-0 overflow-y-auto px-20 py-10 mobile:py-5 mobile:px-2 font-satoshi ">
              <div className="relative flex min-h-full items-center max-h-[calc(100vh-100px)] justify-center mobile:p-2 text-center mobile:items-start">
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
                    className={`relative flex mobile:flex-col mobile:justify-start justify-center rounded-2xl mobile:w-full mobile:max-h-full transform scrollbar-hide shadow-xl bg-white bg-opacity-20 transition-all group  max-w-[calc(100%-400px)] mobile:max-w-full`}
                  >
                    <div className="relative flex flex-col items-center ">
                      {loaded && (
                        <>
                          <XMarkIcon
                            className="w-8 h-8 text-white opacity-50 absolute right-1 top-1 cursor-pointer z-10"
                            onClick={() => {
                              setIsOpen(false);
                            }}
                          />
                          <div className="mobile:hidden absolute left-0 h-full justify-between flex flex-col items-center">
                            {PromptSection()}
                          </div>
                        </>
                      )}
                      <div className="relative w-full h-full rounded-2xl bg-white bg-opacity-5 flex justify-center items-center">
                        {(!loaded || !loadedSecond) && (
                          <CommonLoader
                            parentClassName="absolute p-40 "
                            childClassName="h-20 w-20 border-2"
                          />
                        )}
                        <Image
                          className={`eas-in-out duration-500 w-auto object-contain rounded-2xl mobile:h-auto transition max-h-[calc(100vh-170px)]`}
                          src={currentImage.url}
                          alt={data.content.replaceAll("- Upscaled by", "")}
                          width={currentImage.width}
                          height={currentImage.height}
                          priority={true}
                          blurDataURL={currentImage.url}
                          unoptimized
                          onLoadingComplete={() => {
                            setLoaded(true);
                            setLoadedSecond(true);
                          }}
                        />
                      </div>
                      {loaded && (
                        <>
                          <div className="absolute opacity-0 group-hover:opacity-90 gap-1 w-full text-end bottom-1">
                            <p className="text-lg mobile:text-sm px-2">
                              {currentImage?.width} X {currentImage?.height}
                            </p>
                          </div>
                          <div className="mobile:hidden absolute right-[-90px] h-full justify-between flex flex-col items-center">
                            {ImageOptions()}
                            {ActionButton()}
                          </div>
                        </>
                      )}
                    </div>
                    {loaded && (
                      <>
                        <div className="hidden mobile:block">
                          {PromptSection()}
                        </div>
                        <div className="hidden mobile:block w-full mobile:whitespace-normal whitespace-pre-line text-center justify-end absolute mobile:justify-center mobile:relative mobile:ml-0 ml-40 text-gold-500 max-h-[calc(100vh-300px)]">
                          <div className="flex flex-col self-stretch items-center justify-between h-[calc(100vh-170px)] mobile:h-auto mobile:w-full">
                            {ImageOptions()}
                            {ActionButton()}
                          </div>
                        </div>
                      </>
                    )}
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
