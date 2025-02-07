import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../../Images/logo.svg';
import userIcon from '../../../Images/user.svg';
import wishlist from '../../../Images/heart.svg';
import cart from '../../../Images/cart.svg';

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const Header=()=>{
  const [open, setOpen] = useState(false)
return(
    <>
    <header className='mb-0'>
      
    <Dialog open={open} onClose={setOpen} className="relative z-10">
  <DialogBackdrop
    transition
    className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
  />

  <div className="fixed inset-0 overflow-hidden">
    <div className="absolute inset-0 overflow-hidden">
      <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
        <DialogPanel
          transition
          className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:-translate-x-full sm:duration-700"
        >
          <TransitionChild>
            <div className="absolute top-0 right-0 -mr-8 flex pt-4 pl-2 duration-500 ease-in-out data-closed:opacity-0 sm:-mr-10 sm:pl-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative rounded-md text-gray-300 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden"
              >
                <span className="absolute -inset-2.5" />
                <span className="sr-only">Close panel</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
          </TransitionChild>
          <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
            <div className="px-4 sm:px-6">
              <DialogTitle className="text-base font-semibold text-gray-900">Panel title</DialogTitle>
            </div>
            <div className="relative mt-6 flex-1 px-4 sm:px-6">{/* Your content */}</div>
          </div>
        </DialogPanel>
      </div>
    </div>
  </div>
</Dialog>





    <div className="px-8 py-4  flex w-full  mx-auto justify-between">
        <div className='flex gap-8'>
          <button onClick={() => setOpen(true)}> <img src="https://cdn-icons-png.flaticon.com/512/7175/7175356.png" className='h-8 w-8' alt="" /></button>
        <div className="logo-img">
              <Link href="/">
                <Image src={logo} className=" h-20" alt="UniBooker" />

              </Link>
            </div>
        </div>
        
        <div className="px- py-5">
            <ul className='flex gap-3 font-sans
            '>
            <li> <a href=""><div className=' p-4 text-sm'>Investor Relations</div></a> </li>
          <li> <a href=""><div className='border border-gray-300 rounded-3xl font-normal p-4 text-sm'>Become a Host</div></a> </li>
          <li> <a href=""><div className='border border-gray-300 rounded-3xl p-4 text-sm flex'>Get the App <img src="https://www.zoomcar.com/img/hompage-rebrand/app-download-icon.png" className='h-5'  alt="" /> </div></a> </li>
          <li> <a className='' href=""><div className='border border-gray-300 rounded-3xl p-4 text-sm '>Login  </div></a> </li>

            </ul>
            </div>
    </div>


    </header>
    </>
)


}
export default Header;
