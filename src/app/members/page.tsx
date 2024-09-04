import React from 'react'
import {getMembers} from "@/app/actions/memberActions";
import MemberCard from "@/app/members/MemberCard";
import {fetchCurrentUserLikeIds} from "@/app/actions/likeActions";
import PaginationComponent from "@/components/PaginationComponent";
import {GetMemberParams} from "@/types";
import EmptyState from "@/components/EmptyState";

export default async function MembersPage({searchParams}: { searchParams: GetMemberParams }) {
    const {totalCount, items: members} = await getMembers(searchParams);
    const likedIds = await fetchCurrentUserLikeIds();
    return (
        <>
            {!members || members.length === 0 ? (
                <EmptyState/>
            ) : (
                <>
                    <div className={"mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8"}>

                        {
                            members && members.map(member => <MemberCard key={member.id} member={member}
                                                                         likeIds={likedIds}/>)
                        }

                    </div>
                    <PaginationComponent totalCount={totalCount}/>
                </>
            )}
        </>
    )
}
