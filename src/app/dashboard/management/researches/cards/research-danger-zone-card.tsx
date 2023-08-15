import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Switch,
    Table,
    Tbody,
    Td,
    Tr,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import React, {Dispatch, SetStateAction} from "react";
import {WarningAlertDialog} from "@/components/warning-alert-dialog";
import {Research} from "@/models";
import {useMutation} from "@apollo/client";
import {LIST_RESEARCHES_QUERY, UPDATE_RESEARCH_MUTATION} from "@/apollo";

export interface ResearchDangerZoneCardProps {
    readonly research: Research
    readonly setResearch: Dispatch<SetStateAction<Research>>
}

export function ResearchDangerZoneCard({research, setResearch}: ResearchDangerZoneCardProps) {
    const toast = useToast();
    const changeVisibilityDisclosure = useDisclosure();
    const [updateResearchMutation, updateResearchMutationResult] = useMutation(UPDATE_RESEARCH_MUTATION, {
        refetchQueries: [LIST_RESEARCHES_QUERY]
    });

    return (
        <>
            <WarningAlertDialog
                title={`Quer tornar a pesquisa "${research?.visibility === "PRIVATE" ? "Pública" : "Privada"}"?`}
                description={
                    research?.visibility === "PRIVATE" ?
                        "Esta acção irá expor todos os dados da pesquisa ao público, o que possibilitará downloads."
                        : "Esta acção irá tornar esta pesquisa visível apenas para si e os administradores do sistema."
                }
                onConfirm={async () => {
                    if (research) {
                        await updateResearchMutation({
                            variables: {
                                input: {
                                    id: research.id,
                                    otherScope: research.otherScope,
                                    endDate: research.endDate,
                                    startDate: research.startDate,
                                    acronym: research.acronym,
                                    title: research.title,
                                    code: research.code,
                                    researchSubfieldId: research.subfield?.id,
                                    researchScopeId: research.scope?.id,
                                    researchSubtypeId: research.subtype?.id,
                                    visibility: research.visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC"
                                }
                            }
                        })

                        toast({
                            title: "Visibilidade Alterada",
                            description: `Visibilidade da pesquisa "${research?.title}" alterada com sucesso.`,
                            status: "success",
                            isClosable: true,
                            position: "top",
                            colorScheme: "teal",
                        })
                        setTimeout(changeVisibilityDisclosure.onClose, 300)
                    }
                }}
                isOpen={changeVisibilityDisclosure.isOpen}
                onClose={changeVisibilityDisclosure.onClose}/>
            <Card colorScheme={"red"}>
                <CardHeader>
                    <h3>Zona Perigosa</h3>
                </CardHeader>
                <CardBody padding={0}>
                    <Table width={"full"}>
                        <Tbody>
                            <Tr>
                                <Td>
                                    Torna a pesquisa pública ou privada
                                </Td>
                                <Td>
                                    <Switch
                                        isChecked={research.visibility === "PUBLIC"}
                                        onChange={changeVisibilityDisclosure.onOpen}
                                        width={"full"}
                                        colorScheme={"teal"}
                                        variant={"outline"}>
                                        Pesquisa Pública
                                    </Switch>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td>
                                    Elimina a pesquisa por completo
                                </Td>
                                <Td>
                                    <Button isDisabled={true} width={"full"} colorScheme={"red"} variant={"outline"}>
                                        Apagar Pesquisa
                                    </Button>
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </CardBody>
            </Card>
        </>
    )
}