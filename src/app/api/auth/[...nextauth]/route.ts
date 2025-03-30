import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import { compare } from 'bcryptjs';
import prisma from 'prisma/client';
import { z } from 'zod';
import { RateLimiterMemory } from 'rate-limiter-flexible';

if (!process.env.NEXTAUTH_SECRET)
  throw new Error('NEXTAUTH_SECRET is missing!');
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET)
  throw new Error('Google OAuth credentials are missing!');
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET)
  throw new Error('GitHub OAuth credentials are missing!');

/**
 * @swagger
 * components:
 * securitySchemes:
 * bearerAuth:
 * type: http
 * scheme: bearer
 * bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 * - name: Auth
 * description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/session:
 * get:
 * summary: Get user session
 * description: Returns the current authenticated user session.
 * tags: [Auth]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Successfully retrieved session
 * 401:
 * description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/signin:
 * post:
 * summary: Sign in a user
 * description: Authenticates a user using email/password or OAuth providers.
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * format: email
 * password:
 * type: string
 * format: password
 * required:
 * - email
 * - password
 * responses:
 * 200:
 * description: Successfully authenticated
 * 400:
 * description: Invalid credentials or too many login attempts
 * 401:
 * description: Unauthorized
 */

const CredentialsSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const loginAttemptLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60 * 5
});

/**
 * Authentication configuration for NextAuth
 * @type {NextAuthOptions}
 */
export const authOptions: NextAuthOptions = {
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
      async authorize(credentials, req) {
        try {
          const parsedCredentials = CredentialsSchema.parse(credentials);
          const { email, password } = parsedCredentials;

          const ipAddress =
            (req?.headers['x-forwarded-for'] as string) ||
            (req?.socket?.remoteAddress as string) ||
            'unknown';

          try {
            await loginAttemptLimiter.consume(ipAddress);
          } catch (rejRes) {
            const seconds = Math.round(rejRes.msBeforeNext / 1000) || 1;
            throw new Error(
              `Too many login attempts. Please try again in ${seconds} seconds.`
            );
          }

          const user = await prisma.user.findUnique({ where: { email } });

          if (!user || !user.password) {
            throw new Error('Invalid email or password');
          }

          const isValidPassword = await compare(password, user.password);
          if (!isValidPassword) {
            throw new Error('Invalid email or password');
          }

          await loginAttemptLimiter.delete(ipAddress); // Reset attempts on successful login

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
