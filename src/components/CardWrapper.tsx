import React, {ReactNode} from 'react'
import {Card, CardBody, CardFooter, CardHeader} from "@nextui-org/card";
import {IconType} from "react-icons";
import {Button} from "@nextui-org/react";

type Props = {
    body?: ReactNode,
    headerIcon: IconType,
    headerText: string,
    subHeaderText?: string,
    action?: () => void
    actionLabel?: string,
    footer?: ReactNode
}

export default function CardWrapper({
                                        body,
                                        action,
                                        headerIcon: Icon,
                                        subHeaderText,
                                        headerText,
                                        actionLabel,
                                        footer
                                    }: Props) {
    return (
        <div className={"flex items-center justify-center vertical-center"}>
            <Card className={"w-2/5 mx-auto"}>
                <CardHeader className={"flex flex-col items-center justify-center"}>
                    <div className={"flex flex-col gap-2 items-center text-secondary"}>
                        <div className={"flex flex-row items-center gap-3"}>
                            <Icon size={30}/>
                            <h1 className={"text-3xl font-semibold"}>{headerText}</h1>
                        </div>
                        {subHeaderText &&
                            <p className={"text-neutral-500"}>{subHeaderText}</p>}
                    </div>
                </CardHeader>
                {body &&
                    <CardBody>
                        {body}
                    </CardBody>
                }
                <CardFooter>
                    {action && (
                        <Button onClick={action} fullWidth={true} color={'secondary'} variant={'bordered'}>
                            {actionLabel}
                        </Button>
                    )}
                    {footer && (
                        <>{footer}</>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
