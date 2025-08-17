'use client'

import Link from 'next/link'
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react'
import { useState } from 'react'

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false)

  const handleResendEmail = async () => {
    setIsResending(true)
    // Add resend logic here when needed
    setTimeout(() => {
      setIsResending(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-4">
              <Mail className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check your email inbox
            </h2>
            <p className="text-sm text-gray-600">
              We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
            </p>
          </div>

          {/* Instructions */}
          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">What to do next:</h3>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the verification link in the email</li>
                <li>You'll be redirected back to sign in</li>
              </ol>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {/* Resend Email Button */}
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Resend verification email
                </>
              )}
            </button>

            {/* Back to Login */}
            <Link
              href="/login"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={handleResendEmail}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                try resending it
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
