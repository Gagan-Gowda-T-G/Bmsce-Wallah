// @ts-nocheck
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { createClient } = await import("@supabase/supabase-js")
    const nodemailer = await import("nodemailer")

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { name, email } = await req.json()

    const { data: existing } = await supabase
      .from("faculty_requests")
      .select("*")
      .eq("email", email)
      .single()

    if (!existing) {
      await supabase.from("faculty_requests").insert({ name, email, status: "pending" })
      await supabase.from("profiles").update({ role: "faculty", approved: false }).eq("email", email)

      const approveUrl = `${process.env.NEXTAUTH_URL}/api/approve-faculty?email=${email}`

      const transporter = nodemailer.default.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      })

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `Faculty Access Request - ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#fff;border-radius:16px">
            <div style="background:#f97316;color:white;padding:16px 24px;border-radius:12px;margin-bottom:24px">
              <h2 style="margin:0">BMSCE Wallah - Faculty Request</h2>
            </div>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <a href="${approveUrl}" style="display:inline-block;background:#4f46e5;color:white;padding:12px 28px;border-radius:12px;text-decoration:none;font-weight:bold;margin-top:16px">
              Approve Faculty
            </a>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}