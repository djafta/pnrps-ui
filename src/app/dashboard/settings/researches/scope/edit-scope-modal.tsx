import {useEffect, useState} from "react";

import {
    Button,
    Card,
    CardBody,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, Textarea,
    UseModalProps,
    useToast
} from "@chakra-ui/react";

import {ResearchScope} from "@/models";
import {useLazyQuery, useMutation} from "@apollo/client";
import {
    FIND_RESEARCH_SCOPE_BY_CODE_QUERY,
    LIST_RESEARCH_SCOPES_QUERY,
    UPDATE_RESEARCH_SCOPE_MUTATION,
} from "@/apollo";

export interface EditScopeModalProps extends UseModalProps {
    readonly scope?: ResearchScope
}

export function EditScopeModal({isOpen, onClose, scope}: EditScopeModalProps) {
    const toast = useToast();
    const [scopeData, setScopeData] = useState(scope);
    const [isInvalidScopeCode, setInvalidScopeCode] = useState(false);

    const [updateResearchScopeMutation, updateResearchScopeMutationResult] = useMutation(
        UPDATE_RESEARCH_SCOPE_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_SCOPES_QUERY]
        }
    )

    const [findResearchScopeByCodeQuery, findResearchScopeByCodeQueryResult] = useLazyQuery(
        FIND_RESEARCH_SCOPE_BY_CODE_QUERY,
        {
            fetchPolicy: "no-cache"
        }
    )

    async function handleUpdateScopeClick() {

        console.log(scopeData)
        try {
            if (scopeData?.code) {

                const {data} = await findResearchScopeByCodeQuery({
                    variables: {
                        code: scopeData?.code
                    }
                })

                if (data.findResearchScopeByCode && data.findResearchScopeByCode?.id !== scope?.id) {
                    return setInvalidScopeCode(true);
                } else {
                    setInvalidScopeCode(false);
                }
            }

            await updateResearchScopeMutation({
                variables: {
                    input: {
                        name: scopeData?.name,
                        code: scopeData?.code,
                        description: scopeData?.description,
                        id: scope?.id
                    }
                }
            })

            toast({
                title: "Âmbito Atualizado!",
                description: `Âmbito ${scope?.name} atualizado com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(()=> {
        setScopeData(scope)
    }, [scope, isOpen])

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading size={"sm"}>Editar Âmbito de Pesquisa</Heading>
                    <ModalCloseButton/>
                </ModalHeader>
                <ModalBody className={"flex flex-col gap-4"}>
                    <Card>
                        <CardBody>
                            <form>
                                <div className={"flex flex-col gap-4"}>
                                    <div className={"flex gap-2 flex-col"}>
                                        <FormControl isRequired={true}>
                                            <FormLabel>Nome</FormLabel>
                                            <Input
                                                onChange={(e) => {
                                                    if (scopeData) {
                                                        setScopeData({
                                                            ...scopeData,
                                                            name: e.target.value
                                                        })
                                                    }
                                                }}
                                                defaultValue={scope?.name}
                                                name={"name"}
                                                autoFocus={true}
                                                type={"text"}
                                            />
                                        </FormControl>
                                        <FormControl isRequired={true} isInvalid={isInvalidScopeCode}>
                                            <FormLabel>Código</FormLabel>
                                            <Input
                                                onChange={(e) => {
                                                    if (scopeData) {
                                                        setScopeData({
                                                            ...scopeData,
                                                            code: e.target.value
                                                        })
                                                    }
                                                }}
                                                defaultValue={scope?.code}
                                                name={"code"}
                                                type={"text"}
                                            />
                                            <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                        </FormControl>
                                        <FormControl isRequired={true} isInvalid={isInvalidScopeCode}>
                                            <FormLabel>Descrição</FormLabel>
                                            <Textarea
                                                onChange={(e) => {
                                                    if (scopeData) {
                                                        setScopeData({
                                                            ...scopeData,
                                                            description: e.target.value
                                                        })
                                                    }
                                                }}
                                                name={"description"}
                                                defaultValue={scope?.description}
                                                minHeight={"4rem"}/>
                                        </FormControl>
                                    </div>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </ModalBody>
                <ModalFooter>
                    <Button
                        isLoading={
                            findResearchScopeByCodeQueryResult.loading
                            || updateResearchScopeMutationResult.loading
                        }
                        type={"submit"}
                        colorScheme={"teal"}
                        className={`float-right`}
                        onClick={handleUpdateScopeClick}
                    >
                        Gravar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
