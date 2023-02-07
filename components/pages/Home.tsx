import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getImagesThroughNextAPI,
  iImage,
  iImagePayload,
} from "../../apiHelper/images";
import Loader from "../common/loader";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import ImageDialog from "../common/imageDialog";
import { toast } from "react-hot-toast";
import baseImages from "../../data.json";

interface HmpageProps {
  imageId?: string;
}

const Home: React.FC<HmpageProps> = ({ imageId }) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [totalResult, setTotalResult] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [currentImage, setCurrentImage] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [images, setImages] = useState<iImagePayload[]>([]);

  useEffect(() => {
    const img =
      baseImages &&
      baseImages?.filter(
        (data: iImagePayload) => data.id.toString() === imageId
      );
    if (img.length > 0) {
      setIsOpenDialog(true);
      setCurrentImage(img[0]);
    }
  }, [imageId]);

  useEffect(() => {
    const arr: iImagePayload[] = baseImages
      .filter((data: iImagePayload) => {
        if (data.images.filter((data: iImage) => data.upscaled).length > 0) {
          return true;
        } else {
          return false;
        }
      })
      .sort(() => Math.random() - 0.5)
      .slice(0, 800);
    setImages(arr);
  }, [baseImages]);

  const getData = async (start?: boolean) => {
    try {
      setIsLoading(true);
      const data = await getImagesThroughNextAPI({
        searchText: searchText,
        offset: start ? offset : undefined,
      });
      setTotalResult(data?.total);
      const arr = data?.images;
      setImages((preval) => {
        return start ? [...preval, ...arr] : arr;
      });
      setOffset(() => {
        return start ? offset + arr?.length : arr?.length;
      });
    } catch (err: any) {
      toast.error("Sorry, we cannot proceed your request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader loading={isLoading} />}
      <div className="flex items-center mt-10 mobile:mt-6">
        <img
          src={"/android-chrome-512x512.png"}
          alt="Orange"
          className="object-cover h-[120px]"
        />
        <div className="flex flex-col ml-5">
          <h1
            className="text-[2.5rem] cursor-pointer font-[300] text-light dark:text-orange-100 text-orange-900 text-medium mobile:text-[2rem]"
            onClick={() => {
              router.push("/");
            }}
          >
            AI Art Search
          </h1>
          <p className="text-lg mobile:mt-1 mobile:text-sm dark:text-orange-200 text-orange-700 ">
            Search images generated in{" "}
            <a
              className="dark:text-orange-500 text-orange-400 ring-0 outline-0"
              href="https://midjourney.com/home/"
              target={"_blank"}
            >
              midjourney
            </a>{" "}
          </p>
        </div>
      </div>
      <div className="w-2/5 sm:w-2/5 mobile:w-full tablet:w-3/5 max-w-[600px] flex justify-end items-center relative mt-16 mobile:mt-8">
        <input
          className="w-full p-3 dark:bg-[#311808] bg-orange-100 rounded-xl border-0 outline-0 focus:ring-1 focus:ring-orange-500 dark:text-orange-200 text-orange-700 placeholder-[#8B4000] "
          placeholder="Search images"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          required={true}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getData(false);
            }
          }}
        />
        {searchText && (
          <div className="flex gap-1 absolute mr-2 dark:bg-[#311808] bg-orange-100 itams-center">
            <button disabled={isLoading}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 25 25"
                strokeWidth={1.5}
                stroke="currentColor"
                className="cursor-pointer text-orange-500 h-7 w-7"
                onClick={() => getData(false)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
            <button disabled={isLoading}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="cursor-pointer text-orange-500 h-7 w-7"
                onClick={() => setSearchText("")}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      {totalResult && totalResult > 0 ? (
        <p className="mt-4 dark:text-orange-200 text-orange-700">
          {totalResult} Results found
        </p>
      ) : null}

      <div className="w-full my-10">
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            0: 1,
            400: 2,
            750: 3,
            900: 4,
            1300: 5,
            1500: 7,
            1800: 8,
          }}
        >
          <Masonry gutter="5px">
            {images.map((data: any, index: number) => {
              return (
                <div
                  key={index}
                  className="relative cursor-ponter"
                  onClick={() => {
                    setIsOpenDialog(true);
                    setCurrentImage(data);
                  }}
                >
                  <Image
                    className="w-full object-cover rounded-lg"
                    src={
                      data.images.sort(
                        (a: iImage, b: iImage) =>
                          Number(b.upscaled) - Number(a.upscaled)
                      )[0]?.proxy_url +
                      `?width=${
                        data.images.sort(
                          (a: iImage, b: iImage) =>
                            Number(b.upscaled) - Number(a.upscaled)
                        )[0]?.width / 2
                      }&height=${
                        data.images.sort(
                          (a: iImage, b: iImage) =>
                            Number(b.upscaled) - Number(a.upscaled)
                        )[0]?.height / 2
                      }`
                    }
                    alt={data.content.slice(0, 50)}
                    // placeholder="blur"
                    // blurDataURL={`/apple-touch-icon.png`}
                    unoptimized
                    width={
                      data.images.sort(
                        (a: iImage, b: iImage) =>
                          Number(b.upscaled) - Number(a.upscaled)
                      )[0]?.width / 2
                    }
                    height={
                      data.images.sort(
                        (a: iImage, b: iImage) =>
                          Number(b.upscaled) - Number(a.upscaled)
                      )[0]?.height / 2
                    }
                  />
                  {/* <img src={data?.proxy_url} className="object-cover rounded-xl drop-shadow shadow-orange-100" /> */}
                </div>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>
      </div>
      {/* {images.length > 0 && (
        <button
          className="text-orange-100 cursor-pointer flex items-center p-3 px-5 bg-[#311808] rounded-full"
          onClick={() => {
            getData(true);
          }}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Load more"}
          {!isLoading ? (
            <ChevronDownIcon className="w-6 h-6" />
          ) : (
            <svg
              className="ml-2 animate-spin h-5 w-5 text-pink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
        </button>
      )} */}
      {isOpenDialog && (
        <ImageDialog
          isOpen={isOpenDialog}
          setIsOpen={setIsOpenDialog}
          data={currentImage}
        />
      )}
    </>
  );
};

export default Home;
