"use client"
import React from 'react'
import Link from "next/link";
import {NavbarItem} from "@nextui-org/react";
import {usePathname} from "next/navigation";

type Props = {
    href: string;
    label: string;
}

export default function NavLink({href, label}: Props) {
    const pathName = usePathname();
    return (
        <NavbarItem isActive={pathName === href} as={Link} href={href}>{label}</NavbarItem>
    )
}
