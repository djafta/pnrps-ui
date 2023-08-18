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
    useToast
} from "@chakra-ui/react";

import React, {useCallback, useState} from "react";
import {Research} from "@/models";
import {CreateResearchDataCard} from "@/app/dashboard/management/researches/cards/create-research-data-card";
import {
    CreateResearchGeographicDataCard
} from "@/app/dashboard/management/researches/cards/create-research-geographic-data-card";
import {EditResearchersCard} from "@/app/dashboard/management/researches/cards/edit-researchers-card";
import {EditFinancingCard} from "@/app/dashboard/management/researches/cards/edit-financing-card";
import {EditResearchFilesCard} from "@/app/dashboard/management/researches/cards/edit-research-files-card";
import {useMutation} from "@apollo/client";
import {CREATE_RESEARCH_MUTATION, LIST_RESEARCHES_QUERY} from "@/apollo";
import {EditResearchApprovalCard} from "@/app/dashboard/management/researches/cards/edit-research-approval-card";
import {EditResearchDataCard} from "@/app/dashboard/management/researches/cards/edit-research-data-card";
import {
    EditResearchGeographicDataCard
} from "@/app/dashboard/management/researches/cards/edit-research-geographic-data-card";
import {EditResearchAgreementsCard} from "@/app/dashboard/management/researches/cards/edit-research-agreements-card";
import {ResearchDangerZoneCard} from "@/app/dashboard/management/researches/cards/research-danger-zone-card";

export function CreateResearchModal({isOpen, onClose}: UseModalProps) {
    const toast = useToast()
    const [research, setResearch] = useState({} as Research)

    const [createResearchMutation, createResearchMutationResult] = useMutation(CREATE_RESEARCH_MUTATION, {
        refetchQueries: [LIST_RESEARCHES_QUERY, LIST_RESEARCHES_QUERY]
    })

    const handleCreateResearchClick = useCallback(async () => {
        try {
            console.log(research)

            const result = await createResearchMutation({
                variables: {
                    input: {
                        otherScope: research.otherScope,
                        endDate: research.endDate,
                        startDate: research.startDate,
                        acronym: research.acronym,
                        title: research.title,
                        code: research.code,
                        researchSubfieldId: research.subfield?.id,
                        researchScopeId: research.scope?.id,
                        researchSubtypeId: research.subtype?.id,
                        regionId: research.region?.id,
                        provinceId: research.province?.id,
                        countries: research.countries,
                    }
                }
            })

            if (result.data?.createResearch) {
                setResearch(result.data?.createResearch)

                toast({
                    title: "Pesquisa Criada",
                    description: `Pesquisa "${research.title}" criada com sucesso.`,
                    status: "success",
                    isClosable: true,
                    position: "top",
                    colorScheme: "teal",
                })
            }
        } catch (error) {
            toast({
                title: "Desculpa!",
                description: `Algo inesperado aconteceu ao criar a pesquisa. Por favor, verifique se tem boa conexão 
                               com a internet ou se todos os campos obrigatórios estão preenchidos.`,
                status: "error",
                isClosable: true,
                position: "top"
            })
        }
    }, [createResearchMutation, research, toast])

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"6xl"} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <ModalCloseButton className={"z-40"}/>
                </ModalHeader>
                <ModalBody>
                    <div className={"flex flex-col gap-6"}>
                        {
                            research.id ?
                                <>
                                    <EditResearchDataCard research={research} setResearch={setResearch}/>
                                    <EditResearchGeographicDataCard research={research} setResearch={setResearch}/>
                                    <EditResearchersCard research={research} setResearch={setResearch}/>
                                    <EditFinancingCard research={research} setResearch={setResearch}/>
                                    <EditResearchFilesCard research={research} setResearch={setResearch}/>
                                    <EditResearchApprovalCard research={research} setResearch={setResearch}/>
                                    <EditResearchAgreementsCard research={research}/>
                                    <ResearchDangerZoneCard research={research} setResearch={setResearch}/>
                                </>
                                :
                                <>
                                    <CreateResearchDataCard research={research} setResearch={setResearch}/>
                                    <CreateResearchGeographicDataCard research={research} setResearch={setResearch}/>
                                </>
                        }
                    </div>
                </ModalBody>
                {
                    !research.id &&
                    <ModalFooter>
                        <div className={"flex gap-4"}>
                            <Button
                                isLoading={createResearchMutationResult.loading}
                                onClick={handleCreateResearchClick}
                                colorScheme={"teal"}
                                variant={"outline"}>
                                Criar
                            </Button>
                        </div>
                    </ModalFooter>
                }
            </ModalContent>
        </Modal>
    )
}
