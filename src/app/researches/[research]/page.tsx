"use client"

import {Button, Spinner} from "@chakra-ui/react";
import Link from "next/link";

import {GET_RESEARCH_BY_ID_QUERY} from "@/apollo";

import React, {useEffect, useState} from "react";
import {useQuery} from "@apollo/client";
import {Research} from "@/models";

import {EditResearchAgreementsCard} from "@/app/dashboard/management/researches/cards/edit-research-agreements-card";
import {AiOutlineFilePdf} from "react-icons/ai";
import {ViewResearchDataCard} from "@/app/researches/cards/view-research-data-card";
import {ViewResearchGeographicDataCard} from "@/app/researches/cards/view-research-geographic-data-card";
import {ViewResearchersCard} from "@/app/researches/cards/view-researchers-card";
import {ViewFinancingCard} from "@/app/researches/cards/view-financing-card";
import {ViewResearchApprovalCard} from "@/app/researches/cards/view-research-approval-card";
import {ViewResearchFilesCard} from "@/app/researches/cards/view-research-files-card";


export default function ResearchManagement({params}: { params: { research: string } }) {
    // @ts-ignore
    const [research, setResearch] = useState<Research>(null);

    const getResearchByIdQuery = useQuery(GET_RESEARCH_BY_ID_QUERY, {
        variables: {
            id: params.research
        },
        pollInterval: 1000 * 30 // 30 seconds
    })

    useEffect(() => {
        if (getResearchByIdQuery.data?.getResearchById) {
            setResearch(getResearchByIdQuery.data.getResearchById)
        }
    }, [getResearchByIdQuery])

    if (research) {

        return (
            <main className={"pt-24 flex flex-col gap-10 lg:ps-16 items-center w-full"}>
                <div className={"flex flex-col gap-6 max-w-screen-xl w-full"}>
                    <div className={"flex flex-col gap-6 w-full"}>
                        <ViewResearchDataCard research={research} setResearch={setResearch}/>
                        <ViewResearchGeographicDataCard research={research} setResearch={setResearch}/>
                        <ViewResearchersCard research={research} setResearch={setResearch}/>
                        <ViewFinancingCard research={research} setResearch={setResearch}/>
                        <ViewResearchApprovalCard research={research} setResearch={setResearch}/>
                        <ViewResearchFilesCard research={research} setResearch={setResearch}/>
                        <EditResearchAgreementsCard research={research}/>
                    </div>
                    <div>
                        <div className={"w-full flex flex-col gap-2 sm:flex-row sm:justify-end px-6 py-4"}>
                            <Link href={`/printing/${research?.id}/report`} target={"_blank"}>
                                <Button width={"full"} colorScheme={"teal"} variant={"outline"}
                                        rightIcon={<AiOutlineFilePdf/>}>
                                    Imprimir Relatório
                                </Button>
                            </Link>
                            <Link href={`/printing/${research?.id}/mta`} target={"_blank"}>
                                <Button width={"full"} colorScheme={"teal"} variant={"outline"}
                                        rightIcon={<AiOutlineFilePdf/>}>
                                    Imprimir MTA
                                </Button>
                            </Link>
                            <Link href={`/printing/${research?.id}/cr`} target={"_blank"}>
                                <Button width={"full"} colorScheme={"teal"} variant={"outline"}
                                        rightIcon={<AiOutlineFilePdf/>}>
                                    Imprimir CR
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        )

    }
    return (
        <div className={"fixed w-full h-full flex bg-white"}>
            <Spinner className={"m-auto"}/>
        </div>
    )
}
