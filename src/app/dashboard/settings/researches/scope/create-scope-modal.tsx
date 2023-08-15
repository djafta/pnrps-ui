import {FormEvent, useEffect, useState} from "react";

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
    Textarea,
    UseModalProps,
    useToast
} from "@chakra-ui/react";

import {ResearchScope} from "@/models";
import {useLazyQuery, useMutation} from "@apollo/client";
import {
    CREATE_RESEARCH_SCOPE_MUTATION,
    FIND_RESEARCH_SCOPE_BY_CODE_QUERY,
    LIST_RESEARCH_SCOPES_QUERY
} from "@/apollo";


export function CreateScopeModal({isOpen, onClose}: UseModalProps) {
    const toast = useToast();
    const [classification, setScope] = useState<ResearchScope | null>(null);
    const [isInvalidScopeCode, setInvalidScopeCode] = useState(false);

    const [createResearchScopeMutation, createResearchScopeMutationResult] = useMutation(
        CREATE_RESEARCH_SCOPE_MUTATION,
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

    async function handleCreateScopeFormSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const name = data.get("name") as string;
        const code = data.get("code") as string;
        const description = data.get("description") as string;

        try {
            const {data} = await findResearchScopeByCodeQuery({
                variables: {
                    code
                }
            })

            if (data.findResearchScopeByCode) {
                return setInvalidScopeCode(true);
            } else {
                setInvalidScopeCode(false);
            }

            const result = await createResearchScopeMutation({
                variables: {
                    input: {
                        name,
                        code,
                        description
                    }
                }
            })

            setScope(result.data.createResearchScope);

            toast({
                title: "Âmbito Criado!",
                description: `Âmbito ${name} criado com sucesso.`,
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

    useEffect(() => {
        setScope(null);
    }, [isOpen])

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading size={"sm"}>Criar Ambito de Pesquisa</Heading>
                </ModalHeader>
                <ModalBody className={"flex flex-col gap-4"}>
                    <Card>
                        <CardBody>
                            <form onSubmit={handleCreateScopeFormSubmit}>
                                <div className={"flex flex-col gap-4"}>
                                    <div className={"flex gap-2 flex-col"}>
                                        <FormControl isRequired={true}>
                                            <FormLabel>Nome</FormLabel>
                                            <Input name={"name"} autoFocus={true} type={"text"}/>
                                        </FormControl>
                                        <FormControl isRequired={true} isInvalid={isInvalidScopeCode}>
                                            <FormLabel>Código</FormLabel>
                                            <Input name={"code"} type={"text"}/>
                                            <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                        </FormControl>
                                        <FormControl isRequired={true} isInvalid={isInvalidScopeCode}>
                                            <FormLabel>Descrição</FormLabel>
                                            <Textarea name={"description"} minHeight={"4rem"}/>
                                        </FormControl>
                                    </div>

                                    <Button
                                        isLoading={
                                            findResearchScopeByCodeQueryResult.loading
                                            || createResearchScopeMutationResult.loading
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
