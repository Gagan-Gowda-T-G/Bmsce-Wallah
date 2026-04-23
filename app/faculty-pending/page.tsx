"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function FacultyPendingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-orange-50">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⏳</span>
          </div>
          <h1 className="text-2xl font-black text-gray-800 mb-2">Approval Pending</h1>
          <p className="text-gray-500 mb-4">
            Your faculty account request has been sent to the admin.
          </p>
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-6">
            <p className="text-indigo-700 text-sm font-semibold">
              📧 Logged in as:
            </p>
            <p className="text-indigo-500 text-sm mt-1">{session?.user?.email}</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
            <p className="text-orange-700 text-sm font-semibold">
              You will receive an email once admin approves your account.
            </p>
            <p className="text-orange-500 text-xs mt-1">
              This usually takes a few hours.
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-2xl transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}