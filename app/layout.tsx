import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"
import Providers from "./providers"

const nunito = Nunito({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BMSCE Wallah",
  description: "Your campus learning portal",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}