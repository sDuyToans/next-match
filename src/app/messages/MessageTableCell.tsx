import React from 'react'
import PresenceAvatar from "@/components/PresenceAvatar";
import {truncateString} from "@/lib/utils";
import {Button} from "@nextui-org/react";
import {AiFillDelete} from "react-icons/ai";
import {MessageDto} from "@/types";

type Props = {
    item: MessageDto,
    columnKey: string,
    isOutbox: boolean,
    deleteMessage: (message: MessageDto) => void,
    isDeleting: boolean
}

export default function MessageTableCell({deleteMessage, isDeleting, isOutbox, columnKey, item}: Props) {
    const cellValue = item[columnKey as keyof MessageDto];

    switch (columnKey) {
        case "recipientName":
        case "senderName":
            return (
                <div
                    className={`flex items-center gap-2 cursor-pointer`}>
                    <PresenceAvatar
                        userId={isOutbox ? item.recipientId : item.senderId}
                        src={isOutbox ? item.recipientImage : item.senderImage}
                    />
                    <span>{cellValue}</span>
                </div>
            )
        case "text":
            return (
                <div>
                    {truncateString(cellValue, 70)}
                </div>
            )
        case "created":
            return cellValue;
        default:
            return (
                <Button
                    isIconOnly={true}
                    variant={'light'}
                    onClick={() => deleteMessage(item)}
                    isLoading={isDeleting}
                >
                    <AiFillDelete size={24} className={'text-danger'}/>
                </Button>
            )
    }
}
