import React from 'react'
import Link from "next/link";

export default function Page() {
    return (
        <div>
            <h3 className={"text-3xl"}>This will be the members page</h3>
            <Link href={"/"}>Home</Link>
        </div>
    )
}
