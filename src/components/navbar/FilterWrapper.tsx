'use client'
import React from 'react'
import {usePathname} from "next/navigation";
import Filters from "@/components/navbar/Filters";

export default function FilterWrapper() {
    const pathName = usePathname();

    if (pathName === '/members') return <Filters/>
    else return null;
}
