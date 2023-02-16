import "../styles/globals.css";
import { Provider } from "react-redux";
import logger from "redux-logger";
import { configureStore } from "@reduxjs/toolkit";
import reducers from "../store/reducers";
import Main from "../components/main";
import Script from "next/script";

const preloadedState = {};
const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware: any) =>
    process.env.NEXT_PUBLIC_ENV !== "prod"
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware(),
  devTools: process.env.NEXT_PUBLIC_ENV !== "prod",
  preloadedState,
});

export default function App(props: any) {
  return (
    <>
      <>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-KNQGMWCWXP"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-KNQGMWCWXP', {
                      page_path: window.location.pathname,
                    });
                  `,
          }}
        />
        <Script
          id="pinterest"
          dangerouslySetInnerHTML={{
            __html: `
              !function(e){if(!window.pintrk){window.pintrk = function () {
                window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
                  n=window.pintrk;n.queue=[],n.version="3.0";var
                  t=document.createElement("script");t.async=!0,t.src=e;var
                  r=document.getElementsByTagName("script")[0];
                  r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
                pintrk('load', '2612513499571', {em: '<user_email_address>'});
                pintrk('page');
                  `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://ct.pinterest.com/v3/?event=init&tid=2612513499571&pd[em]=<hashed_email_address>&noscript=1"
          />
        </noscript>

        <Script
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        />
        <Script
          dangerouslySetInnerHTML={{
            __html: `
       	(adsbygoogle = window.adsbygoogle || []).push({
         	google_ad_client: "ca-pub-3599010507595948",
         	enable_page_level_ads: true
         	});
        	`,
          }}
        />
      </>
      <Provider store={store}>
        <Main {...props} />
      </Provider>
    </>
  );
}
