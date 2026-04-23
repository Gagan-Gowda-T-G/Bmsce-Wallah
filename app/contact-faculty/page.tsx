"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const faculty = [
  { name: "Dr. Ramya S", dept: "Computer Science", email: "ramya@bmsce.ac.in", subjects: "Data Structures, ML" },
  { name: "Dr. Kumar R", dept: "Computer Science", email: "kumar@bmsce.ac.in", subjects: "OS, Compiler Design" },
  { name: "Dr. Suresh K", dept: "Computer Science", email: "suresh@bmsce.ac.in", subjects: "Networks, Cloud" },
  { name: "Dr. Nair P", dept: "Mathematics", email: "nair@bmsce.ac.in", subjects: "Discrete Maths, TOC" },
  { name: "Dr. Priya L", dept: "Computer Science", email: "priya@bmsce.ac.in", subjects: "DBMS, AI, Security" },
  { name: "Prof. Asha M", dept: "Computer Science", email: "asha@bmsce.ac.in", subjects: "Graphics, IoT" },
  { name: "Prof. Raj T", dept: "Computer Science", email: "raj@bmsce.ac.in", subjects: "Web Tech, Blockchain" },
]

const avatarColors = ["bg-orange-500","bg-indigo-500","bg-emerald-500","bg-pink-500","bg-blue-500","bg-purple-500","bg-yellow-500"]

export default function ContactFacultyPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-indigo-50">
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => router.push("/")} className="text-gray-400 hover:text-orange-500 font-bold text-sm">← Back</button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">BW</span>
            </div>
            <span className="text-xl font-black text-gray-800">Contact Faculty</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black text-gray-800 mb-2">Faculty Directory</h1>
        <p className="text-gray-500 mb-8">Click on any email to send a message directly</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {faculty.map((f, i) => (
            <div key={f.email} className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 ${avatarColors[i % avatarColors.length]} rounded-xl flex items-center justify-center`}>
                  <span className="text-white font-black">{f.name.split(" ")[1]?.[0] || "F"}</span>
                </div>
                <div>
                  <p className="font-black text-gray-800">{f.name}</p>
                  <p className="text-xs text-gray-400 font-semibold">{f.dept}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                <span className="font-bold">Subjects: </span>{f.subjects}
              </p>
              
                href={`mailto:${f.email}`}
                className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-sm py-2 px-4 rounded-xl transition-all"
              >
                <span>✉️</span>
                <span>{f.email}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}