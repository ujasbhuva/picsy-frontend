import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { ratios } from '../pages/GenerateImage'

export interface ratioOption {
  name: string
  width: number
  height: number
  class: string
}

interface ImageRatioComboboxProps {
  selected: ratioOption
  setSelected: any
}

export default function ImageRatioCombobox ({
  selected,
  setSelected
}: ImageRatioComboboxProps) {
  const [query, setQuery] = useState('')

  return (
    <div className='w-2/3 sm:w-full mobile:w-full z-[10] text-[white]'>
      <Combobox value={selected} onChange={setSelected}>
        <div className='relative mt-3'>
          <div className='relative w-full cursor-default overflow-hidden'>
            <Combobox.Button className='relative flex items-center w-full p-2 rounded-lg outline-none bg-blue-1 bg-opacity-10 placeholder:opacity-70 border-[2px] border-white border-opacity-20 mr-2 text-left'>
              <div className={`flex content-start justify-start gap-2`}>
                <div className='w-7 flex items-center justify-center'>
                  <div
                    className={`rounded-[2px] border-[2px] ${selected.class} border-white bg-gradient-to-r from-blue-1 to-teal-500`}
                  />
                </div>
                <p className='w-auto text-sm'>{selected.name}</p>
              </div>
              <ChevronUpDownIcon
                className='h-5 w-5 text-gold-200 absolute right-2'
                aria-hidden='true'
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className='absolute mt-1 max-h-80 w-full overflow-auto rounded-lg bg-black-1 scrollbar-hide py-1 text-md border-[2px] border-white border-opacity-20 z-[11]'>
              {ratios.length === 0 && query !== '' ? (
                <div className='relative cursor-default select-none py-2 px-4 text-gold-200'>
                  Nothing found.
                </div>
              ) : (
                ratios.map(ratio => (
                  <Combobox.Option
                    key={ratio.name}
                    className={({ active }: { active: boolean }) =>
                      `relative cursor-default select-none py-1 text-sm pr-2 ${
                        active
                          ? 'bg-blue-1 bg-opacity-30 text-white'
                          : 'text-[white]'
                      }`
                    }
                    value={ratio}
                  >
                    {({
                      selected,
                      active
                    }: {
                      selected: boolean
                      active: boolean
                    }) => (
                      <>
                        <div
                          className={`flex content-start justify-start gap-2 pl-2 py-1 ${
                            selected ? 'text-blue-1 ' : ''
                          }`}
                        >
                          <div className='w-7 flex items-center justify-center'>
                            <div
                              className={`rounded-[2px] border-[2px] ${
                                ratio.class
                              }  ${
                                selected ? 'border-blue-1' : 'border-white'
                              } bg-gradient-to-r from-blue-1 to-teal-500`}
                            />
                          </div>
                          <p className='w-auto'>{ratio.name}</p>
                        </div>
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}
