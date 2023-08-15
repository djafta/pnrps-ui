import {IconButton} from "@chakra-ui/react";
import {AiOutlineHome} from "react-icons/ai";
import Link from "next/link";
import React from "react";
import {useAuth} from "@/hooks/auth";

export function Home() {
    const {isAuthorized} = useAuth()

    if (isAuthorized("read:research:list")) {
        return (
            <Link href={"/dashboard/"}
                  className={"flex items-center py-2 gap-6 hover:bg-slate-200 overflow-hidden whitespace-nowrap border-b-[1px] border-b-gray-200"}>
                <IconButton className={"flex min-w-[64px] justify-center"} aria-label={"Options"}
                            icon={<AiOutlineHome/>}
                            variant={"unstyled"}/>
                Início
            </Link>
        )
    }

    return null
}