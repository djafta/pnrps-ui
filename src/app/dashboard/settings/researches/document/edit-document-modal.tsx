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
    ModalOverlay,
    UseModalProps,
    useToast
} from "@chakra-ui/react";

import {ResearchDocument} from "@/models";
import {useLazyQuery, useMutation} from "@apollo/client";
import {
    FIND_RESEARCH_DOCUMENT_BY_CODE_QUERY,
    LIST_RESEARCH_DOCUMENTS_QUERY,
    UPDATE_RESEARCH_DOCUMENT_MUTATION,
} from "@/apollo";

export interface EditDocumentModalProps extends UseModalProps {
    readonly document?: ResearchDocument
}

export function EditDocumentModal({isOpen, onClose, document}: EditDocumentModalProps) {
    const toast = useToast();
    const [documentData, setDocumentData] = useState(document);
    const [isInvalidDocumentCode, setInvalidDocumentCode] = useState(false);

    const [updateResearchDocumentMutation, updateResearchDocumentMutationResult] = useMutation(
        UPDATE_RESEARCH_DOCUMENT_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_DOCUMENTS_QUERY]
        }
    )

    const [findResearchDocumentByCodeQuery, findResearchDocumentByCodeQueryResult] = useLazyQuery(
        FIND_RESEARCH_DOCUMENT_BY_CODE_QUERY,
        {
            fetchPolicy: "no-cache"
        }
    )

    async function handleUpdateDocumentClick() {

        try {
            if (documentData?.code) {

                const {data} = await findResearchDocumentByCodeQuery({
                    variables: {
                        code: documentData?.code
                    }
                })

                if (data.findResearchDocumentByCode && data.findResearchDocumentByCode?.id !== document?.id) {
                    return setInvalidDocumentCode(true);
                } else {
                    setInvalidDocumentCode(false);
                }
            }

            await updateResearchDocumentMutation({
                variables: {
                    input: {
                        name: documentData?.name,
                        code: documentData?.code,
                        id: document?.id
                    }
                }
            })

            toast({
                title: "Documento Aaualizado!",
                description: `Documento $adocument?.name} atualizado com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        setDocumentData(document)
    }, [document, isOpen])

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading size={"sm"}>Editar Documento da Pesquisa</Heading>
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
                                                    if (documentData) {
                                                        setDocumentData({
                                                            ...documentData,
                                                            name: e.target.value
                                                        })
                                                    }
                                                }}
                                                defaultValue={document?.name}
                                                name={"name"}
                                                autoFocus={true}
                                                type={"text"}
                                            />
                                        </FormControl>
                                        <FormControl isRequired={true} isInvalid={isInvalidDocumentCode}>
                                            <FormLabel>Código</FormLabel>
                                            <Input
                                                onChange={(e) => {
                                                    if (documentData) {
                                                        setDocumentData({
                                                            ...documentData,
                                                            code: e.target.value
                                                        })
                                                    }
                                                }}
                                                defaultValue={document?.code}
                                                name={"code"}
                                                type={"text"}
                                            />
                                            <FormErrorMessage>O código já foi usado</FormErrorMessage>
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
                            findResearchDocumentByCodeQueryResult.loading
                            || updateResearchDocumentMutationResult.loading
                        }
                        type={"submit"}
                        colorScheme={"teal"}
                        className={`float-right`}
                        onClick={handleUpdateDocumentClick}
                    >
                        Gravar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
