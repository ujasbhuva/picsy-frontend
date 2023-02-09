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
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import ImageDialog from "../common/imageDialog";
import { toast } from "react-hot-toast";
import baseImages from "../../data.json";
import { Disclosure } from "@headlessui/react";

interface HmpageProps {
  imageId?: string;
}

const Home: React.FC<HmpageProps> = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>("");
  const [totalResult, setTotalResult] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [currentImage, setCurrentImage] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [images, setImages] = useState<iImagePayload[]>([]);

  // useEffect(() => {
  //   const { imageId: imgId } = router.query;
  //   console.log(typeof imgId);
  //   const img = baseImages.filter(
  //     (data: iImagePayload) => data.id === parseInt(imgId ? imgId  : "")
  //   );
  //   console.log(img);
  //   if (img.length > 0) {
  //     setCurrentImage(img[0]);
  //     setIsOpenDialog(true);
  //   }
  // }, [router, baseImages]);

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
      .slice(0, 1000);
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
      <div className="flex flex-col items-start mt-10 mobile:mt-6">
        <div className="flex items-center">
          <img
            src={"/android-chrome-512x512.png"}
            alt="Orange"
            className="object-cover h-[50px] mobile:h-[40px]"
          />
          <div className="flex flex-col ml-5 mobile:ml-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-2 to-teal-500">
            <h1
              className="text-[3rem] mobile:text-[2rem] font-[500]"
              onClick={() => {
                router.push("/");
              }}
            >
              Picsy
              {/* <p className="text-lg m-2">{"(1rt search)"}</p> */}
            </h1>
          </div>
        </div>
        <div className="items-center text-blue-1 mobile:mt-1 gap-1">
          <p className="text-lg mobile:text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-2 to-teal-500">
            #1 Searching tool for {/* <span>*/}
            <a
              className="text underline underline-offset-4 ring-0 outline-0"
              href="https://midjourney.com/home/"
              target={"_blank"}
            >
              Midjourney
            </a>{" "}
            {/*</span> */}
            generated art
          </p>
        </div>
      </div>
      <div className="w-2/5 sm:w-2/5 mobile:w-full tablet:w-3/5 max-w-[600px] flex justify-end items-center relative mt-16 mobile:mt-8">
        {/* <input
          className=" mb-16 mobile:mb-8 w-full p-3 dark:bg-[#311808] bg-orange-100 rounded-xl border-0 outline-0 focus:ring-1 focus:ring-orange-500 dark:text-orange-200 text-orange-700 placeholder-[#8B4000] "
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
        /> */}
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
        <p className="mt-4 text-blue-2">
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
      <div className="w-full flex flex-col items-center border-t border-white">
        <div className="max-w-xl mobile:max-w-full">
          {/* <h2 className="text-2xl font-[500] my-4">FAQs</h2> */}
          <h3 className="text-2xl mobile:text-lg text-blue-1 font-[500] my-4">
            Powerful image searching tool for Midjourney Images
          </h3>
          <p className="text-lg mobile:text-sm text-white">
            Picsy is an image searching tool for Midjourney generated arts, that
            provides an inteface to search and download the images it for
            general purposes including research, education, and personal
            experience. Picsy holds data of more than 6 millon images with
            different kind of genres.
          </p>
          <h3 className="text-2xl mobile:text-lg text-blue-1 font-[500] my-4">
            What is Midjourney?
          </h3>
          <p className="text-lg mobile:text-sm text-white">
            Midjourney is an independent research lab that has invented an
            artificial intelligence program with the same name to produce images
            from verbal portrayals, similar to{" "}
            <a href="https://openai.com/" target={"_blank"}>
              OpenAI
            </a>
            's <a href="">DALL-E-2</a> and <a>Stable Diffusion</a>. People make
            artworks with AI model using{" "}
            <a href="https://midjourney.com/auth/signin/" target={"_blank"}>
              Discord
            </a>
            's Midjourney bot commands. It is inferred that the underlying
            technology is based on Stable Diffusion. The tool is at present in
            open beta, which began on July 12, 2022. The group at Midjourney is
            headed by David Holz, who was a co-founder of Leap Motion. . It is
            speculated that the underlying technology is based on Stable
            Diffusion.
          </p>
          <h3 className="text-2xl mobile:text-lg text-blue-1 font-[500] my-4">
            What is Generative AI?
          </h3>
          <p className="text-lg mobile:text-sm text-white">
            Generative Artificial Intelligence (AI) is a term used for the
            algorithms that are utilized to develop new information resembling
            human-generated sources, such as sound, coding, photographs, text,
            models and videos. This technology is trained with preexisting
            content and data, allowing for various applications like natural
            language interpretation, computer vision, metaverse, and voice
            synthesis.
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
