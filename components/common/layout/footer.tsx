import { HeartIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import React, { Component } from 'react'

class Footer extends Component {
  render () {
    return (
      <div className='bg-gray-4 font-satoshi border border-t-blue-300 bg-blue-50'>
        <div className='container mx-auto pt-5 pb-3 mobile:pl-3'>
          <div className='flex items-center justify-between mobile:flex-col mobile:items-start'>
            <div className='justify-start cursor-pointer'>
              <Link href='/'>
                <HeartIcon className='w-10 h-10 text-blue-500' />
              </Link>
            </div>
            <div className='mr-3 justify-start mobile:pl-2'>
              <div className='flex'>
                <div className='flex mobile:flex-col mobile:items-start items-center border-none text-dark text-sm font-bold'>
                  <Link href='/about'>
                    <div className='mr-5 hover:text-blue-500'>Facebook</div>
                  </Link>
                  <Link href='/blog'>
                    <div className='mr-5 hover:text-blue-500 mobile:my-3'>
                      Twitter
                    </div>
                  </Link>
                  <Link href='/privacy-policy'>
                    <div className='mr-5 hover:text-blue-500'>Reddit</div>
                  </Link>
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
    )
  }
}

export default Footer
