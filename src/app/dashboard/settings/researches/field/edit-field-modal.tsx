import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Button,
    Card, CardBody, CardHeader, FormControl, FormErrorMessage, FormLabel,
    Heading, IconButton, Input,
    Modal, ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    UseModalProps,
    useToast
} from "@chakra-ui/react";

import {FormEvent, useState} from "react";
import {useLazyQuery, useMutation} from "@apollo/client";
import {ResearchField, ResearchSubfield} from "@/models";

import {
    CREATE_RESEARCH_SUBFIELD_MUTATION,
    DELETE_RESEARCH_SUBFIELD_MUTATION,
    FIND_RESEARCH_SUBFIELD_BY_CODE_QUERY,
    LIST_RESEARCH_FIELDS_QUERY,
    UPDATE_RESEARCH_FIELD_MUTATION
} from "@/apollo";

import {IoRemove} from "react-icons/io5";
import {BiSave} from "react-icons/bi";

export function EditFieldModal({isOpen, onClose, field}: UseModalProps & { field: ResearchField }) {
    const toast = useToast();
    const [fieldData, setFieldData] = useState(field);
    const [findResearchSubfieldByCode] = useLazyQuery(FIND_RESEARCH_SUBFIELD_BY_CODE_QUERY);
    const [isCodeInvalid, setCodeInvalid] = useState(false);
    const [isSubfieldCodeInvalid, setSubfieldCodeInvalid] = useState(false);

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

    const [updateResearchFieldMutation, updateResearchFieldMutationResult] = useMutation(UPDATE_RESEARCH_FIELD_MUTATION, {
        refetchQueries: [{
            query: LIST_RESEARCH_FIELDS_QUERY
        }]
    });

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

    async function handleUpdateFieldClick(e: FormEvent) {
        e.preventDefault();
        try {
            await updateResearchFieldMutation({
                variables: {
                    input: {
                        name: fieldData.name,
                        code: fieldData.code,
                        id: field.id
                    }
                }
            })

            toast({
                title: `Área de pesquisa atualizada`,
                description: `Área de pesquisa ${fieldData.name} atualizada com sucesso`,
                status: "success",
                colorScheme: "teal",
                position: "top",
                isClosable: true,
            })

            setTimeout(onClose, 1000);
        } catch (e) {
        }
    }

    async function handleAddSubfieldFormSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        const name = formData.get("name") as string;
        const code = formData.get("code") as string;

        const {data} = await findResearchSubfieldByCode({
            variables: {
                code
            }
        })

        if (data.findResearchSubfieldByCode) {
            return setSubfieldCodeInvalid(true);
        } else {
            setSubfieldCodeInvalid(false);
        }

        try {
            await createResearchSubfieldMutation({
                variables: {
                    input: {
                        name,
                        code,
                        researchFieldId: field.id
                    }
                }
            })
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
            console.log(e)
        }
    }

    return (
        <Modal isCentered={true} size={"2xl"} isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading size={"md"}>Editar Área de Pesquisa</Heading>
                    <ModalCloseButton/>
                </ModalHeader>
                <ModalBody className={"flex flex-col gap-4"}>
                    <Card>
                        <CardBody>
                            <form onSubmit={handleUpdateFieldClick}>
                                <div className={"flex gap-2 flex-col"}>
                                    <FormControl isRequired={true}>
                                        <FormLabel>Nome</FormLabel>
                                        <Input
                                            defaultValue={field?.name}
                                            onChange={(e) => setFieldData({...fieldData, name: e.target.value})}
                                            name={"name"}
                                            autoFocus={true}
                                            type={"text"}
                                        />
                                    </FormControl>
                                    <FormControl isRequired={true}>
                                        <FormLabel>Código</FormLabel>
                                        <Input
                                            defaultValue={field?.code}
                                            onChange={(e) => setFieldData({...fieldData, code: e.target.value})}
                                            name={"code"}
                                            type={"text"}
                                        />
                                        <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                    </FormControl>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>
                            <p>Sub-áreas</p>
                        </CardHeader>
                        <CardBody>
                            <div className={"flex flex-col gap-2"}>
                                {
                                    field?.subfields?.map((subfield) => {
                                        return (
                                            <div key={subfield.id}
                                                 className={"flex justify-between items-center p-2 rounded-xl hover:bg-slate-100 cursor-pointer"}>
                                                {subfield.name}
                                                <IconButton
                                                    aria-label={""}
                                                    isLoading={deleteResearchSubfieldMutationResult.loading}
                                                    rounded={"full"}
                                                    onClick={() => handleResearchSubfieldDeleteClick(subfield)}
                                                    icon={<IoRemove/>}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </CardBody>
                    </Card>
                    <Card>
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
                                                    <FormControl isRequired={true}>
                                                        <FormLabel>Nome</FormLabel>
                                                        <Input name={"name"} autoFocus={true} type={"text"}/>
                                                    </FormControl>
                                                    <FormControl isRequired={true} isInvalid={isSubfieldCodeInvalid}>
                                                        <FormLabel>Código</FormLabel>
                                                        <Input name={"code"} type={"text"}/>
                                                        <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                                    </FormControl>
                                                </div>
                                                <Button isLoading={createResearchSubfieldMutationResult.loading}
                                                        type={"submit"} colorScheme={"teal"}>Adicionar</Button>
                                            </div>
                                        </form>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        </CardBody>
                    </Card>
                </ModalBody>
                <ModalFooter>
                    <Button
                        isLoading={updateResearchFieldMutationResult.loading}
                        colorScheme={"teal"}
                        leftIcon={<BiSave/>}
                        onClick={handleUpdateFieldClick}
                    >
                        Gravar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}



