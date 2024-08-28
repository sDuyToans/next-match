import React from 'react'
import ListsTab from "@/app/lists/ListsTab";
import {fetchCurrentUserLikeIds, fetchLikeMembers} from "@/app/actions/likeActions";

export default async function Page({searchParams}: { searchParams: { type: string } }) {
    const likedIds = await fetchCurrentUserLikeIds();
    const members = await fetchLikeMembers(searchParams.type);
    return (
        <div>
            <ListsTab members={members} likedIds={likedIds}/>
        </div>
    )
}
