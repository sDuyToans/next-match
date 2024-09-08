import {TokenType} from "@prisma/client";
import {randomBytes} from "crypto";
import {prisma} from "@/lib/prisma";

export async function getTokenByEmail(email: string) {
    try {
        return prisma.token.findFirst({
            where: {email}
        })
    } catch (err) {
        console.log(err);
        throw err;
    }
}


export async function getTokenByToken(token: string) {
    try {
        return prisma.token.findFirst({
            where: {token}
        })
    } catch (err) {
        console.log(err);
        throw err;
    }
}


export async function generateToken(email: string, type: TokenType) {
    const token = randomBytes(48).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

    const existingToken = await getTokenByEmail(email);
    console.log(existingToken)

    if (existingToken) {
        await prisma.token.delete({
            where: {id: existingToken.id}
        })
    }

    return prisma.token.create({
        data: {
            email,
            token,
            expires,
            type
        }
    })
}
