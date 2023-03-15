import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/20/solid";
import { NextComponentType, NextPage, NextPageContext } from "next";
import { ReactElement, ReactNode, useEffect } from "react";
import { Toaster, resolveValue } from "react-hot-toast";
import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js";
import { freeLogin } from "../apiHelper/browser";

export type NextPageWithLayout<P = {}> = NextPage<P, P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MainProps {
  Component: NextComponentType<NextPageContext, any, {}> & NextPageWithLayout;
  pageProps: any;
}

const Main: React.FC<MainProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    getCurrentBrowserFingerPrint().then(async (fingerprint: string) => {
      await freeLogin({ browser_token: fingerprint });
    });
  }, []);
  return (
    <>
      <Toaster position="bottom-left">
        {(t) => (
          <>
            {t.type === "success" && (
              <div className="bg-blue-2 text-white px-4 py-2 gap-2 rounded-lg flex items-center">
                <CheckCircleIcon className="w-6 h-6" />
                {resolveValue(t.message, t)}
              </div>
            )}
            {t.type === "error" && (
              <div className="bg-red-400 text-white px-4 py-2 gap-2 rounded-lg flex items-center">
                <ExclamationCircleIcon className="w-6 h-6" />
                {resolveValue(t.message, t)}
              </div>
            )}
          </>
        )}
      </Toaster>
      <Component {...pageProps} />
    </>
  );
};

export default Main;
