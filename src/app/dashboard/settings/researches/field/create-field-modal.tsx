import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel,
    Button,
    Card, CardBody, CardHeader, FormControl, FormErrorMessage, FormLabel,
    Heading, IconButton, Input,
    Modal, ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    UseModalProps,
    useToast
} from "@chakra-ui/react";
import {FormEvent, useEffect, useState} from "react";
import {ResearchField, ResearchSubfield} from "@/models";
import {useLazyQuery, useMutation} from "@apollo/client";
import {
    CREATE_RESEARCH_FIELD_MUTATION,
    CREATE_RESEARCH_SUBFIELD_MUTATION,
    DELETE_RESEARCH_SUBFIELD_MUTATION, FIND_RESEARCH_FIELD_BY_CODE_QUERY,
    LIST_RESEARCH_FIELDS_QUERY
} from "@/apollo";
import {IoRemove} from "react-icons/io5";

export function CreateFieldModal({isOpen, onClose}: UseModalProps) {
    const toast = useToast();
    const [field, setField] = useState<ResearchField | null>();
    const [isCodeInvalid, setCodeInvalid] = useState(false);

    const [createResearchFieldMutation, createResearchFieldMutationResult] = useMutation(CREATE_RESEARCH_FIELD_MUTATION, {
        refetchQueries: [{
            query: LIST_RESEARCH_FIELDS_QUERY
        }]
    });

    const [createResearchSubfieldMutation, createResearchSubfieldMutationResult] = useMutation(CREATE_RESEARCH_SUBFIELD_MUTATION, {
        refetchQueries: [{
            query: LIST_RESEARCH_FIELDS_QUERY
        }]
    });

    const [deleteResearchSubfieldMutation, deleteResearchSubfieldMutationResult] = useMutation(DELETE_RESEARCH_SUBFIELD_MUTATION, {
        refetchQueries: [{
            query: LIST_RESEARCH_FIELDS_QUERY
        }]
    });

    const [findResearchFieldByCodeQuery] = useLazyQuery(FIND_RESEARCH_FIELD_BY_CODE_QUERY, {});

    useEffect(() => {
        setField(null);
    }, [isOpen])

    /**
     *
     * @param e
     */
    async function handleAddSubfieldFormSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement
        const formData = new FormData(target);
        const name = formData.get("name") as string;
        const code = formData.get("code") as string;

        if (field) {
            try {
                const result = await createResearchSubfieldMutation({
                    variables: {
                        input: {
                            name,
                            code,
                            researchFieldId: field?.id
                        }
                    }
                })

                if (field.subfields) {
                    setField({...field, subfields: [...field?.subfields, result.data.createResearchSubfield]})
                } else {
                    setField({...field, subfields: [result.data.createResearchSubfield]})
                }

                toast({
                    title: `Sub-área de pesquisa adicionada`,
                    description: `Sub-área de pesquisa ${name} adicionada com sucesso`,
                    status: "success",
                    colorScheme: "teal",
                    position: "top",
                    isClosable: true,
                })

                target.querySelectorAll("input").forEach(input => input.value = "")
            } catch (e) {

            }
        }
    }

    async function handleAddFieldFormSubmit(e: FormEvent) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get("name") as string;
        const code = formData.get("code") as string;

        const {data} = await findResearchFieldByCodeQuery({
            variables: {
                code
            }
        })

        if (data.findResearchFieldByCode) {
            return setCodeInvalid(true);
        } else {
            setCodeInvalid(false);
        }

        try {
            const result = await createResearchFieldMutation({
                variables: {
                    input: {
                        name,
                        code
                    }
                }
            })

            setField(result.data.createResearchField);

            toast({
                title: `Área de pesquisa adicionada`,
                description: `Área de pesquisa ${name} adicionada com sucesso`,
                status: "success",
                colorScheme: "teal",
                position: "top",
                isClosable: true,
            })

        } catch (e) {

        }
    }

    async function handleResearchSubfieldDeleteClick(subfield: ResearchSubfield) {
        await deleteResearchSubfieldMutation({
            variables: {
                id: subfield.id
            }
        })

        toast({
            title: `Sub-área de pesquisa apagada`,
            description: `Sub-área de pesquisa ${subfield.name} apagada com sucesso`,
            status: "success",
            colorScheme: "teal",
            position: "top",
            isClosable: true,
        })
    }

    return (
        <Modal isCentered={true} size={"2xl"} isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading size={"md"}>Criar Área de Pesquisa</Heading>
                    <ModalCloseButton/>
                </ModalHeader>
                <ModalBody className={"flex flex-col gap-4"}>
                    <Card>
                        <CardBody>
                            <form onSubmit={handleAddFieldFormSubmit}>
                                <div className={"flex flex-col gap-4"}>
                                    <div className={"flex gap-2 flex-col"}>
                                        <FormControl isRequired={true}>
                                            <FormLabel>Nome</FormLabel>
                                            <Input defaultValue={field?.name} name={"name"} autoFocus={true}
                                                   type={"text"}/>
                                        </FormControl>
                                        <FormControl isInvalid={isCodeInvalid} isRequired={true}>
                                            <FormLabel>Código</FormLabel>
                                            <Input defaultValue={field?.code} name={"code"} type={"text"}/>
                                            <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                        </FormControl>
                                    </div>
                                    <Button type={"submit"} isLoading={createResearchFieldMutationResult.loading}
                                            colorScheme={"teal"}
                                            className={`${field ? "hidden" : "block"}`}>Criar</Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                    <Card className={`${field ? "flex" : "hidden"}`}>
                        <CardHeader>
                            <p>Sub-áreas</p>
                        </CardHeader>
                        <CardBody>
                            <div className={"flex flex-col gap-2"}>
                                {
                                    field?.subfields?.map((subfield) => {
                                        return (
                                            <div
                                                key={subfield.id}
                                                className={"flex justify-between items-center p-2 rounded-xl hover:bg-slate-100 cursor-pointer"}
                                            >
                                                {subfield.name}
                                                <IconButton
                                                    icon={<IoRemove/>}
                                                    rounded={"full"}
                                                    aria-label={""}
                                                    isLoading={deleteResearchSubfieldMutationResult.loading}
                                                    onClick={() => handleResearchSubfieldDeleteClick(subfield)}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </CardBody>
                    </Card>
                    <Card className={`${field ? "flex" : "hidden"}`}>
                        <CardBody>
                            <Accordion allowToggle>
                                <AccordionItem border={"none"}>
                                    <AccordionButton className={"flex justify-between rounded-xl p-3"}>
                                        Adicionar Sub-área
                                        <AccordionIcon/>
                                    </AccordionButton>
                                    <AccordionPanel>
                                        <form onSubmit={handleAddSubfieldFormSubmit}>
                                            <div className={"flex flex-col gap-4"}>
                                                <div className={"flex gap-2 flex-col"}>
                                                    <FormControl>
                                                        <FormLabel>Nome</FormLabel>
                                                        <Input name={"name"} autoFocus={true} type={"text"}/>
                                                    </FormControl>
                                                    <FormControl>
                                                        <FormLabel>Código</FormLabel>
                                                        <Input name={"code"} type={"text"}/>
                                                    </FormControl>
                                                </div>
                                                <Button
                                                    isLoading={createResearchSubfieldMutationResult.loading}
                                                    type={"submit"}
                                                    colorScheme={"teal"}>
                                                    Adicionar
                                                </Button>
                                            </div>
                                        </form>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        </CardBody>
                    </Card>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}