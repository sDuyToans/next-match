import React from 'react'
import MessageSideBar from "@/app/messages/MessageSideBar";
import {getMessageByContainer} from "@/app/actions/messageActions";
import MessageTable from "@/app/messages/MessageTable";

export default async function MessagePage({searchParams}: { searchParams: { container: string } }) {
    const messages = await getMessageByContainer(searchParams.container);
    // console.log(messages)
    return (
        <div className={'grid grid-cols-12 gap-5 h-[80vh] mt-10'}>
            <div className={'col-span-2'}>
                <MessageSideBar/>
            </div>
            <div className={'col-span-10'}>
                <MessageTable messages={messages}/>
            </div>
        </div>
    )
}
