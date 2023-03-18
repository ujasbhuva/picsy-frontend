import { HeartIcon } from "@heroicons/react/20/solid";
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
                  {/* <Link href="/blog">
                    <div className="text-blue-2 hover:text-blue-1">Twitter</div>
                  </Link>
                  <Link href="/privacy-policy">
                    <div className="text-blue-2 hover:text-blue-1">Reddit</div>
                  </Link> */}
                </div>
              </div>
            </div>
          </div>
          {/* <div className='flex text-sm mt-3 mobile:ml-2'>
            <div>&#169; 2022 MyComp. All rights reserved.</div>
            <div className='ml-2 text-rb-1'>
              <Link href={'/sitemap'}>Sitemap</Link>
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}

export default Footer;
