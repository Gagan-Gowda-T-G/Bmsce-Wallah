// @ts-nocheck
"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function FacultyPortalPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [approved, setApproved] = useState(false)
  const [checking, setChecking] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedSem, setSelectedSem] = useState("")
  const [courseName, setCourseName] = useState("")
  const [courseCode, setCourseCode] = useState("")
  const [unitNum, setUnitNum] = useState("")
  const [unitTitle, setUnitTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [myFiles, setMyFiles] = useState<any[]>([])
  const [msg, setMsg] = useState("")
  const [activeTab, setActiveTab] = useState("notes")
  const [paperType, setPaperType] = useState("")
  const [paperYear, setPaperYear] = useState("")
  const [paperSubject, setPaperSubject] = useState("")
  const [paperFile, setPaperFile] = useState<File | null>(null)
  const [myPapers, setMyPapers] = useState<any[]>([])

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (session?.user?.email) checkApproval()
  }, [session])

  const checkApproval = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", session?.user?.email)
      .single()
    setApproved(data?.approved === true && data?.role === "faculty")
    setChecking(false)
    if (data?.approved) loadMyFiles()
  }

  const loadMyFiles = async () => {
    const { data } = await supabase
      .from("files")
      .select("*")
      .eq("uploader_email", session?.user?.email)
      .order("created_at", { ascending: false })
    setMyFiles(data || [])

    const { data: papers } = await supabase
      .from("question_papers")
      .select("*")
      .eq("uploader_email", session?.user?.email)
      .order("created_at", { ascending: false })
    setMyPapers(papers || [])
  }

  const handleUploadNotes = async () => {
    if (!file || !selectedSem || !courseName || !courseCode || !unitNum || !unitTitle) {
      setMsg("❌ Please fill all fields and select a file")
      return
    }
    setUploading(true)
    setMsg("")
    try {
      let { data: semData } = await supabase.from("semesters").select("id").eq("number", parseInt(selectedSem)).single()
      if (!semData) {
        const { data: newSem } = await supabase.from("semesters").insert({ number: parseInt(selectedSem) }).select().single()
        semData = newSem
      }
      let { data: courseData } = await supabase.from("courses").select("id").eq("code", courseCode).single()
      if (!courseData) {
  const { data: newCourse } = await supabase.from("courses").insert({
    semester_id: semData?.id ?? 0, code: courseCode, name: courseName,
    faculty_name: session?.user?.name, faculty_email: session?.user?.email,
  }).select().single()
  courseData = newCourse
}
      let { data: unitData } = await supabase.from("units").select("id").eq("course_id", courseData.id).eq("number", parseInt(unitNum)).single()
      if (!unitData) {
        const { data: newUnit } = await supabase.from("units").insert({
          course_id: courseData.id, number: parseInt(unitNum), title: unitTitle,
        }).select().single()
        unitData = newUnit
      }
      const formData = new FormData()
      formData.append("file", file)
      formData.append("unitId", unitData.id.toString())
      formData.append("uploaderEmail", session?.user?.email || "")
      formData.append("uploaderName", session?.user?.name || "")
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const result = await res.json()
      if (result.success) {
        setMsg("✅ File uploaded successfully!")
        setFile(null)
        loadMyFiles()
      } else {
        setMsg("❌ Upload failed. Try again.")
      }
    } catch (e) {
      console.error(e)
      setMsg("❌ Something went wrong.")
    }
    setUploading(false)
  }

  const handleUploadPaper = async () => {
    if (!paperFile || !paperType || !paperYear || !paperSubject || !selectedSem) {
      setMsg("❌ Fill all fields for question paper")
      return
    }
    setUploading(true)
    setMsg("")
    try {
      const fileExt = paperFile.name.split(".").pop()
      const filePath = `papers/${Date.now()}.${fileExt}`
      const arrayBuffer = await paperFile.arrayBuffer()
      const { error } = await supabase.storage.from("files").upload(filePath, Buffer.from(arrayBuffer), { contentType: paperFile.type })
      if (error) throw error
      const { data: urlData } = supabase.storage.from("files").getPublicUrl(filePath)
      await supabase.from("question_papers").insert({
        subject: paperSubject, course_code: courseCode, semester: parseInt(selectedSem),
        year: paperYear, paper_type: paperType, url: urlData.publicUrl,
        uploader_email: session?.user?.email, uploader_name: session?.user?.name,
      })
      setMsg("✅ Question paper uploaded!")
      setPaperFile(null)
      loadMyFiles()
    } catch (e) {
      console.error(e)
      setMsg("❌ Upload failed.")
    }
    setUploading(false)
  }

  const deleteFile = async (id: number, url: string) => {
    await supabase.from("files").delete().eq("id", id)
    setMyFiles(prev => prev.filter(f => f.id !== id))
  }

  const deletePaper = async (id: number) => {
    await supabase.from("question_papers").delete().eq("id", id)
    setMyPapers(prev => prev.filter(p => p.id !== id))
  }

  if (status === "loading" || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!approved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="max-w-md w-full mx-4 bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-black text-gray-800 mb-2">Access Restricted</h1>
          <p className="text-gray-500 mb-2">Your account needs admin approval.</p>
          <p className="text-indigo-500 text-sm font-bold mb-6">{session?.user?.email}</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
            <p className="text-yellow-700 text-sm font-semibold">⏳ Admin approval pending. Check your email.</p>
          </div>
          <button onClick={() => router.push("/")} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl">Go to Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-indigo-50">
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/")} className="text-gray-400 hover:text-orange-500 font-bold text-sm">Back</button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-sm">BW</span>
              </div>
              <span className="text-xl font-black text-gray-800">Faculty Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {session?.user?.image && <img src={session.user.image} alt="" className="w-9 h-9 rounded-full border-2 border-orange-300" />}
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-gray-700">{session?.user?.name}</p>
              <p className="text-xs text-gray-400">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex gap-3 mb-6">
          <button onClick={() => setActiveTab("notes")} className={`px-5 py-2 rounded-full font-black text-sm transition-all ${activeTab === "notes" ? "bg-orange-500 text-white" : "bg-white border-2 border-gray-200 text-gray-600"}`}>📚 Upload Notes</button>
          <button onClick={() => setActiveTab("papers")} className={`px-5 py-2 rounded-full font-black text-sm transition-all ${activeTab === "papers" ? "bg-indigo-600 text-white" : "bg-white border-2 border-gray-200 text-gray-600"}`}>📝 Upload Papers</button>
          <button onClick={() => setActiveTab("myfiles")} className={`px-5 py-2 rounded-full font-black text-sm transition-all ${activeTab === "myfiles" ? "bg-emerald-500 text-white" : "bg-white border-2 border-gray-200 text-gray-600"}`}>🗂 My Uploads</button>
        </div>

        {msg && (
          <div className={`rounded-2xl p-4 mb-4 text-sm font-bold text-center ${msg.startsWith("✅") ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {msg}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="bg-white rounded-3xl border border-orange-100 shadow-lg p-6">
            <h2 className="font-black text-gray-800 text-lg mb-6">Upload Course Notes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase">Semester</label>
                <select value={selectedSem} onChange={e => setSelectedSem(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-orange-400 bg-white">
                  <option value="">Select Semester</option>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase">Course Code</label>
                <input value={courseCode} onChange={e => setCourseCode(e.target.value)} placeholder="e.g. CS301" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase">Course Name</label>
                <input value={courseName} onChange={e => setCourseName(e.target.value)} placeholder="e.g. Data Structures" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase">Unit Number</label>
                <select value={unitNum} onChange={e => setUnitNum(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-orange-400 bg-white">
                  <option value="">Select Unit</option>
                  {[1,2,3,4,5].map(u => <option key={u} value={u}>Unit {u}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase">Unit Title</label>
                <input value={unitTitle} onChange={e => setUnitTitle(e.target.value)} placeholder="e.g. Arrays and Linked Lists" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-orange-400" />
              </div>
            </div>
            <label className="block border-2 border-dashed border-orange-200 rounded-2xl p-8 text-center bg-orange-50 mb-4 cursor-pointer hover:bg-orange-100 transition-all">
              <div className="text-4xl mb-2">📤</div>
              <p className="font-black text-orange-600">{file ? file.name : "Click to select file"}</p>
              <p className="text-orange-400 text-xs mt-1">PDF, PPTX, DOCX, MP4 • Max 50MB</p>
              <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} accept=".pdf,.pptx,.docx,.mp4,.doc" />
            </label>
            <button onClick={handleUploadNotes} disabled={uploading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-black py-4 rounded-2xl transition-all text-lg">
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        )}

        {activeTab === "papers" && (
          <div className="bg-white rounded-3xl border border-indigo-100 shadow-lg p-6">
            <h2 className="font-black text-gray-800 text-lg mb-6">Upload Question Papers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase">Semester</label>
                <select value={selectedSem} onChange={e => setSelectedSem(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-400 bg-white">
                  <option value="">Select Semester</option>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase">Paper Type</label>
                <select value={paperType} onChange={e => setPaperType(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-400 bg-white">
                  <option value="">Select Type</option>
                  <option value="CIE1">CIE 1</option>
                  <option value="CIE2">CIE 2</option>
                  <option value="CIE3">CIE 3</option>
                  <option value="EndSem">End Semester</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase">Subject</label>
                <input value={paperSubject} onChange={e => setPaperSubject(e.target.value)} placeholder="e.g. CS301 - Data Structures" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase">Year</label>
                <select value={paperYear} onChange={e => setPaperYear(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-400 bg-white">
                  <option value="">Select Year</option>
                  {["2024","2023","2022","2021","2020","2019"].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <label className="block border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center bg-indigo-50 mb-4 cursor-pointer hover:bg-indigo-100 transition-all">
              <div className="text-4xl mb-2">📝</div>
              <p className="font-black text-indigo-600">{paperFile ? paperFile.name : "Click to select question paper"}</p>
              <p className="text-indigo-400 text-xs mt-1">PDF only recommended</p>
              <input type="file" className="hidden" onChange={e => setPaperFile(e.target.files?.[0] || null)} accept=".pdf" />
            </label>
            <button onClick={handleUploadPaper} disabled={uploading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-black py-4 rounded-2xl transition-all text-lg">
              {uploading ? "Uploading..." : "Upload Question Paper"}
            </button>
          </div>
        )}

        {activeTab === "myfiles" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
              <div className="p-5 border-b-2 border-gray-100">
                <h2 className="font-black text-gray-800">My Notes ({myFiles.length})</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {myFiles.length === 0 && <p className="text-center text-gray-400 py-8">No files uploaded yet</p>}
                {myFiles.map((f) => (
                  <div key={f.id} className="flex items-center gap-4 p-4">
                    <span className="text-2xl">📄</span>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm">{f.name}</p>
                      <p className="text-xs text-gray-400">{f.uploader_email}</p>
                    </div>
                    <a href={f.url} target="_blank" className="bg-orange-50 text-orange-600 font-bold text-xs px-3 py-2 rounded-xl border border-orange-200">View</a>
                    <button onClick={() => deleteFile(f.id, f.url)} className="bg-red-50 text-red-500 font-bold text-xs px-3 py-2 rounded-xl border border-red-200">Delete</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
              <div className="p-5 border-b-2 border-gray-100">
                <h2 className="font-black text-gray-800">My Question Papers ({myPapers.length})</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {myPapers.length === 0 && <p className="text-center text-gray-400 py-8">No papers uploaded yet</p>}
                {myPapers.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-4">
                    <span className="text-2xl">📝</span>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm">{p.subject}</p>
                      <p className="text-xs text-gray-400">{p.paper_type} • {p.year}</p>
                    </div>
                    <a href={p.url} target="_blank" className="bg-indigo-50 text-indigo-600 font-bold text-xs px-3 py-2 rounded-xl border border-indigo-200">View</a>
                    <button onClick={() => deletePaper(p.id)} className="bg-red-50 text-red-500 font-bold text-xs px-3 py-2 rounded-xl border border-red-200">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}