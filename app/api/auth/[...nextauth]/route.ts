import NextAuth, { DefaultSession, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { Doctor } from '@/lib/db/models/Doctor'
import connectDB from '@/lib/db/mongodb'
import bcrypt from 'bcryptjs'

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role: string
  }
}

// Extend the built-in JWT types
declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password')
        }

        await connectDB()

        const doctor = await Doctor.findOne({ email: credentials.email })
        if (!doctor) {
          throw new Error('No user found with this email')
        }

        const isValid = await bcrypt.compare(credentials.password, doctor.password)
        if (!isValid) {
          throw new Error('Invalid password')
        }

        return {
          id: doctor._id.toString(),
          email: doctor.email,
          name: doctor.name,
          role: 'doctor'
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user?: User }) {
      if (user) {
        token.sub = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: { session: any, token: JWT }) {
      if (session.user) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    }
  }
})

export { handler as GET, handler as POST }
