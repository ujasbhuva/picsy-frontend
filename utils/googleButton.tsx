import React from 'react'
import { toast } from 'react-hot-toast'
import parseJwt from './parseJwt'

export interface JsonObject {
  [key: string]: any
}

interface CredentialResponse {
  credential?: string
  select_by?:
    | 'auto'
    | 'user'
    | 'user_1tap'
    | 'user_2tap'
    | 'btn'
    | 'btn_confirm'
    | 'brn_add_session'
    | 'btn_confirm_add_session'
  clientId?: string
}

interface GoogleButtonProps {
  disabled?: boolean
  isLoading?: boolean
  handleSignIn?: (idToken: string, email?: string) => void
  buttonWidth?: number
}

class GoogleButton extends React.Component<GoogleButtonProps> {
  componentDidMount (): void {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.onload = this.initializeGsi
    script.async = true
    script.id = 'google-client-script'
    document.querySelector('body')?.appendChild(script)
  }

  componentWillUnmount (): void {
    const wnd: JsonObject = window
    wnd.google?.accounts.id.cancel()
    document.getElementById('google-client-script')?.remove()
  }

  initializeGsi = () => {
    const wnd: JsonObject = window
    if (!wnd.google) return

    wnd.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      // login_uri: "http://localhost:3000/login",
      // ux_mode: "redirect",
      callback: this.handleGoogleSignIn,
      cancel_on_tap_outside: false,
      context: 'use'
    })
    const buttonElement = document.getElementById('sign-with-google')
    if (buttonElement) {
      wnd.google.accounts.id.renderButton(buttonElement, {
        theme: 'filled_blue',
        size: 'medium',
        width: `${this.props?.buttonWidth ?? 199}px`,
        text: 'continue_with',
        shape:'circle'
      })
      // wnd.google.accounts.id.prompt() // also display the One Tap dialog
    }
  }

  handleGoogleSignIn = (res: CredentialResponse) => {
    if (!res.clientId || !res.credential) {
      toast.error(`Google authentication error`)
      return
    }
    if (this.props.handleSignIn) {
      let email = ''
      try {
        email = parseJwt(res.credential)?.email
      } catch (err) {}
      this.props.handleSignIn(res.credential, email)
    }
  }

  render () {
    return (
      <div className='w-fit relative mt-2'>
        <div id='sign-with-google' />
        {(this.props.isLoading || this.props.disabled) && (
          <div className='bg-gray-100 bg-opacity-50 absolute w-full h-full left-0 top-0 flex justify-center items-center'>
            {this.props.isLoading && (
              <svg
                className='animate-spin h-5 w-5'
                xmlns='http://www.w3.org/2000/svg'
                fill='hidden'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='#705CF6'
                  fill='#ffffff'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='#705CF6'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default GoogleButton
