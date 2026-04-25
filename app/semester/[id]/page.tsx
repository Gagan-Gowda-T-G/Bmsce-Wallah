// @ts-nocheck
"use client"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status === "authenticated") {
      setReady(true)
    }
  }, [status, router])

  if (!ready || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const firstName = session.user?.name?.split(" ")[0] || "Student"

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-indigo-50">
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">BW</span>
            </div>
            <span className="text-xl font-black text-gray-800">BMSCE Wallah</span>
          </div>
          <div className="flex items-center gap-4">
            {session.user?.image && (
              <img src={session.user.image} alt="Profile" className="w-9 h-9 rounded-full border-2 border-orange-300" />
            )}
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-sm font-bold text-gray-500 hover:text-red-500">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl border border-orange-100 shadow-lg p-8 mb-8 flex items-center gap-6">
          {session.user?.image && (
            <img src={session.user.image} alt="Profile" className="w-20 h-20 rounded-2xl border