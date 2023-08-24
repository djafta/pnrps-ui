import Link from "next/link";
import {useAuth} from "@/hooks/auth";
import {AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, IconButton} from "@chakra-ui/react";
import {AiOutlineSearch} from "react-icons/ai";
import {TbReport} from "react-icons/tb";
import {CiMap} from "react-icons/ci";
import React from "react";

export interface ReportProps {
    readonly expanded: boolean
}

export function Report({expanded}: ReportProps) {

    const {isAuthorized} = useAuth();

    if (isAuthorized("read:research:list", "read:research:self", "read:user:list")) {
        return (
            <AccordionItem>
                <div className={"relative flex overflow-hidden items-center w-full hover:bg-slate-200"}>
                    <Link
                        href={"/dashboard/reports"}
                        className={"flex items-center py-2 w-full gap-6 hover:bg-slate-200 whitespace-nowrap"}
                    >
                        <IconButton
                            className={"flex min-w-[64px] justify-center"}
                            aria-label={"Options"}
                            icon={<TbReport/>}
                            variant={"unstyled"}
                        />
                        <span className={"flex items-center justify-between w-full"}>
                            Relatório
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
                        isAuthorized("read:research:list", "read:research:self") ?
                            <Link
                                href={"/dashboard/reports/researches"}
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
                        isAuthorized("read:user:list") ?
                            <Link
                                href={"/dashboard/reports/researchers"}
                                className={"flex items-center py-2 ps-6 gap-6 hover:bg-slate-200 overflow-hidden whitespace-nowrap"}
                            >
                                <IconButton
                                    className={"flex min-w-[64px] justify-center"}
                                    aria-label={"Options"}
                                    icon={<CiMap/>} variant={"unstyled"}
                                />
                                Pesquisadores
                            </Link>
                            : null
                    }
                </AccordionPanel>
            </AccordionItem>
        )
    }

    return null
}
