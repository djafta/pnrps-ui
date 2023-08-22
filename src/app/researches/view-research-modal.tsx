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
import React, {useCallback, useEffect, useMemo, useState} from "react";
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
import {useLazyQuery} from "@apollo/client";
import {HAS_APPROVAL_QUERY} from "@/apollo";

export interface EditResearchModalProps extends UseModalProps {
    research?: Research | null
}

export function ViewResearchModal({isOpen, onClose, research}: EditResearchModalProps) {
    const [researchData, setResearchData] = useState(research || {} as Research)
    const [getResearchApproval] = useLazyQuery(HAS_APPROVAL_QUERY)
    const [hasApproval, setHasApproval] = useState(false);

    useEffect(() => {
        if (isOpen && research) {
            setResearchData(research)
            getResearchApproval({
                variables: {
                    id: research?.id
                }
            }).then(({data}) => {
                setHasApproval(!!data?.getResearchApproval)
            })
        } else {
            setResearchData({} as Research)
        }
    }, [research, isOpen, getResearchApproval])

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
                            <EditResearchAgreementsCard research={researchData}/>
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
                            <Button
                                isDisabled={!hasApproval}
                                title={!hasApproval ? "Esta pesquisa ainda não foi aprovada" : "Imprimir Acordo de Transferência de Material"}
                                colorScheme={"teal"} variant={"outline"} rightIcon={<AiOutlineFilePdf/>}>
                                <Link href={hasApproval ? `/printing/${research?.id}/mta` : "#"}
                                      target={hasApproval ? "_blank" : undefined}>
                                    Imprimir MTA
                                </Link>
                            </Button>
                            <Button
                                isDisabled={!hasApproval}
                                title={!hasApproval ? "Esta pesquisa ainda não foi aprovada" : "Imprimir Confirmação de registro"}
                                colorScheme={"teal"} variant={"outline"} rightIcon={<AiOutlineFilePdf/>}>
                                <Link
                                    href={hasApproval ? `/printing/${research?.id}/cr` : "#"}
                                    target={hasApproval ? "_blank" : undefined}>
                                    Imprimir CR
                                </Link>
                            </Button>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
