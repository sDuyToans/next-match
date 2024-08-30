import React from 'react'
import {CardBody, CardHeader} from "@nextui-org/react";
import {Divider} from "@nextui-org/divider";
import {getAuthUserId} from "@/app/actions/authActions";
import {getMemberByUserId, getMemberPhotosByUserId} from "@/app/actions/memberActions";
import MemberPhotoUpload from "@/app/members/[userId]/photos/MemberPhotoUpload";
import MemberPhoto from "@/components/MemberPhoto";

export default async function PhotoPage() {
    const userId = await getAuthUserId();
    const member = await getMemberByUserId(userId);

    const photos = await getMemberPhotosByUserId(userId);

    return (
        <>
            <CardHeader className={'flex flex-row justify-between items-center'}>
                <div className={'text-2xl font-semibold text-secondary'}>Edit profile</div>
                <MemberPhotoUpload/>
            </CardHeader>
            <Divider/>
            <CardBody>
                <MemberPhoto photos={photos} mainImageUrl={member?.image} editing={true}/>
            </CardBody>
        </>
    )
}
