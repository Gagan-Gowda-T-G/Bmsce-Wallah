// @ts-nocheck
"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Paper = { id: number; subject: string; year: string; paper_type: string; url: string; uploader_email: string }
type TabKey = "CIE1" | "CIE2" | "CIE3" | "EndSem"

export default function QuestionPapersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabKey>("CIE1")
  const [papers, setPapers] = useState<Paper[]>([])
  const [loading, setLoading] = useState(true)
  const [aiQuery, setAiQuery] = useState("")
  const [aiAnswer, setAiAnswer] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    loadPapers()
  }, [activeTab])

  const loadPapers = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("question_papers")
      .select("*")
      .eq("paper_type", activeTab)
      .order("created_at", { ascending: false })
    setPapers(data || [])
    setLoading(false)
  }

  const handleAsk = async () => {
    if (!aiQuery.trim()) return
    setAiLoading(true)
    setAiAnswer("")
    setTimeout(() => {
      setAiAnswer(`AI answer for: "${aiQuery}"\n\nTo enable real AI, add OPENAI_API_KEY to .env.local and connect the /api/ai route.`)
      setAiLoading(false)
    }, 1200)
  }

  const tabs: TabKey[] = ["CIE1", "CIE2", "CIE3", "EndSem"]
  const tabColors: Record<TabKey, string> = {
    CIE1: "bg-orange-500", CIE2: "bg-indigo-600", CIE3: "bg-emerald-500", EndSem: "bg-red-500"
  }

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-indigo-50">
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => router.push("/")} className="text-gray-400 hover:text-orange-500 font-bold text-sm">Back</button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">BW</span>
            </div>
            <span className="text-xl font-black text-gray-800">Question Papers</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black text-gray-800 mb-2">Question Papers</h1>
        <p className="text-gray-500 mb-6">CIE and End Semester papers uploaded by faculty</p>

        <div className="flex gap-3 mb-6 flex-wrap">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full font-black text-sm transition-all ${activeTab === tab ? `${tabColors[tab]} text-white shadow-lg` : "bg-white border-2 border-gray-200 text-gray-600"}`}>
              {tab === "EndSem" ? "End Semester" : tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : papers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-100">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-400 font-semibold">No papers uploaded yet for {activeTab}</p>
            <p className="text-gray-300 text-sm mt-1">Faculty can upload from the Faculty Portal</p>
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {papers.map(paper => (
              <div key={paper.id} className="bg-white rounded-2xl border-2 border-gray-100 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                <span className="text-3xl">📝</span>
                <div className="flex-1">
                  <p className="font-black text-gray-800">{paper.subject}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Year: {paper.year}</p>
                  <p className="text-xs text-indigo-400">{paper.uploader_email}</p>
                </div>
                <a href={paper.url} target="_blank" className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                  Download
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl border-2 border-indigo-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🤖</span>
            <div>
              <h2 className="font-black text-gray-800">AI Study Helper</h2>
              <p className="text-xs text-gray-400">Ask questions about these papers</p>
            </div>
          </div>
          <div className="flex gap-3">
            <input type="text" value={aiQuery} onChange={e => setAiQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAsk()}
              placeholder="Ask anything about this subject..."
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:border-indigo-400" />
            <button onClick={handleAsk} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl">Ask</button>
          </div>
          {aiLoading && <div className="mt-4 flex items-center gap-2"><div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div><p className="text-sm text-gray-500">Thinking...</p></div>}
          {aiAnswer && <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4"><p className="text-sm text-indigo-800 whitespace-pre-line font-medium">{aiAnswer}</p></div>}
        </div>
      </div>
    </div>
  )
}