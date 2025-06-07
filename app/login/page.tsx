import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#e0e7ff] py-12 px-4">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="rounded-3xl shadow-xl border-0 bg-white p-8 flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-center mb-2">
              Sign in
            </h2>
            <p className="text-gray-500 text-center text-sm">
              Access your SEO Scanner space
            </p>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:text-primary/90"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
