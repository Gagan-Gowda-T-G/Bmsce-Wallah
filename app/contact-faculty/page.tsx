"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const facultyList = [
  { name: "Dr. Ramya S", dept: "Computer Science", email: "ramya@bmsce.ac.in", subjects: "Data Structures, ML" },
  { name: "Dr. Kumar R", dept: "Computer Science", email: "kumar@bmsce.ac.in", subjects: "OS, Compiler Design" },
  { name: "Dr. Suresh K", dept: "Computer Science", email: "suresh@bmsce.ac.in", subjects: "Networks, Cloud" },
  { name: "Dr. Nair P", dept: "Mathematics", email: "nair@bmsce.ac.in", subjects: "Discrete Maths, TOC" },
  { name: "Dr. Priya L", dept: "Computer Science", email: "priya@bmsce.ac.in", subjects: "DBMS, AI, Security" },
  { name: "Prof. Asha M", dept: "Computer Science", email: "asha@bmsce.ac.in", subjects: "Graphics, IoT" },
  { name: "Prof. Raj T", dept: "Computer Science", email: "raj@bmsce.ac.in", subjects: "Web Tech, Blockchain" },
]

const colors = [
  "bg-orange-500",
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-pink-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-yellow-500",
]

export default function ContactFacultyPage() {
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
        <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleBack = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <nav className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={handleBack} className="text-gray-400 font-bold text-sm">
            Back
          </button>
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-sm">BW</span>
          </div>
          <span className="text-xl font-black text-gray-800">Contact Faculty</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black text-gray-800 mb-2">Faculty Directory</h1>
        <p className="text-gray-500 mb-8">Click on any email to contact directly</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {facultyList.map((item, i) => {
            const colorClass = colors[i % colors.length]
            const initial = item.name[3]
            const mailLink = "mailto:" + item.email
            return (
              <div key={item.email} className="bg-white rounded-2xl border-2 border-gray-100 p-5 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className={"w-12 h-12 rounded-xl flex items-center justify-center " + colorClass}>
                    <span className="text-white font-black text-lg">{initial}</span>
                  </div>
                  <div>
                    <p className="font-black text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.dept}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Subjects: {item.subjects}
                </p>
                <a href={mailLink} className="block bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-sm py-2 px-4 rounded-xl">
                  {item.email}
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}