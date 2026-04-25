// @ts-nocheck
"use client"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect } from "react"

const coursesBySemester = {
  1: [
    { code: "MA101", name: "Engineering Mathematics I", faculty: "Dr. Ramya S", email: "ramya@bmsce.ac.in" },
    { code: "PH102", name: "Engineering Physics", faculty: "Dr. Suresh K", email: "suresh@bmsce.ac.in" },
    { code: "CS103", name: "Programming in C", faculty: "Dr. Nair P", email: "nair@bmsce.ac.in" },
    { code: "CV104", name: "Engineering Graphics", faculty: "Prof. Asha M", email: "asha@bmsce.ac.in" },
  ],
  2: [
    { code: "MA201", name: "Engineering Mathematics II", faculty: "Dr. Ramya S", email: "ramya@bmsce.ac.in" },
    { code: "CH202", name: "Engineering Chemistry", faculty: "Dr. Kumar R", email: "kumar@bmsce.ac.in" },
    { code: "ME203", name: "Elements of Mechanical Eng", faculty: "Prof. Raj T", email: "raj@bmsce.ac.in" },
    { code: "EE204", name: "Basic Electrical Engineering", faculty: "Dr. Priya L", email: "priya@bmsce.ac.in" },
  ],
  3: [
    { code: "CS301", name: "Data Structures", faculty: "Dr. Ramya S", email: "ramya@bmsce.ac.in" },
    { code: "CS302", name: "Operating Systems", faculty: "Dr. Kumar R", email: "kumar@bmsce.ac.in" },
    { code: "MA301", name: "Discrete Mathematics", faculty: "Dr. Nair P", email: "nair@bmsce.ac.in" },
    { code: "CS304", name: "Digital Electronics", faculty: "Prof. Asha M", email: "asha@bmsce.ac.in" },
  ],
  4: [
    { code: "CS401", name: "Computer Networks", faculty: "Dr. Suresh K", email: "suresh@bmsce.ac.in" },
    { code: "CS402", name: "Database Management", faculty: "Dr. Priya L", email: "priya@bmsce.ac.in" },
    { code: "CS403", name: "Design and Analysis of Algorithms", faculty: "Dr. Ramya S", email: "ramya@bmsce.ac.in" },
    { code: "CS404", name: "Microprocessors", faculty: "Prof. Raj T", email: "raj@bmsce.ac.in" },
  ],
  5: [
    { code: "CS501", name: "Software Engineering", faculty: "Dr. Kumar R", email: "kumar@bmsce.ac.in" },
    { code: "CS502", name: "Compiler Design", faculty: "Dr. Nair P", email: "nair@bmsce.ac.in" },
    { code: "CS503", name: "Computer Graphics", faculty: "Prof. Asha M", email: "asha@bmsce.ac.in" },
    { code: "CS504", name: "Theory of Computation", faculty: "Dr. Suresh K", email: "suresh@bmsce.ac.in" },
  ],
  6: [
    { code: "CS601", name: "Artificial Intelligence", faculty: "Dr. Priya L", email: "priya@bmsce.ac.in" },
    { code: "CS602", name: "Machine Learning", faculty: "Dr. Ramya S", email: "ramya@bmsce.ac.in" },
    { code: "CS603", name: "Web Technologies", faculty: "Prof. Raj T", email: "raj@bmsce.ac.in" },
    { code: "CS604", name: "Information Security", faculty: "Dr. Kumar R", email: "kumar@bmsce.ac.in" },
  ],
  7: [
    { code: "CS701", name: "Cloud Computing", faculty: "Dr. Suresh K", email: "suresh@bmsce.ac.in" },
    { code: "CS702", name: "Big Data Analytics", faculty: "Dr. Nair P", email: "nair@bmsce.ac.in" },
    { code: "CS703", name: "Internet of Things", faculty: "Dr. Priya L", email: "priya@bmsce.ac.in" },
    { code: "CS704", name: "Blockchain Technology", faculty: "Prof. Asha M", email: "asha@bmsce.ac.in" },
  ],
  8: [
    { code: "CS801", name: "Project Work", faculty: "Dr. Ramya S", email: "ramya@bmsce.ac.in" },
    { code: "CS802", name: "Seminar", faculty: "Dr. Kumar R", email: "kumar@bmsce.ac.in" },
    { code: "CS803", name: "Internship", faculty: "Prof. Raj T", email: "raj@bmsce.ac.in" },
  ],
}

const colors = ["bg-orange-500","bg-indigo-600","bg-emerald-500","bg-pink-500","bg-blue-500","bg-purple-500"]

export default function SemesterPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const semId = Number(params.id)

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

  if (!session) return null

  const courses = coursesBySemester[semId] || []

  const handleBack = () => {
    router.push("/")
  }

  const handleCourse = (code) => {
    router.push("/semester/" + semId + "/course/" + code)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-indigo-50">
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={handleBack} className="text-gray-400 hover:text-orange-500 font-bold text-sm">
            Back
          </button>
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-sm">BW</span>
          </div>
          <span className="text-xl font-black text-gray-800">Semester {semId}</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black text-gray-800 mb-2">Semester {semId} Courses</h1>
        <p className="text-gray-500 mt-1 mb-8">Select a course to view notes and materials</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {courses.map((course, i) => {
            const colorClass = colors[i % colors.length]
            return (
              <button
                key={course.code}
                onClick={() => handleCourse(course.code)}
                className="bg-white border-2 border-gray-100 hover:border-orange-300 rounded-2xl p-6 text-left shadow-sm hover:shadow-lg transition-all"
              >
                <div className={"inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 " + colorClass}>
                  <span className="text-white font-black text-sm">{course.code.slice(0,2)}</span>
                </div>
                <h3 className="font-black text-gray-800 text-lg">{course.name}</h3>
                <p className="text-gray-400 text-sm mt-1 font-semibold">{course.code}</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-black text-indigo-600">{course.faculty[3]}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-600">{course.faculty}</p>
                    <p className="text-xs text-gray-400">{course.email}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}