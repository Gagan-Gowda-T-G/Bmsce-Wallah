"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const firstName = session.user?.name?.split(" ")[0] || "Student"

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-indigo-50">

      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow">
              <span className="text-white font-black text-sm">BW</span>
            </div>
            <span className="text-xl font-black text-gray-800">BMSCE Wallah</span>
          </div>
          <div className="flex items-center gap-4">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-9 h-9 rounded-full border-2 border-orange-300"
              />
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="bg-white rounded-3xl border border-orange-100 shadow-lg p-8 mb-8 flex items-center gap-6">
          {session.user?.image && (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-20 h-20 rounded-2xl border-4 border-orange-200 shadow"
            />
          )}
          <div>
            <p className="text-orange-500 font-bold text-sm uppercase tracking-wider mb-1">Welcome back 👋</p>
            <h1 className="text-3xl font-black text-gray-800">Hey, {firstName}!</h1>
            <p className="text-gray-500 mt-1 font-medium">
              Welcome to <span className="text-orange-500 font-bold">BMSCE EDx</span>
            </p>
            <p className="text-gray-400 text-sm mt-1">{session.user?.email}</p>
          </div>
        </div>

        <h2 className="text-xl font-black text-gray-700 mb-4">📚 Select Your Semester</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4,5,6,7,8].map((sem) => (
            <button
              key={sem}
              onClick={() => router.push(`/semester/${sem}`)}
              className="bg-white hover:bg-orange-500 hover:text-white border-2 border-gray-200 hover:border-orange-500 rounded-2xl p-5 text-center font-black text-gray-700 text-lg transition-all duration-200 shadow-sm hover:shadow-lg group"
            >
              <div className="text-2xl mb-1">📖</div>
              Sem {sem}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => router.push("/question-papers")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl p-6 text-left shadow-lg transition-all"
          >
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-black text-lg">Question Papers</h3>
            <p className="text-indigo-200 text-sm mt-1">CIE and End Semester papers</p>
          </button>

          <button
            onClick={() => router.push("/contact-faculty")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl p-6 text-left shadow-lg transition-all"
          >
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-black text-lg">Contact Faculty</h3>
            <p className="text-emerald-100 text-sm mt-1">Reach out to your professors</p>
          </button>

          <button
            onClick={() => router.push("/faculty-portal")}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl p-6 text-left shadow-lg transition-all"
          >
            <div className="text-3xl mb-3">👨‍🏫</div>
            <h3 className="font-black text-lg">Faculty Portal</h3>
            <p className="text-orange-100 text-sm mt-1">Upload and manage materials</p>
          </button>
        </div>
      </div>
    </div>
  )
}