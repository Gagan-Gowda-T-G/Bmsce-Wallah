"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function FacultyPendingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  const sendRequest = async () => {
    if (!session?.user?.email) return
    setSending(true)
    try {
      await fetch("/api/faculty-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session.user.name,
          email: session.user.email,
        }),
      })
      setSent(true)
    } catch (e) {
      console.error(e)
    }
    setSending(false)
  }

  useEffect(() => {
    if (session?.user?.email) sendRequest()
  }, [session])

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
            <span className="text-4xl">{sending ? "📤" : "⏳"}</span>
          </div>
          <h1 className="text-2xl font-black text-gray-800 mb-2">
            {sending ? "Sending Request..." : "Approval Pending"}
          </h1>
          <p className="text-gray-500 mb-4">
            Your faculty request has been sent to the admin.
          </p>
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-4">
            <p className="text-indigo-700 text-sm font-semibold">📧 Logged in as:</p>
            <p className="text-indigo-500 text-sm mt-1">{session?.user?.email}</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
            <p className="text-orange-700 text-sm font-semibold">
              ✅ Admin has been notified via email.
            </p>
            <p className="text-orange-500 text-xs mt-1">
              You will receive an approval email soon.
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