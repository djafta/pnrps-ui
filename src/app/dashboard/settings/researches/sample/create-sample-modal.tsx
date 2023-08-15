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
    UseModalProps,
    useToast
} from "@chakra-ui/react";

import {ResearchSample} from "@/models";
import {useLazyQuery, useMutation} from "@apollo/client";
import {
    CREATE_RESEARCH_SAMPLE_MUTATION,
    FIND_RESEARCH_SAMPLE_BY_CODE_QUERY,
    LIST_RESEARCH_SAMPLES_QUERY
} from "@/apollo";


export function CreateSampleModal({isOpen, onClose}: UseModalProps) {
    const toast = useToast();
    const [classification, setSample] = useState<ResearchSample | null>(null);
    const [isInvalidSampleCode, setInvalidSampleCode] = useState(false);

    const [createResearchSampleMutation, createResearchSampleMutationResult] = useMutation(
        CREATE_RESEARCH_SAMPLE_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_SAMPLES_QUERY]
        }
    )

    const [findResearchSampleByCodeQuery, findResearchSampleByCodeQueryResult] = useLazyQuery(
        FIND_RESEARCH_SAMPLE_BY_CODE_QUERY,
        {
            fetchPolicy: "no-cache"
        }
    )

    async function handleCreateSampleFormSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const name = data.get("name") as string;
        const code = data.get("code") as string;

        try {
            const {data} = await findResearchSampleByCodeQuery({
                variables: {
                    code
                }
            })

            if (data.findResearchSampleByCode) {
                return setInvalidSampleCode(true);
            } else {
                setInvalidSampleCode(false);
            }

            const result = await createResearchSampleMutation({
                variables: {
                    input: {
                        name,
                        code
                    }
                }
            })

            setSample(result.data.createResearchSample);

            toast({
                title: "Amostra Criada!",
                description: `Amostra ${name} criada com sucesso.`,
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
        setSample(null);
    }, [isOpen])

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading size={"sm"}>Criar Amostra de Pesquisa</Heading>
                </ModalHeader>
                <ModalBody className={"flex flex-col gap-4"}>
                    <Card>
                        <CardBody>
                            <form onSubmit={handleCreateSampleFormSubmit}>
                                <div className={"flex flex-col gap-4"}>
                                    <div className={"flex gap-2 flex-col"}>
                                        <FormControl isRequired={true}>
                                            <FormLabel>Nome</FormLabel>
                                            <Input name={"name"} autoFocus={true} type={"text"}/>
                                        </FormControl>
                                        <FormControl isRequired={true} isInvalid={isInvalidSampleCode}>
                                            <FormLabel>Código</FormLabel>
                                            <Input name={"code"} type={"text"}/>
                                            <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                        </FormControl>
                                    </div>

                                    <Button
                                        isLoading={
                                            findResearchSampleByCodeQueryResult.loading
                                            || createResearchSampleMutationResult.loading
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
