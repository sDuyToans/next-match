'use client'
import React from 'react'
import {Table} from "@nextui-org/table";
import {TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import {MessageDto} from "@/types";
import {Card} from "@nextui-org/card";
import MessageTableCell from "@/app/messages/MessageTableCell";
import {useMessages} from "@/hooks/useMessages";

type Props = {
    initialMessages: MessageDto[]
}

export default function MessageTable({initialMessages}: Props) {
    const {
        isOutBox,
        isDeleting,
        deleteMessage,
        columns,
        selectRow,
        messages
    } = useMessages(initialMessages);

    return (
        <Card className={'flex flex-col gap-3 h-[80vh] overflow-auto'}>
            <Table
                aria-label={'Table with messages'}
                selectionMode={'single'}
                onRowAction={(key) => selectRow(key)}
                shadow={'none'}
            >
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}
                                              width={column.key === 'text' ? '50%' : undefined}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={messages} emptyContent={'No messages for this container'}>
                    {(item) => (
                        <TableRow key={item.id} className={'cursor-pointer'}>
                            {(columnKey) => (
                                <TableCell className={`${!item.dateRead && !isOutBox ? 'font-semibold' : ''}`}>
                                    <MessageTableCell item={item} columnKey={columnKey as string} isOutbox={isOutBox}
                                                      deleteMessage={deleteMessage}
                                                      isDeleting={isDeleting.loading && isDeleting.id === item.id}/>
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Card>
    )
}
