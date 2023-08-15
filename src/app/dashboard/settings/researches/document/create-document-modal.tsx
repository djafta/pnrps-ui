import {FormEvent, useState} from "react";

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
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    UseModalProps,
    useToast
} from "@chakra-ui/react";

import {useLazyQuery, useMutation} from "@apollo/client";
import {
    CREATE_RESEARCH_DOCUMENT_MUTATION,
    FIND_RESEARCH_DOCUMENT_BY_CODE_QUERY,
    LIST_RESEARCH_DOCUMENTS_QUERY
} from "@/apollo";


export function CreateDocumentModal({isOpen, onClose}: UseModalProps) {
    const toast = useToast();
    const [isInvalidDocumentCode, setInvalidDocumentCode] = useState(false);

    const [createResearchDocumentMutation, createResearchDocumentMutationResult] = useMutation(
        CREATE_RESEARCH_DOCUMENT_MUTATION,
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

    async function handleCreateDocumentFormSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const name = data.get("name") as string;
        const code = data.get("code") as string;

        try {
            const {data} = await findResearchDocumentByCodeQuery({
                variables: {
                    code
                }
            })

            if (data.findResearchDocumentByCode) {
                return setInvalidDocumentCode(true);
            } else {
                setInvalidDocumentCode(false);
            }

            const result = await createResearchDocumentMutation({
                variables: {
                    input: {
                        name,
                        code,
                    }
                }
            })

            toast({
                title: "Documento Criado!",
                description: `Documento ${name} criado com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })

            setTimeout(onClose, 1000)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading size={"sm"}>Criar Documento da Pesquisa</Heading>
                </ModalHeader>
                <ModalBody className={"flex flex-col gap-4"}>
                    <Card>
                        <CardBody>
                            <form onSubmit={handleCreateDocumentFormSubmit}>
                                <div className={"flex flex-col gap-4"}>
                                    <div className={"flex gap-2 flex-col"}>
                                        <FormControl isRequired={true}>
                                            <FormLabel>Nome</FormLabel>
                                            <Input name={"name"} autoFocus={true} type={"text"}/>
                                        </FormControl>
                                        <FormControl isRequired={true} isInvalid={isInvalidDocumentCode}>
                                            <FormLabel>Código</FormLabel>
                                            <Input name={"code"} type={"text"}/>
                                            <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                        </FormControl>
                                    </div>

                                    <Button
                                        isLoading={
                                            findResearchDocumentByCodeQueryResult.loading
                                            || createResearchDocumentMutationResult.loading
                                        }
                                        type={"submit"}
                                        colorScheme={"teal"}
                                    >
                                        Criar
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </ModalBody>
                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
