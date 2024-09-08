import NextAuth from "next-auth"
import {PrismaAdapter} from "@auth/prisma-adapter"
import {prisma} from "@/lib/prisma";
import Credentials from "@auth/core/providers/credentials";
import {loginSchema} from "@/lib/schemas/loginSchema";
import {getUserByEmail} from "@/app/actions/authActions";
import {compare} from "bcryptjs";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";

export const {handlers, auth, signIn, signOut} = NextAuth({
    callbacks: {
        async jwt({user, token}){
            if (user) {
                token.profileComplete = user.profileComplete
            }
            return token;
        }
        ,
        async session({token, session}) {
            if (token.sub && session.user) {
                session.user.id = token.sub
                session.user.profileComplete = token.profileComplete as boolean
            }
            return session;
        }
    },
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt"},
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        Credentials({
        name: 'credentials',
        async authorize(creds) {
            const validated = loginSchema.safeParse(creds);

            if (validated.success) {
                const {email, password} = validated.data;

                const user = await getUserByEmail(email);

                if (!user || !user.passwordHash || !(await compare(password, user.passwordHash))) return null;

                return user;
            }

            return null;
        }
    })],
})
