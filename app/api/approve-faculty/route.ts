import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import nodemailer from "nodemailer"

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")
  if (!email) return NextResponse.json({ error: "No email" }, { status: 400 })

  await supabase.from("profiles").update({ role: "faculty", approved: true }).eq("email", email)
  await supabase.from("faculty_requests").update({ status: "approved" }).eq("email", email)

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  })

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: "BMSCE Wallah — Faculty Access Approved!",
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#fff;border-radius:16px">
        <div style="background:#10b981;color:white;padding:16px 24px;border-radius:12px;margin-bottom:24px">
          <h2 style="margin:0">✅ Faculty Access Approved!</h2>
        </div>
        <p style="color:#374151;font-size:16px">
          Your faculty account on <strong>BMSCE Wallah</strong> has been approved by the admin.
        </p>
        <p style="color:#374151">You can now log in and upload notes, files, and question papers.</p>
        <a href="${process.env.NEXTAUTH_URL}/login" style="display:inline-block;background:#f97316;color:white;padding:12px 28px;border-radius:12px;text-decoration:none;font-weight:bold;margin-top:16px">
          Login to BMSCE Wallah
        </a>
      </div>
    `,
  })

  return new NextResponse(`
    <html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;background:#f0fdf4">
      <div style="text-align:center;background:white;padding:40px;border-radius:20px;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
        <div style="font-size:60px;margin-bottom:16px">✅</div>
        <h1 style="color:#065f46;margin:0">Faculty Approved!</h1>
        <p style="color:#6b7280;margin-top:8px">${email} now has faculty access.</p>
      </div>
    </body></html>
  `, { headers: { "Content-Type": "text/html" } })
}