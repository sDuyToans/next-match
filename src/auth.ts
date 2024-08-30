import NextAuth from "next-auth"
import {PrismaAdapter} from "@auth/prisma-adapter"
import {prisma} from "@/lib/prisma";
import Credentials from "@auth/core/providers/credentials";
import {loginSchema} from "@/lib/schemas/loginSchema";
import {getUserByEmail} from "@/app/actions/authActions";
import {compare} from "bcryptjs";

export const {handlers, auth, signIn, signOut} = NextAuth({
    callbacks: {
        // async jwt({token, trigger, session}) {
        //     if (trigger === 'update' && session) {
        //         return {...token, ...session?.user}
        //     }
        //     return {...token, ...session}
        // },
        async session({token, session}) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            return session;
        }
    },
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt"},
    providers: [Credentials({
        name: 'credentials',
        async authorize(creds) {
            const validated = loginSchema.safeParse(creds);

            if (validated.success) {
                const {email, password} = validated.data;

                const user = await getUserByEmail(email);

                if (!user || !(await compare(password, user.passwordHash))) return null;

                return user;
            }

            return null;
        }
    })],
})
