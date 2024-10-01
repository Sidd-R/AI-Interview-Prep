"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Link from "next/link";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginUser } from "@/features/user";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (!email || !password) {
      toast.error("Please fill all the fields");
      return;
    }

    console.log('ss',email, password);
    


    axios.post('http://localhost:5000/login', { email, password }).then((res) => {
        localStorage.setItem("login", res.data
        );
        console.log(res.data);
        dispatch(loginUser(res.data));
        navigate.push("/dashboard");
    }).catch((err) => {
        console.log(err);
    });
  }


  return (
    <div className="antialiased">
      <BackgroundBeams />
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="images/logo-small.png"
            className="mx-auto h-20 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mt-5">
            <button
              
              className="flex w-full justify-center rounded-md bg-primary-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleSubmit}
            >
              Sign in
            </button>
          </div>

          <p className="text-center text-sm text-gray-500">
            Not a user?{" "}
            <Link
              href="/register"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              onClick={() => navigate.push("/register")}
            >
              Get Started Now!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
