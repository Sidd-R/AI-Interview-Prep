"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  return (
    <div className="flex fixed top-0 z-10 sm:z-0 sm:relative justify-between px-4 py-4 sm:mt-0 sm:px-24 sm:py-5 bg-white navbar items-center w-[100%]">
      <div className="flex items-center">
        <button onClick={() => setOpen(true)} className="block sm:hidden">
          <Bars3Icon aria-hidden="true" className="h-5 w-5 mr-2" />
        </button>
        <img src="/images/logo.png" alt="Logo" className="h-10 sm:h-16 " />
      </div>
      <div className="flex gap-6 items-center">
        <div className="gap-6 items-center hidden sm:flex">
          <Link href="/" className={pathname === "/" ? "selected" : ""}>
            Home
          </Link>
          <Link
            href="/about"
            className={pathname === "/about" ? "selected" : ""}
          >
            About Us
          </Link>
          <Link
            href="/services"
            className={pathname === "/services" ? "selected" : ""}
          >
            Services
          </Link>
        </div>
        <Link type="button" href={"/login"} className="px-3 py-2 text-sm sm:px-6 sm:py-4 text-white bg-primary-500 ml-8 hover:text-white">
          Get Started
        </Link>
      </div>
      <Dialog open={open} onClose={setOpen} className="relative z-[3000]">
        <Transition
          show={open}
          as="div"
          enter="transition ease-in-out duration-300 transform"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 backdrop-brightness-50">
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
                <DialogPanel className="pointer-events-auto w-52">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-6 sm:px-6">
                      <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                        <img
                          src="/images/logo.png"
                          alt="Logo"
                          className="h-10 sm:h-16"
                        />
                      </DialogTitle>
                    </div>
                    <div className="relative mt-6 flex-1 gap-2">
                      <Link
                        href="/"
                        onClick={() => setOpen(false)}
                        className={`block py-2 text-md px-6 ${
                          pathname === "/" ? "selected" : ""
                        }`}
                      >
                        Home
                      </Link>
                      <Link
                        href="/about"
                        onClick={() => setOpen(false)}
                        className={`block py-2 text-md px-6 ${
                          pathname === "/about" ? "selected" : ""
                        }`}
                      >
                        About Us
                      </Link>
                      <Link
                        href="/services"
                        onClick={() => setOpen(false)}
                        className={`block py-2 text-md px-6 ${
                          pathname === "/services" ? "selected" : ""
                        }`}
                      >
                        Services
                      </Link>
                      <Link
                        href="tel:01140847315"
                        onClick={() => setOpen(false)}
                        className={`block py-2 text-md px-6 text-primary-500 font-extrabold underline ${
                          pathname === "/contact" ? "selected" : ""
                        }`}
                      >
                        01140847315
                      </Link>
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </div>
        </Transition>
      </Dialog>
    </div>
  );
};

export default Navbar;