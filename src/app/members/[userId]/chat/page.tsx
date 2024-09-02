import React from 'react'
import CardInnerWrapper from "@/components/CardInnerWrapper";
import ChatForm from "@/app/members/[userId]/chat/ChatForm";
import {getMessageThread} from "@/app/actions/messageActions";
import {getAuthUserId} from "@/app/actions/authActions";
import MessageList from "@/app/members/[userId]/chat/MessageList";
import {createChatId} from "@/lib/utils";

export default async function ChatPage({params}: { params: { userId: string } }) {
    const userId = await getAuthUserId();
    const messages = await getMessageThread(params.userId);
    const chatId = createChatId(userId, params.userId);

    return (
        <CardInnerWrapper
            header={'Chat'}
            body={<MessageList initialMessage={messages} currentUserId={userId} chatId={chatId}/>}
            footer={<ChatForm/>}
        />
    )
}
