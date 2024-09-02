"use server"

import {prisma} from "@/lib/prisma";
import {getAuthUserId} from "@/app/actions/authActions";
import {pusherSever} from "@/lib/pusher";

export async function toggleLikeMember(targetUserId: string, isLiked: boolean) {
    try {
        const userId = await getAuthUserId();

        if (isLiked) {
            await prisma.like.delete({
                where: {
                    sourceUserId_targetUserId: {
                        sourceUserId: userId,
                        targetUserId
                    }
                }
            })
        } else {
            const like = await prisma.like.create({
                data: {
                    sourceUserId: userId,
                    targetUserId
                },
                select: {
                    sourceMember: {
                        select: {
                            name: true,
                            image: true,
                            userId: true
                        }
                    }
                }
            });

            await pusherSever.trigger(`private-${targetUserId}`, 'like:new', {
                name: like.sourceMember.name,
                image: like.sourceMember.image,
                userId: like.sourceMember.userId
            })
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function fetchCurrentUserLikeIds() {
    try {
        const userId = await getAuthUserId();

        const likeIds = await prisma.like.findMany({
            where: {
                sourceUserId: userId
            },
            select: {
                targetUserId: true
            }
        })

        return likeIds.map(like => like.targetUserId);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function fetchSourceLikes(userId: string) {
    const sourceList = await prisma.like.findMany({
        where: {
            sourceUserId: userId
        },
        select: {
            targetMember: true
        }
    })
    return sourceList.map(x => x.targetMember);
}

async function fetchTargetLikes(userId: string) {
    const targetList = await prisma.like.findMany({
        where: {
            targetUserId: userId
        },
        select: {
            sourceMember: true
        }
    })
    return targetList.map(x => x.sourceMember);
}

async function fetchMutualLikes(userId: string) {
    const likeUsers = await prisma.like.findMany({
        where: {
            sourceUserId: userId
        },
        select: {
            targetUserId: true
        }
    })

    const likedIds = likeUsers.map(x => x.targetUserId);

    const mutualList = await prisma.like.findMany({
        where: {
            AND: [
                {targetUserId: userId},
                {sourceUserId: {in: likedIds}}
            ]
        },
        select: {sourceMember: true}
    })
    return mutualList.map(x => x.sourceMember);
}

export async function fetchLikeMembers(type = 'source') {
    try {
        const userId = await getAuthUserId();

        switch (type) {
            case "source":
                return await fetchSourceLikes(userId);
            case "target":
                return await fetchTargetLikes(userId);
            case "mutual":
                return await fetchMutualLikes(userId);
            default:
                break;
        }
    } catch (err) {

    }
}
