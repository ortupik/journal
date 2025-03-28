import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { compare } from 'bcryptjs';
import prisma from 'prisma/client';
import { z } from 'zod';

if (!process.env.NEXTAUTH_SECRET)
  throw new Error('NEXTAUTH_SECRET is missing!');
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
  throw new Error('Google OAuth credentials are missing!');
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET)
  throw new Error('GitHub OAuth credentials are missing!');

const CredentialsSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const authOptions: NextAuthOptions = {
  // ✅ Export authOptions
  session: { strategy: 'jwt' },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', required: true },
        password: { label: 'Password', type: 'password', required: true }
      },
      async authorize(credentials) {
        try {
          const parsedCredentials = CredentialsSchema.parse(credentials);

          const user = await prisma.user.findUnique({
            where: { email: parsedCredentials.email }
          });

          if (!user || !user.password) {
            throw new Error('Invalid email or password');
          }

          const isValidPassword = await compare(
            parsedCredentials.password,
            user.password
          );
          if (!isValidPassword) {
            throw new Error('Invalid email or password');
          }

          return { id: user.id, name: user.name, email: user.email };
        } catch (error) {
          throw new Error(
            error instanceof z.ZodError
              ? error.errors[0].message
              : error instanceof Error
                ? error.message
                : 'An unknown error occurred'
          );
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development'
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
