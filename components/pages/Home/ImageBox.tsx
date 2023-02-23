import { useState } from "react";
import {
  ArrowDownIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  PhotoIcon,
} from "@heroicons/react/20/solid";
import { saveAs } from "file-saver";
import Image from "next/image";
import { v4 as uuid } from "uuid";
import { CommonLoader } from "../../common/loader/CommonLoader";

const ImageBox = ({ setIsOpenDialog, setCurrentImage, data, current }: any) => {
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const downloadImage = (url: string) => {
    try {
      setDownloading(true);
      saveAs(url, "picsy_" + uuid() + ".png");
    } catch (e) {
      console.log(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative cursor-ponter group">
      <Image
        onClick={() => {
          setIsOpenDialog(true);
          setCurrentImage(data);
        }}
        className="w-full object-cover rounded-lg"
        src={
          current?.proxy_url +
          `?width=${current?.width / 4}&height=${current?.height / 4}`
        }
        alt={data.content.replaceAll("- Upscaled by", "").slice(0, 50)}
        unoptimized
        width={current?.width / 3}
        height={current?.height / 3}
        onLoadingComplete={() => setLoaded(true)}
      />
      {!loaded && (
        <CommonLoader
          parentClassName="float-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          childClassName="h-20 w-20 border-2"
        />
      )}
      {data.images.length > 1 && (
        <div className="flex invisible mobile:visible flex-row absolute top-1 left-0 group-hover:visible gap-1 mobile:hidden">
          <p className="flex items-center gap-1 text-sm mobile:text-sm px-2">
            <PhotoIcon className="w-6 h-6" />x {data.images.length}
          </p>
        </div>
      )}
      <div className="flex invisible mobile:visible flex-row absolute bottom-1 left-1 group-hover:visible gap-1">
        <p className="text-sm mobile:text-sm px-2">
          {current?.width} x {current?.height}
        </p>
      </div>
      <div className="flex invisible mobile:visible flex-row absolute bottom-1 right-1 group-hover:visible gap-1">
        <button
          className="z-[2] w-full flex justify-center items-center rounded-xl mobile:w-fit p-2 bg-white bg-opacity-30 hover:bg-opacity-50 gap-2 ring-0 outline-0"
          onClick={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(data.prompt);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 500);
          }}
        >
          {copied ? (
            <CheckCircleIcon className="text-blue-1 w-5 h-5" />
          ) : (
            <DocumentDuplicateIcon className="w-5 h-5" />
          )}
        </button>
        <button
          className="relative z-[2] w-full flex justify-center items-center rounded-xl mobile:w-fit p-2 bg-white bg-opacity-30 hover:bg-opacity-50 gap-2 ring-0 outline-0"
          onClick={() => downloadImage(current.proxy_url)}
        >
          {downloading ? (
            <CommonLoader
              parentClassName="float-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              childClassName="w-5 h-5 border-2"
            />
          ) : (
            <ArrowDownIcon className="cursor-pointer w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageBox;
