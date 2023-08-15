import {useAuth} from "@/hooks/auth";
import {AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, IconButton} from "@chakra-ui/react";
import Link from "next/link";
import {MdOutlineManageSearch} from "react-icons/md";
import {AiOutlineSearch} from "react-icons/ai";
import {CiMap} from "react-icons/ci";
import React from "react";

interface ManagementProps {
    readonly expanded: boolean
}

export function Management({expanded}: ManagementProps) {
    const {isAuthorized} = useAuth();

    if (isAuthorized("read:research:list", "read:research:list:self", "read:research:self", "create:research", "read:user:list", "edit:user")) {
        return (
            <AccordionItem>
                <div className={"relative flex overflow-hidden items-center w-full hover:bg-slate-200"}>
                    <Link
                        href={"/dashboard/management"}
                        className={"flex items-center w-full py-2 gap-6  whitespace-nowrap border-b-[1px] border-b-gray-200"}
                    >
                        <IconButton
                            className={"flex min-w-[64px] justify-center"}
                            aria-label={"Options"}
                            icon={<MdOutlineManageSearch/>}
                            variant={"unstyled"}
                        />
                        <span
                            className={"flex items-center justify-between w-full pe-2"}
                        >
                            Gestão
                        </span>
                    </Link>
                    <AccordionButton className={"w-fit h-fit rounded-full me-2"}>
                        <AccordionIcon/>
                    </AccordionButton>
                </div>
                <AccordionPanel
                    className={`${expanded ? "block" : "hidden"} p-0 bg-slate-400 text-white`}
                >
                    {
                        isAuthorized("read:research:list", "read:research:list:self", "read:research:self", "create:research:self") ?
                            <Link
                                href={"/dashboard/management/researches"}
                                className={"flex items-center py-2 ps-6 gap-6 hover:bg-slate-200 overflow-hidden whitespace-nowrap"}
                            >
                                <IconButton
                                    className={"flex min-w-[64px] justify-center"}
                                    aria-label={"Options"}
                                    icon={<AiOutlineSearch/>} variant={"unstyled"}
                                />
                                Pesquisas
                            </Link>
                            : null
                    }
                    {
                        isAuthorized("read:user:list", "edit:user") ?
                            <Link
                                href={"/dashboard/management/users"}
                                className={"flex items-center py-2 ps-6 gap-6 hover:bg-slate-200 overflow-hidden whitespace-nowrap"}
                            >
                                <IconButton
                                    className={"flex min-w-[64px] justify-center"}
                                    aria-label={"Options"}
                                    icon={<CiMap/>} variant={"unstyled"}
                                />
                                Utilizadores
                            </Link>
                            : null
                    }
                </AccordionPanel>
            </AccordionItem>
        )
    }

    return null
}
