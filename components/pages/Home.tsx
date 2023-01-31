import { useState } from "react";
import { useRouter } from "next/router";
import { UserInfo } from "../../api/users";
import { GlobalState } from "../../store/reducers";
import { connect, useDispatch } from "react-redux";
import axios from "axios";
import Loader from "../common/loader";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Image from "next/image";
import {
  ChevronDoubleDownIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import ImageDialog from "../common/imageDialog";
import { toast } from "react-hot-toast";

interface HomePageProps {
  userInfo: UserInfo;
}

const Home: React.FC<HomePageProps> = ({ userInfo }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState<string>("");
  const [totalResult, setTotalResult] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [currentImage, setCurrentImage] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [images, setImages] = useState<any[]>([]);

  const getData = async (start?: boolean) => {
    try {
      setIsLoading(true);
      let pageOffset = start ? `&offset=${offset}` : "";
      const data = await axios.get(
        `https://discord.com/api/v9/guilds/662267976984297473/messages/search?content=${searchText}${pageOffset}`,
        {
          headers: {
            accept: "*/*",
            authorization: process.env.NEXT_PUBLIC_AUTH_TOKEN,
            // "x-super-properties": process.env.NEXT_PUBLIC_SUPER_PROPERTY,
          },
        }
      );
      let fetchImages = data?.data?.messages ?? [];
      let arr: any[] = [];
      fetchImages.forEach((data: any) => {
        if (data.length > 0) {
          data.forEach((ele: any) => {
            if (ele.attachments.length > 0) {
              ele.attachments.forEach((item: any) => {
                arr.push({ ...item, content: ele?.content });
              });
            }
          });
        }
      });

      setTotalResult(data?.data?.total_results);
      setImages((preval) => {
        return start ? [...preval, ...arr] : arr;
      });
      setOffset((preval) => {
        return preval + data?.data?.messages?.length;
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
          columnsCountBreakPoints={{ 0: 2, 400: 2, 750: 3, 900: 4, 1300: 6 }}
        >
          <Masonry gutter="10px">
            {images &&
              images.length > 0 &&
              images.map((data: any, index: number) => {
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
                      className="w-full object-cover rounded-xl "
                      src={data?.proxy_url}
                      alt={"prompt"}
                      placeholder="blur"
                      blurDataURL={`/apple-touch-icon.png`}
                      unoptimized
                      width={100}
                      height={200}
                    />
                    {/* <img src={data?.proxy_url} className="object-cover rounded-xl drop-shadow shadow-orange-100" /> */}
                  </div>
                );
              })}
          </Masonry>
        </ResponsiveMasonry>
      </div>
      {images.length > 0 && (
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
      )}
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

const mapStateToPros = (state: GlobalState) => {
  return {
    userInfo: state.main.userInfo,
  };
};

export default connect(mapStateToPros)(Home);
