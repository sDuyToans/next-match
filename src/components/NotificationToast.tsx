import React from 'react'
import Link from "next/link";
import {Image} from "@nextui-org/image";
import {transformImageUrl} from "@/lib/utils";
import {MessageDto} from "@/types";
import {toast} from "react-toastify";

type Props = {
    image?: string | null,
    href: string,
    title: string,
    subtitle?: string
}

export default function NotificationToast({subtitle, title, image, href}: Props) {
    return (
        <Link href={href} className={'flex items-center'}>
            <div className={'mr-2'}>
                <Image
                    src={transformImageUrl(image) || '/images/user.png'}
                    width={50}
                    height={50}
                    alt={'Sender Image'}
                />
            </div>
            <div className={'flex flex-grow flex-col justify-center'}>
                <div className={'font-semibold'}>
                    {title}
                </div>
                <div className={'text-sm'}>
                    {subtitle || 'Click to view'}
                </div>
            </div>
        </Link>
    )
}

export const newMessageToast = (message: MessageDto) => {
    toast(
        <NotificationToast
            href={`/messages/${message.senderId}/chat`}
            image={message.senderImage}
            title={`${message.senderName} has send you an message`}/>
    )
}

export const newLikeToast = (name: string, image: string | null, userId: string) => {
    toast(
        <NotificationToast
            href={`/members/${userId}`}
            title={`You have been liked by ${name}`}
            subtitle={'Click here to view their profile!'}
            image={image}
        />
    )
}
