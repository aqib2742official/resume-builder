import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      fullName: string
      avatar: string
      role: string
      phone: string
      gender: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    fullName: string
    avatar: string
    phone: string
    gender: string
  }
}
