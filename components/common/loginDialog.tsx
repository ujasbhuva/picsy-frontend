import { Dialog, Transition } from '@headlessui/react'
import {
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { toast } from 'react-hot-toast'
import { SignInWith, sessionLogin } from '../../apiHelper/user'
import { getToken } from '../../utils/auth'
import GoogleButton from '../../utils/googleButton'
import { CheckIcon } from '../icons/CheckIcon'

const LoginDialog = ({ isOpen, setIsOpen }: any) => {
  const router = useRouter()
  const [isLoadingWithGoogle, setIsLoadingWithGoogle] = useState<boolean>(false)

  const onGoogle = async (idToken: string) => {
    try {
      setIsLoadingWithGoogle(true)
      const signInWith = SignInWith.SIGN_WITH_GOOGLE
      const { email: _email } = await sessionLogin({
        idToken,
        signInWith
      })
      router.push('/generateimage')
      setIsOpen(false)
    } catch (error: any) {
      toast.error('Failed to login')
    } finally {
      setIsLoadingWithGoogle(false)
    }
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className='relative'
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 backdrop-blur-lg bg-black bg-opacity-10 transition-opacity' />
          </Transition.Child>
          <span
            className='hidden sm:inline-block sm:align-middle sm:h-screen'
            aria-hidden='true'
          >
            &#8203;
          </span>
          <div className='fixed inset-0 overflow-y-auto px-20 py-10 mobile:p-1 font-satoshi text-black'>
            <div className='relative flex min-h-full items-center max-h-[calc(100vh-100px)] justify-center mobile:p-2 text-center mobile:items-start mobile:h-screen mobile:flex-col mobile:flex mobile:justify-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel
                  className={`relative flex flex-col mobile:justify-start justify-center rounded-2xl mobile:w-full mobile:max-h-full transform scrollbar-hide shadow-xl bg-white transition-all group  max-w-[calc(100%-400px)] mobile:max-w-full p-12 mobile:p-3`}
                >
                  <button
                    className='absolute right-2 top-2'
                    onClick={() => setIsOpen(false)}
                  >
                    <XMarkIcon className='w-7 h-7' />
                  </button>
                  <h1 className='text-2xl font-bold'>Let's Get Started!</h1>
                  <Dialog.Description className='mt-3 text-lg'>
                    Please login to continue generating the images.
                    <br />
                    It's all free, no credit card required!
                  </Dialog.Description>
                  <div className='w-full flex justify-center mt-8'>
                    <div className='flex flex-end m-2 relative rounded-full w-[205px] p-[3px] pt-[2.5px] h-12 overflow-hidden'>
                      {!getToken() && (
                        <div className='absolute flex justify-center bg-none'>
                          <GoogleButton
                            handleSignIn={onGoogle}
                            isLoading={isLoadingWithGoogle}
                            disabled={isLoadingWithGoogle}
                            buttonWidth={200}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='w-full text-start text-sm mt-10'>
                    <p className='w-96 flex'>
                      <span><CheckIcon className="w-5 h-5 mt-0.5 mr-1" /></span>by continuing with google you are agreeing to our terms
                      and conditions. please review terms of use.
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default LoginDialog
