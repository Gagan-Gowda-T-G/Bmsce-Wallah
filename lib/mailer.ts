import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendFacultyRequestEmail(
  facultyName: string,
  facultyEmail: string
) {
  const approveUrl = `${process.env.NEXTAUTH_URL}/api/approve-faculty?email=${facultyEmail}`

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `Faculty Access Request — ${facultyName}`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#fff;border-radius:16px;border:1px solid #e5e7eb">
        <div style="background:#f97316;color:white;padding:16px 24px;border-radius:12px;margin-bottom:24px">
          <h2 style="margin:0;font-size:20px">BMSCE Wallah — Faculty Request</h2>
        </div>
        <p style="color:#374151;font-size:16px">A faculty member has requested access:</p>
        <div style="background:#f9fafb;border-radius:12px;padding:16px;margin:16px 0">
          <p style="margin:0;color:#111827"><strong>Name:</strong> ${facultyName}</p>
          <p style="margin:8px 0 0;color:#111827"><strong>Email:</strong> ${facultyEmail}</p>
        </div>
        <a href="${approveUrl}" style="display:inline-block;background:#4f46e5;color:white;padding:12px 28px;border-radius:12px;text-decoration:none;font-weight:bold;margin-top:16px">
          ✅ Approve Faculty
        </a>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px">BMSCE Wallah Admin Panel</p>
      </div>
    `,
  })
}