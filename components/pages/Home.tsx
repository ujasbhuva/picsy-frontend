import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getImagesThroughNextAPI,
  iImage,
  iImagePayload,
} from "../../apiHelper/images";
import Loader from "../common/loader/GlobalLoader";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import {
  ArrowDownIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/20/solid";
import ImageDialog from "../common/imageDialog";
import { toast } from "react-hot-toast";
import baseImages from "../../data.json";
import { saveAs } from "file-saver";
import { CommonLoader } from "../common/loader/CommonLoader";
import Image from "next/image";

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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const { imageId: imgId } = router.query;
    if (imgId && baseImages && Array.isArray(baseImages)) {
      const img = baseImages.filter((data: iImagePayload) => {
        if (data.id.toString() === imgId.toString()) {
          return true;
        } else {
          return false;
        }
      });
      if (img.length > 0) {
        setCurrentImage(img[0]);
        setIsOpenDialog(true);
      }
    }
  }, [router, baseImages]);

  useEffect(() => {
    if (!searchText) {
      getData();
    }
  }, [baseImages]);

  //  const handleScroll = (e: any) => {
  //     const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
  //     if (bottom) {
  //       getData()
  //      }
  //   }

  const getBase = () => {
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
  };

  const getData = async (start?: boolean) => {
    if (searchText) {
      try {
        const inputs = start
          ? {
              query: searchText,
              search_after: images[images.length - 1].id.toString(),
            }
          : {
              query: searchText,
            };

        setIsLoading(true);
        const data = await getImagesThroughNextAPI(inputs);
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
    } else {
      getBase();
    }
  };

  const downloadImage = (url: string) => {
    saveAs(url, "picsy.png"); // Put your image url here.
  };

  return (
    <>
      {isLoading && <Loader loading={isLoading} />}
      <div className="flex flex-col items-start mt-10 mobile:mt-6">
        <div className="flex flex-col justify-center">
          <img
            src={"/full-logo.svg"}
            alt="Picsy"
            className="object-cover h-[80px] mobile:h-[40px]"
            onClick={() => {
              router.push("/");
            }}
          />
          {/* <div className="flex flex-col ml-5 mobile:ml-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-2 to-teal-500">
            <h1
              className="text-[3rem] mobile:text-[2rem] font-[500]"
              onClick={() => {
                router.push("/");
              }}
            >
            </h1>
          </div> */}
        </div>
        <div className="items-center text-blue-1 mobile:mt-1 gap-1">
          <h1 className="text-lg mobile:text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-2 to-teal-500">
            #1 Searching tool for {/* <span>*/}
            <a
              className="underline underline-offset-2 decoration-blue-2 ring-0 outline-0"
              href="https://midjourney.com/home/"
              target={"_blank"}
            >
              Midjourney
            </a>{" "}
            {/*</span> */}
            generated images
          </h1>
        </div>
      </div>
      <div className="mb-16 w-2/5 sm:w-2/5 mobile:w-full tablet:w-3/5 max-w-[600px] flex justify-end items-center relative mt-16 mobile:my-8">
        <input
          className=" w-full p-3 text-white bg-blue-2 bg-opacity-20 rounded-xl border-0 outline-0 focus:ring-2 focus:ring-opacity-40 focus:ring-blue-2"
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
          <div className="flex absolute mr-2 itams-center text-white bg-black-2 ">
            <button disabled={isLoading}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 25 25"
                strokeWidth={1.5}
                stroke="currentColor"
                className="cursor-pointer h-7 w-7 bg-blue-2 bg-opacity-10"
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
                className="cursor-pointer h-7 w-7 bg-blue-2 bg-opacity-10"
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
        <p className="mt-4 text-blue-2">{totalResult} Results found</p>
      ) : null}

      <div className="w-full mb-10 mt-3">
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
              const current = data.images.sort(
                (a: iImage, b: iImage) =>
                  Number(b.upscaled) - Number(a.upscaled)
              )[0];
              return (
                <div key={index} className="relative cursor-ponter group">
                  <Image
                    onClick={() => {
                      setIsOpenDialog(true);
                      setCurrentImage(data);
                    }}
                    className="w-full object-cover rounded-lg"
                    src={
                      current?.proxy_url +
                      `?width=${current?.width / 2}&height=${
                        current?.height / 2
                      }`
                    }
                    alt={data.content
                      .replaceAll("- Upscaled by", "")
                      .slice(0, 50)}
                    // placeholder="blur"
                    // blurDataURL={current?.proxy_url +
                    //   `?width=${current?.width / 5}&height=${
                    //     current?.height / 5
                    //   }`}
                    unoptimized
                    width={current?.width / 2}
                    height={current?.height / 2}
                  />
                  <div className="flex invisible mobile:visible flex-row absolute bottom-1 left-1 group-hover:visible gap-1">
                    <p className="text-sm mobile:text-sm px-2">
                      {current?.width} X {current[0]?.height}
                    </p>
                  </div>
                  <div className="flex invisible mobile:visible flex-row absolute bottom-1 right-1 group-hover:visible gap-1">
                    <button
                      className="z-[9999] w-full flex justify-center items-center rounded-xl mobile:w-fit p-2 bg-white bg-opacity-30 hover:bg-opacity-50 gap-2 ring-0 outline-0"
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
                      className="z-[9999] w-full flex justify-center items-center rounded-xl mobile:w-fit p-2 bg-white bg-opacity-30 hover:bg-opacity-50 gap-2 ring-0 outline-0"
                      onClick={() => downloadImage(current.proxy_url)}
                    >
                      <ArrowDownIcon className="cursor-pointer w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>
      </div>
      {images.length > 0 && (
        <button
          className="text-white cursor-pointer flex items-center py-2 px-5 bg-blue-2 bg-opacity-40 rounded-xl mb-10"
          onClick={() => {
            getData(true);
          }}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Load more"}
          {!isLoading ? (
            <ChevronDownIcon className="w-6 h-6" />
          ) : (
            <CommonLoader
              parentClassName="ml-2 flex w-full items-end"
              childClassName=" h-6 w-6 border-2"
            />
          )}
        </button>
      )}
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
            Picsy is an image searching tool for Midjourney generated images,
            that provides an inteface to search and download the images it for
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
