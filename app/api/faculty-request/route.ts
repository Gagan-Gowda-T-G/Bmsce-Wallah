import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { sendFacultyRequestEmail } from "@/lib/mailer"

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json()

    const { data: existing } = await supabase
      .from("faculty_requests")
      .select("*")
      .eq("email", email)
      .single()

    if (!existing) {
      await supabase.from("faculty_requests").insert({ name, email, status: "pending" })
      await supabase.from("profiles").update({ role: "faculty", approved: false }).eq("email", email)
      await sendFacultyRequestEmail(name, email)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to send request" }, { status: 500 })
  }
}