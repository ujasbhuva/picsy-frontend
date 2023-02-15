import styles from "../../../styles/Home.module.css";
import Footer from "./footer";
import Head from "next/head";
import { ReactNode, useState } from "react";
import Header from "./header";
import { ClockIcon, ShareIcon, UserPlusIcon } from "@heroicons/react/20/solid";
import WaitlistDialog from "../waitlistDialog";

export default function Layout({
  title = "",
  description = "",
  children,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  const [openWaitList, setOpenWaitList] = useState(false);
  return (
    <div className={`font-satoshi bg-black-1 relative`}>
      <Head>
        {title && <title>{title}</title>}
        {description && <meta name="description" content={description} />}
        <link rel="icon" href="/favicon.ico" />
        <meta name="msvalidate.01" content="223D9979439CC0D3878A9B5736BC49F9" />
      </Head>

      {/* <Header /> */}
      <div
        className={`sticky top-0 flex z-[10] justify-center text-xl mobile:p-2 mobile:text-md`}
      >
        <div className="text-sm flex justify-center gap-1 items-center bg-gradient-to-tr from-blue-2 to-teal-500 rounded-b-xl px-10 pb-1">
          Launching Picsy's AI Image generation soon.
          <p
            className="flex items-center gap-1 underline cursor-pointer"
            onClick={() => {
              setOpenWaitList(true);
            }}
          >
            join waitlist
            <UserPlusIcon className="w-5 h-5" />
          </p>
        </div>
      </div>
      <main
        className={`flex flex-col items-center min-h-[100vh] px-5 pb-[4rem] mobile:px-3`}
      >
        {children}
      </main>
      {/* <Footer /> */}
      <WaitlistDialog isOpen={openWaitList} setIsOpen={setOpenWaitList} />
    </div>
  );
}
