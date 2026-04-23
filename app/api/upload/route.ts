import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const unitId = formData.get("unitId") as string
    const uploaderEmail = formData.get("uploaderEmail") as string
    const uploaderName = formData.get("uploaderName") as string

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    const fileExt = file.name.split(".").pop()
    const filePath = `${unitId}/${Date.now()}.${fileExt}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from("files")
      .upload(filePath, buffer, { contentType: file.type })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage.from("files").getPublicUrl(filePath)

    await supabase.from("files").insert({
      unit_id: parseInt(unitId),
      name: file.name,
      url: urlData.publicUrl,
      type: fileExt,
      uploader_email: uploaderEmail,
      uploader_name: uploaderName,
    })

    return NextResponse.json({ success: true, url: urlData.publicUrl })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}