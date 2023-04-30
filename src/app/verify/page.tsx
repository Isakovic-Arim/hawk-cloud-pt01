'use client'

import Link from "next/link"

export default function Verify() {
    return <>
        <p>Please verify your email and login once finished.</p>
        <Link href='/login'>Login</Link>
    </>
}