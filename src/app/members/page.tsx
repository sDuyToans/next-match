import React from 'react'
import {getMembers} from "@/app/actions/memberActions";
import MemberCard from "@/app/members/MemberCard";
import {fetchCurrentUserLikeIds} from "@/app/actions/likeActions";

export default async function Page() {
    const members = await getMembers();
    const likedIds = await fetchCurrentUserLikeIds();
    return (
        <div className={"mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8"}>

            {
                members && members.map(member => <MemberCard key={member.id} member={member} likeIds={likedIds}/>)
            }

        </div>
    )
}
