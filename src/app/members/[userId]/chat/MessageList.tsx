'use client'
import React, {useCallback, useEffect, useRef, useState} from 'react'
import MessageBox from "@/app/members/[userId]/chat/MessageBox";
import {MessageDto} from "@/types";
import {pusherClient} from "@/lib/pusher";
import {formatShortDateTime} from "@/lib/utils";
import {Channel} from "pusher-js";
import useMessageStore from "@/hooks/useMessageStore";

type Props = {
    initialMessage: { message: MessageDto[], readCount: number },
    currentUserId: string,
    chatId: string
}

export default function MessageList({initialMessage, currentUserId, chatId}: Props) {
    const setReadCount = useRef(false);
    const channelRef = useRef<Channel | null>(null);
    const {updateUnreadCount} = useMessageStore(state => ({
        updateUnreadCount: state.updateUnreadCount
    }));

    useEffect(() => {
        if (!setReadCount.current) {
            updateUnreadCount(-initialMessage.readCount);
            setReadCount.current = true;
        }
    }, [updateUnreadCount, initialMessage.readCount]);

    const [messages, setMessages] = useState(initialMessage.message);

    const handleNewMessage = useCallback((message: MessageDto) => {
        setMessages(prevState => {
            return [...prevState, message]
        })
    }, [])

    const handleReadMessages = useCallback((messageIds: string[]) => {
        setMessages(prevState => prevState.map(message => messageIds.includes(message.id)
            ? {...message, dateRead: formatShortDateTime(new Date())}
            : message
        ))
    }, []);

    useEffect(() => {
        if (!channelRef.current) {
            channelRef.current = pusherClient.subscribe(chatId);

            channelRef.current.bind('message:new', handleNewMessage);
            channelRef.current.bind('messages:read', handleReadMessages);
        }

        return () => {
            if (channelRef.current && channelRef.current.subscribed) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind('message:new', handleNewMessage);
                channelRef.current.unbind('messages:read', handleReadMessages);
            }
        }
    }, [chatId, handleReadMessages, handleNewMessage]);

    return (
        <div>
            {messages.length === 0 ? 'No messages to display' : (
                <div>
                    {messages.map(message => (
                        <MessageBox key={message.id} message={message} currentUserId={currentUserId}/>
                    ))}
                </div>
            )}
        </div>
    )
}
