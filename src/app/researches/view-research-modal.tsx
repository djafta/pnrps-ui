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

import Link from "next/link";

import React, {useEffect, useState} from "react";

import {HAS_APPROVAL_QUERY} from "@/apollo";
import {useLazyQuery} from "@apollo/client";

import {AiOutlineFilePdf} from "react-icons/ai";

import {Research} from "@/models";

import {ViewFinancingCard} from "@/app/researches/cards/view-financing-card";
import {ViewResearchersCard} from "@/app/researches/cards/view-researchers-card";
import {ViewResearchDataCard} from "@/app/researches/cards/view-research-data-card";
import {ViewResearchFilesCard} from "@/app/researches/cards/view-research-files-card";
import {ViewResearchApprovalCard} from "@/app/researches/cards/view-research-approval-card";
import {EditResearchAgreementsCard} from "@/app/dashboard/management/researches/cards/edit-research-agreements-card";
import {ViewResearchGeographicDataCard} from "@/app/researches/cards/view-research-geographic-data-card";

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
                            <ViewResearchDataCard research={researchData} setResearch={setResearchData}/>
                            <ViewResearchGeographicDataCard research={researchData} setResearch={setResearchData}/>
                            <ViewResearchersCard research={researchData} setResearch={setResearchData}/>
                            <ViewFinancingCard research={researchData} setResearch={setResearchData}/>
                            <ViewResearchApprovalCard research={researchData} setResearch={setResearchData}/>
                            <ViewResearchFilesCard research={researchData} setResearch={setResearchData}/>
                            <EditResearchAgreementsCard research={researchData}/>
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
