import React from 'react'
import {CardBody, CardHeader} from "@nextui-org/card";
import {Divider} from "@nextui-org/divider";
import EditForm from "@/app/members/edit/EditForm";
import {getAuthUserId} from "@/app/actions/authActions";
import {getMemberByUserId} from "@/app/actions/memberActions";
import {notFound} from "next/navigation";

export default async function MemberEditPage() {
    const userId = await getAuthUserId();
    const member = await getMemberByUserId(userId);
    if (!member) return notFound();
    
    return (
        <>
            <CardHeader className={"text-2xl font-semibold text-secondary"}>
                Edit profile
            </CardHeader>
            <Divider/>
            <CardBody>
                <EditForm member={member}/>
            </CardBody>
        </>
    )
}
