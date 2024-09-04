"use server"

import {prisma} from "@/lib/prisma";
import {Member, Photo} from "@prisma/client";
import {GetMemberParams, PaginatedResponse} from "@/types";
import {addYears} from "date-fns";
import {getAuthUserId} from "@/app/actions/authActions";

export async function getMembers({
                                     ageRange = '18, 100',
                                     gender = 'male, female',
                                     orderBy = 'updated',
                                     pageSize = '12',
                                     pageNumber = '1',
                                     withPhoto = 'true'
                                 }: GetMemberParams): Promise<PaginatedResponse<Member>> {
    const userId = await getAuthUserId();

    const [minAge, maxAge] = ageRange?.split(',');
    const currentDate = new Date();
    const minDob = addYears(currentDate, -maxAge - 1);
    const maxDob = addYears(currentDate, -minAge);

    const selectedGender = gender?.split(',');

    const page = parseInt(pageNumber);
    const limit = parseInt(pageSize);

    const skip = (page - 1) * limit;
    try {
        const count = await prisma.member.count({
            where: {
                AND: [
                    {dateOfBirth: {gte: minDob}},
                    {dateOfBirth: {lte: maxDob}},
                    {gender: {in: selectedGender}},
                    ...(withPhoto === 'true' ? [{image: {not: null}}] : [])
                ],
                NOT: {
                    userId
                }
            },
        })

        const members = await prisma.member.findMany({
            where: {
                AND: [
                    {dateOfBirth: {gte: minDob}},
                    {dateOfBirth: {lte: maxDob}},
                    {gender: {in: selectedGender}},
                    ...(withPhoto === 'true' ? [{image: {not: null}}] : [])
                ],
                NOT: {
                    userId
                }
            },
            orderBy: {[orderBy]: 'desc'},
            skip,
            take: limit
        });

        return {
            items: members,
            totalCount: count
        }
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

export async function updateLastActive() {
    const userId = await getAuthUserId();

    try {
        return prisma.member.update({
            where: {userId},
            data: {updated: new Date()}
        })
    } catch (err) {
        console.log(err);
        throw err;

    }
}
