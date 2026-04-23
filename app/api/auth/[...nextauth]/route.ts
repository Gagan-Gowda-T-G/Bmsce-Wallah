import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { supabase } from "@/lib/supabase"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" as const },
  pages: { signIn: "/login" },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", user.email)
        .single()
      if (!data) {
        await supabase.from("profiles").insert({
          email: user.email,
          name: user.name,
          image: user.image,
          role: "student",
          approved: false,
        })
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) token.user = user
      return token
    },
    async session({ session, token }: any) {
      session.user = token.user || session.user
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.includes("faculty-pending")) return `${baseUrl}/faculty-pending`
      if (url.startsWith(baseUrl)) return url
      return baseUrl
    },
  },
})

export { handler as GET, handler as POST }