import { EnvelopeIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <div className="font-satoshi border-t border-t-blue-300 bg-black-1">
        <div className="container mx-auto py-4 px-4 mobile:p-3">
          <div className="flex items-center justify-between mobile:flex-col mobile:items-start">
            <div className="justify-start cursor-pointer">
              <Link href="/">
                <img
                  src={"/full-logo.svg"}
                  alt="Picsy"
                  className="object-cover h-[40px] mobile:h-[20px]"
                />
              </Link>
            </div>
            <div className="mr-3 justify-start mobile:mt-2">
              <div className="flex">
                <div className="flex gap-5 mobile:flex-col mobile:items-start items-center border-none text-dark text-sm font-bold">
                  <Link href="/blog">
                    <div className="text-blue-2 hover:text-blue-1">Blogs</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <a
            href="mailto:contact@picsy.art"
            className="my-4 w-fit text-white flex items-center gap-1 px-3 z-[5] mobile:bottom-3 mobile:left-3 bottom-6 left-6 bg-gradient-to-br from-blue-2 to-teal-600 rounded-lg mobile:px-2 mobile:py-1 shadow-lg shadow-black text-sm"
          >
            <EnvelopeIcon className="w-6 h-6" /> Contact Us
          </a>
        </div>
      </div>
    );
  }
}

export default Footer;
