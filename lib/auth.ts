import NextAuth, { type NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? ''
        token.role = (user as { role?: string }).role ?? 'user'
        token.fullName = (user as { fullName?: string }).fullName ?? ''
        token.avatar = (user as { avatar?: string }).avatar ?? ''
        token.phone = (user as { phone?: string }).phone ?? ''
        token.gender = (user as { gender?: string }).gender ?? ''
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.fullName = token.fullName as string
        session.user.avatar = token.avatar as string
        session.user.phone = token.phone as string
        session.user.gender = token.gender as string
      }
      return session
    },
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        await connectDB()
        const user = await User.findOne({ email: (credentials.email as string).toLowerCase() })
        if (!user) return null

        const valid = await bcrypt.compare(credentials.password as string, user.password)
        if (!valid) return null

        if (user.disabled) throw new Error('Account has been disabled. Please contact support.')

        return {
          id: (user._id as { toString(): string }).toString(),
          email: user.email,
          name: user.fullName,
          fullName: user.fullName,
          avatar: user.avatar,
          role: user.role,
          phone: user.phone,
          gender: user.gender,
        }
      },
    }),
  ],
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
