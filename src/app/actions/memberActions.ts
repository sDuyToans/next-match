"use server"

import {prisma} from "@/lib/prisma";
import {auth} from "@/auth";
import {Photo} from "@prisma/client";

export async function getMembers() {
    const session = await auth();
    if (!session?.user) return null;

    try {
        return prisma.member.findMany({
            where: {
                NOT: {
                    userId: session.user.id
                }
            }
        });
    } catch (err) {
        console.log(err)
        throw new Error("Just texting...");
    }
}

export async function getMemberByUserId(userId: string) {
    try {
        return prisma.member.findUnique({
            where: {userId}
        })
    } catch (err) {
        console.log(err)
    }
}

export async function getMemberPhotosByUserId(userId: string) {
    const member = await prisma.member.findUnique({
        where: {userId},
        select: {photo: true}
    });

    if (!member) return null;

    return member.photo.map(p => p) as Photo[];
}
