"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"

const unitsByCode: Record<string, { unit: number; title: string; files: { name: string; type: string; uploader: string; url: string }[] }[]> = {
  "CS301": [
    {
      unit: 1, title: "Introduction to Data Structures",
      files: [
        { name: "Unit 1 Notes.pdf", type: "pdf", uploader: "ramya@bmsce.ac.in", url: "#" },
        { name: "Unit 1 Slides.pptx", type: "ppt", uploader: "ramya@bmsce.ac.in", url: "#" },
      ]
    },
    {
      unit: 2, title: "Arrays and Linked Lists",
      files: [
        { name: "Unit 2 Notes.pdf", type: "pdf", uploader: "ramya@bmsce.ac.in", url: "#" },
      ]
    },
    {
      unit: 3, title: "Stacks and Queues",
      files: [
        { name: "Unit 3 Notes.pdf", type: "pdf", uploader: "ramya@bmsce.ac.in", url: "#" },
        { name: "Demo Video.mp4", type: "video", uploader: "ramya@bmsce.ac.in", url: "#" },
      ]
    },
  ],
  "CS302": [
    {
      unit: 1, title: "Introduction to OS",
      files: [
        { name: "Unit 1 Notes.pdf", type: "pdf", uploader: "kumar@bmsce.ac.in", url: "#" },
      ]
    },
    {
      unit: 2, title: "Process Management",
      files: [
        { name: "Unit 2 Notes.pdf", type: "pdf", uploader: "kumar@bmsce.ac.in", url: "#" },
        { name: "Lecture Slides.pptx", type: "ppt", uploader: "kumar@bmsce.ac.in", url: "#" },
      ]
    },
  ],
}

const typeColors: Record<string, string> = {
  pdf: "bg-red-100 text-red-600",
  ppt: "bg-orange-100 text-orange-600",
  video: "bg-green-100 text-green-600",
  doc: "bg-blue-100 text-blue-600",
}

const typeIcons: Record<string, string> = {
  pdf: "📄", ppt: "📊", video: "🎬", doc: "📝"
}

export default function CoursePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const semId = params.id
  const code = params.code as string

  const [activeUnit, setActiveUnit] = useState<number | null>(null)

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

  if (!session) return null

  const units = unitsByCode[code] || [
    { unit: 1, title: "Unit 1", files: [] },
    { unit: 2, title: "Unit 2", files: [] },
    { unit: 3, title: "Unit 3", files: [] },
    { unit: 4, title: "Unit 4", files: [] },
    { unit: 5, title: "Unit 5", files: [] },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-indigo-50">
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => router.push(`/semester/${semId}`)} className="text-gray-400 hover:text-orange-500 font-bold text-sm">
            Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">BW</span>
            </div>
            <span className="text-xl font-black text-gray-800">{code}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black text-gray-800 mb-2">{code} — Course Materials</h1>
        <p className="text-gray-500 mb-8">Click a unit to view uploaded notes and files</p>

        <div className="space-y-4">
          {units.map((unit) => (
            <div key={unit.unit} className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setActiveUnit(activeUnit === unit.unit ? null : unit.unit)}
                className="w-full flex items-center justify-between p-5 hover:bg-orange-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-black text-sm">U{unit.unit}</span>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-gray-800">Unit {unit.unit}</p>
                    <p className="text-sm text-gray-500">{unit.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400">{unit.files.length} files</span>
                  <span className="text-gray-400 text-lg">{activeUnit === unit.unit ? "▲" : "▼"}</span>
                </div>
              </button>

              {activeUnit === unit.unit && (
                <div className="border-t-2 border-gray-100 p-4">
                  {unit.files.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-4xl mb-2">📭</p>
                      <p className="text-gray-400 font-semibold">No files uploaded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {unit.files.map((file, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group">
                          <span className="text-2xl">{typeIcons[file.type] || "📁"}</span>
                          <div className="flex-1">
                            <p className="font-bold text-gray-800 text-sm">{file.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Uploaded by: {file.uploader}</p>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${typeColors[file.type] || "bg-gray-100 text-gray-600"}`}>
                            {file.type.toUpperCase()}
                          </span>
                          <a href={file.url} className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}