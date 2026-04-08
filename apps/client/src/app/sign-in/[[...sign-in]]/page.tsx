"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen  mt-6 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-3">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
          </div> */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            NepCart
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Clerk SignIn Component */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <SignIn
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
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-900 text-center">
            🔒 Your information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
