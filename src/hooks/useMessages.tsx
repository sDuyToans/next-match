import {useRouter, useSearchParams} from "next/navigation";
import {Key, useCallback, useEffect, useState} from "react";
import {MessageDto} from "@/types";
import {deleteMessage} from "@/app/actions/messageActions";
import useMessageStore from "@/hooks/useMessageStore";

export const useMessages = (initialMessages: MessageDto[]) => {
    const {set, remove, messages, updateUnreadCount} = useMessageStore(state => ({
        set: state.set,
        remove: state.remove,
        messages: state.messages,
        updateUnreadCount: state.updateUnreadCount
    }));
    const searchParams = useSearchParams();
    const router = useRouter();
    const isOutBox = searchParams.get('container') === 'outbox';
    const [isDeleting, setDeleting] = useState({id: '', loading: false});

    useEffect(() => {
        set(initialMessages);

        return () => {
            set([]);
        }
    }, [initialMessages, set]);

    const columns = [
        {key: isOutBox ? 'recipientName' : 'senderName', label: isOutBox ? 'Recipient' : 'Sender'},
        {key: 'text', label: 'Message'},
        {key: 'created', label: isOutBox ? 'Date sent' : 'Date receive'},
        {key: 'actions', label: 'Actions'},
    ]

    const handleDeleteMessage = useCallback(async (message: MessageDto) => {
        setDeleting({id: message.id, loading: true});
        await deleteMessage(message.id, isOutBox);
        remove(message.id);
        if (!message.dateRead && !isOutBox) updateUnreadCount(-1);
        setDeleting({id: '', loading: false});
    }, [isOutBox, remove, updateUnreadCount])

    const handleRowSelect = (key: Key) => {
        const message = messages.find(m => m.id === key);

        const url = isOutBox ? `/members/${message?.recipientId}` : `/members/${message?.senderId}`;
        router.push(url + '/chat');
    }

    return {
        isOutBox,
        columns,
        deleteMessage: handleDeleteMessage,
        selectRow: handleRowSelect,
        isDeleting,
        messages
    }
}
