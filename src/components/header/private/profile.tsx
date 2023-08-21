import {IconButton} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

import {useAuth} from "@/hooks/auth";
import {MdOutlineManageAccounts} from "react-icons/md";

export function Profile() {
    const {isAuthorized} = useAuth()

    return isAuthorized("edit:user:self") ?
        <Link href={"/dashboard/profile/"}
              className={"flex items-center py-2 gap-6 hover:bg-slate-200 overflow-hidden whitespace-nowrap border-b-[1px] border-b-gray-200"}>
            <IconButton className={"flex min-w-[64px] justify-center"} aria-label={"Options"}
                        icon={<MdOutlineManageAccounts/>}
                        variant={"unstyled"}/>
            Perfil
        </Link>
        : null
}