import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline'

export interface SchedulerOption {
  id: string
  name: string
  value: string
}

interface SchedulerComboboxProps {
  selected: string
  setSelected: any
}

export const Schedulers = [
  {
    id: 'DDIM',
    name: 'DDIM',
    value: 'DDIM'
  },
  {
    id: 'DPMSolverMultistep',
    name: 'DPMSolverMultistep',
    value: 'DPMSolverMultistep'
  },
  {
    id: 'HeunDiscrete',
    name: 'HeunDiscrete',
    value: 'HeunDiscrete'
  },
  {
    id: 'KarrasDPM',
    name: 'KarrasDPM',
    value: 'KarrasDPM'
  },
  {
    id: 'K_EULER_ANCESTRAL',
    name: 'K_EULER_ANCESTRAL',
    value: 'K_EULER_ANCESTRAL'
  },
  {
    id: 'K_EULER',
    name: 'K_EULER',
    value: 'K_EULER'
  },
  {
    id: 'PNDM',
    name: 'PNDM',
    value: 'PNDM'
  }
]

export default function SchedulerCombobox ({
  selected,
  setSelected
}: SchedulerComboboxProps) {
  const [query, setQuery] = useState('')

  const filteredAuthor =
    query === ''
      ? Schedulers
      : Schedulers.filter(option =>
          option.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (
    <div className='w-2/3 sm:w-full mobile:w-full z-[10] text-[white]'>
      <Combobox
        value={Schedulers.find(val => {
          if (val.value === selected) {
            return val
          }
        })}
        onChange={setSelected}
      >
        <div className='relative mt-3'>
          <div className='relative w-full cursor-default overflow-hidden'>
            <Combobox.Input
              className='w-full p-2 rounded-lg outline-none bg-blue-1 bg-opacity-10 placeholder:opacity-70 border-[2px] border-white border-opacity-20 mr-2 text-sm text-left'
              displayValue={(Scheduler: SchedulerOption) => Scheduler.value}
              onChange={event => setQuery(event.target.value)}
            />
            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
              <ChevronUpDownIcon
                className='h-5 w-5 text-gold-200'
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
            <Combobox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-black-1 scrollbar-hide py-1 text-lg border-[2px] border-white border-opacity-20 z-[11]'>
              {filteredAuthor.length === 0 && query !== '' ? (
                <div className='relative cursor-default select-none py-2 px-4 text-gold-200'>
                  Nothing found.
                </div>
              ) : (
                filteredAuthor.map(Scheduler => (
                  <Combobox.Option
                    key={Scheduler.id}
                    className={({ active }: any) =>
                      `relative cursor-default select-none pl-3 py-1 pr-2 ${
                        active
                          ? 'bg-blue-1 bg-opacity-30 text-white'
                          : 'bg-bggoldlite text-[white]'
                      }`
                    }
                    value={Scheduler}
                  >
                    {({ selected, active }: any) => (
                      <>
                        <span className={`block truncate text-sm ${selected ? 'text-blue-1 ' : ''}`}>
                          {Scheduler.name}
                        </span>
                        {/* {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-gold-500'
                            }`}
                          >
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
                          </span>
                        ) : null} */}
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
