"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function Page() {
    const [params, setParams] = useState("")
    const router = useRouter()

    useEffect(() => {
        setParams(window?.location.href.split("?")[1])
        window.onmessage = (e) => {
            router.push(e.data)
        }
    }, [router])

    return (
        <main className={"fixed w-full h-full left-0 top-0 flex items-center justify-center"}>
            <iframe src={`/widgets/auth?${params}`}>

            </iframe>
        </main>
    )
}