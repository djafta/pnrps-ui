import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    UseModalProps,
} from "@chakra-ui/react";

import {AiOutlineFilePdf} from "react-icons/ai";
import React, {useEffect, useState} from "react";
import {Research,} from "@/models";
import {EditResearchDataCard} from "@/app/dashboard/management/researches/cards/edit-research-data-card";
import {
    EditResearchGeographicDataCard
} from "@/app/dashboard/management/researches/cards/edit-research-geographic-data-card";
import {EditResearchersCard} from "@/app/dashboard/management/researches/cards/edit-researchers-card";
import {EditFinancingCard} from "@/app/dashboard/management/researches/cards/edit-financing-card";
import {EditResearchApprovalCard} from "@/app/dashboard/management/researches/cards/edit-research-approval-card";
import {EditResearchFilesCard} from "@/app/dashboard/management/researches/cards/edit-research-files-card";
import Link from "next/link";
import {EditResearchAgreementsCard} from "@/app/dashboard/management/researches/cards/edit-research-agreements-card";
import {ResearchDangerZoneCard} from "@/app/dashboard/management/researches/cards/research-danger-zone-card";

export interface EditResearchModalProps extends UseModalProps {
    research?: Research | null
}

export function EditResearchModal({isOpen, onClose, research}: EditResearchModalProps) {
    const [researchData, setResearchData] = useState(research || {} as Research)

    useEffect(() => {
        if (isOpen && research) {
            setResearchData(research)
        } else {
            setResearchData({} as Research)
        }
    }, [research, isOpen])

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size={"6xl"} scrollBehavior={"inside"}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        <ModalCloseButton className={"z-40"}/>
                    </ModalHeader>
                    <ModalBody>
                        <div className={"flex flex-col gap-6"}>
                            <EditResearchDataCard research={researchData} setResearch={setResearchData}/>
                            <EditResearchGeographicDataCard research={researchData} setResearch={setResearchData}/>
                            <EditResearchersCard research={researchData} setResearch={setResearchData}/>
                            <EditFinancingCard research={researchData} setResearch={setResearchData}/>
                            <EditResearchApprovalCard research={researchData} setResearch={setResearchData}/>
                            <EditResearchFilesCard research={researchData} setResearch={setResearchData}/>
                            <EditResearchAgreementsCard/>
                            <ResearchDangerZoneCard research={researchData} setResearch={setResearchData}/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className={"w-full flex gap-2 md:flex-row md:justify-end"}>
                            <Link href={`/printing/${research?.id}/report`} target={"_blank"}>
                                <Button colorScheme={"teal"} variant={"outline"} rightIcon={<AiOutlineFilePdf/>}>
                                    Imprimir Relatório
                                </Button>
                            </Link>
                            <Link href={`/printing/${research?.id}/mta`} target={"_blank"}>
                                <Button colorScheme={"teal"} variant={"outline"} rightIcon={<AiOutlineFilePdf/>}>
                                    Imprimir MTA
                                </Button>
                            </Link>
                            <Link href={`/printing/${research?.id}/cr`} target={"_blank"}>
                                <Button colorScheme={"teal"} variant={"outline"} rightIcon={<AiOutlineFilePdf/>}>
                                    Imprimir CR
                                </Button>
                            </Link>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
