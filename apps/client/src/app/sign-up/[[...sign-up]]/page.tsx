"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { ShoppingBag, ShoppingBasketIcon } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen mt-6 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-3">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
          </div> */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Join NepCart
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Create an account and start shopping today
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-8 grid grid-cols-3 gap-3 text-center">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-lg font-semibold text-blue-600">⚡</p>
            <p className="text-xs text-slate-600 mt-1">Fast Checkout</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-lg font-semibold text-blue-600">📦</p>
            <p className="text-xs text-slate-600 mt-1">Ease Shipping</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-lg font-semibold text-blue-600">
              <ShoppingBasketIcon className="w-4 h-4 inline" />
            </p>
            <p className="text-xs text-slate-600 mt-1">Exclusive Offers</p>
          </div>
        </div>

        {/* Clerk SignUp Component */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none",
                formButtonPrimary:
                  "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 rounded-lg transition-all duration-200",
                formFieldInput:
                  "border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                footerActionLink:
                  "text-blue-600 hover:text-blue-700 font-medium",
                dividerLine: "bg-slate-200",
                dividerText: "text-slate-600",
              },
            }}
            redirectUrl="/"
          />
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <p className="text-slate-600 text-sm">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Terms Note */}
        <div className="mt-8 bg-slate-100 border border-slate-300 rounded-lg p-4">
          <p className="text-xs text-slate-700 text-center">
            By creating an account, you agree to our{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
