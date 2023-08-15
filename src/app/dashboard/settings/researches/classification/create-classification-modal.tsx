import {FormEvent, useEffect, useState} from "react";

import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Button,
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    IconButton,
    Input,
    Modal,
    ModalBody, ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger, useDisclosure,
    UseModalProps,
    useToast
} from "@chakra-ui/react";

import {IoRemove} from "react-icons/io5";
import {AddIcon} from "@chakra-ui/icons";

import {ResearchClassification, ResearchSubtype, ResearchType} from "@/models";
import {useLazyQuery, useMutation} from "@apollo/client";
import {
    CREATE_RESEARCH_CLASSIFICATION_MUTATION, CREATE_RESEARCH_SUBTYPE_MUTATION,
    CREATE_RESEARCH_TYPE_MUTATION,
    DELETE_RESEARCH_SUBTYPE_MUTATION,
    DELETE_RESEARCH_TYPE_MUTATION,
    FIND_RESEARCH_CLASSIFICATION_BY_CODE,
    FIND_RESEARCH_SUBTYPE_BY_CODE_QUERY,
    FIND_RESEARCH_TYPE_BY_CODE_QUERY,
    LIST_RESEARCH_CLASSIFICATIONS_QUERY,
    UPDATE_RESEARCH_TYPE_MUTATION
} from "@/apollo";
import {type} from "os";


export function CreateClassificationModal({isOpen, onClose}: UseModalProps) {
    const toast = useToast();
    const [classification, setClassification] = useState<ResearchClassification | null>(null);
    const [isInvalidClassificationCode, setInvalidClassificationCode] = useState(false);
    const [isInvalidTypeCode, setInvalidTypeCode] = useState(false);
    const [isInvalidSubtypeCode, setInvalidSubtypeCode] = useState(false);
    const addSubtypePopoverDisclosure = useDisclosure();

    const [createResearchClassificationMutation, createResearchClassificationMutationResult] = useMutation(
        CREATE_RESEARCH_CLASSIFICATION_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_CLASSIFICATIONS_QUERY]
        }
    )

    const [createResearchTypeMutation, createResearchTypeMutationResult] = useMutation(
        CREATE_RESEARCH_TYPE_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_CLASSIFICATIONS_QUERY]
        }
    )

    const [findResearchClassificationByCodeQuery, findResearchClassificationByCodeQueryResult] = useLazyQuery(
        FIND_RESEARCH_CLASSIFICATION_BY_CODE,
        {
            fetchPolicy: "no-cache"
        }
    )

    const [findResearchTypeByCodeQuery, findResearchTypeByCodeQueryResult] = useLazyQuery(
        FIND_RESEARCH_TYPE_BY_CODE_QUERY,
        {
            fetchPolicy: "no-cache"
        }
    )


    const [findResearchSubtypeByCodeQuery, findResearchSubtypeByCodeQueryResult] = useLazyQuery(
        FIND_RESEARCH_SUBTYPE_BY_CODE_QUERY,
        {
            fetchPolicy: "no-cache"
        }
    )

    const [createResearchSubtypeMutation, createResearchSubtypeMutationResult] = useMutation(
        CREATE_RESEARCH_SUBTYPE_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_CLASSIFICATIONS_QUERY]
        }
    )

    const [deleteResearchSubtypeMutation, deleteResearchSubtypeMutationResult] = useMutation(
        DELETE_RESEARCH_SUBTYPE_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_CLASSIFICATIONS_QUERY]
        }
    )

    async function handleCreateClassificationFormSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const name = data.get("name") as string;
        const code = data.get("code") as string;

        try {
            const {data} = await findResearchClassificationByCodeQuery({
                variables: {
                    code
                }
            })

            if (data.findResearchClassificationByCode) {
                return setInvalidClassificationCode(true);
            } else {
                setInvalidClassificationCode(false);
            }

            const result = await createResearchClassificationMutation({
                variables: {
                    input: {
                        name,
                        code
                    }
                }
            })

            setClassification(result.data.createResearchClassification);

            toast({
                title: "Classificação Criada!",
                description: `Classificação ${name} criada com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })
        } catch (e) {
            console.log(e)
        }
    }

    async function handleCreateTypeFormSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const name = data.get("name") as string;
        const code = data.get("code") as string;

        if (classification) {

            try {
                const {data} = await findResearchTypeByCodeQuery({
                    variables: {
                        code
                    }
                })

                if (data.findResearchTypeByCode) {
                    return setInvalidTypeCode(true);
                } else {
                    setInvalidTypeCode(false);
                }

                const result = await createResearchTypeMutation({
                    variables: {
                        input: {
                            name,
                            code,
                            researchClassificationId: classification.id
                        }
                    }
                })

                if (classification.types) {
                    setClassification({
                        ...classification,
                        types: [...classification.types, result.data.createResearchType]
                    });
                } else {
                    setClassification({
                        ...classification,
                        types: [result.data.createResearchType]
                    });
                }

                toast({
                    title: "Tipo Criado!",
                    description: `Tipo ${name} criado com sucesso.`,
                    status: "success",
                    isClosable: true,
                    position: "top",
                    colorScheme: "teal",
                })

                // Clear all form inputs after mutation
                target.querySelectorAll("input").forEach(input => input.value = "");

            } catch (e) {
                console.log(e)
            }
        }
    }

    async function handleCreateSubtypeFormSubmit(e: FormEvent, type: ResearchType) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const name = data.get("name") as string;
        const code = data.get("code") as string;

        try {
            const {data} = await findResearchSubtypeByCodeQuery({
                variables: {
                    code
                }
            })

            if (data.findResearchSubtypeByCode) {
                return setInvalidSubtypeCode(true);
            } else {
                setInvalidSubtypeCode(false);
            }

            const result = await createResearchSubtypeMutation({
                variables: {
                    input: {
                        name,
                        code,
                        researchTypeId: type.id
                    }
                }
            })

            if (classification?.types) {
                if (type.subtypes) {
                    type.subtypes = [...type.subtypes, result.data.createResearchSubtype]
                } else {
                    type.subtypes = [result.data.createResearchSubtype]
                }

                setClassification({
                    ...classification,
                })
            }

            toast({
                title: "Sub-tipo Criado!",
                description: `Sub-tipo ${name} criado com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })

            setTimeout(addSubtypePopoverDisclosure.onClose, 500);

        } catch
            (e) {
        }

        // Clear all form inputs after mutation
        target.querySelectorAll("input").forEach(input => input.value = "");
    }

    async function handleDeleteSubtypeClick(subtype: ResearchSubtype) {
        try {
            await deleteResearchSubtypeMutation({
                variables: {
                    id: subtype.id
                }
            })

            toast({
                title: "Sub-tipo Apagado!",
                description: `Sub-tipo ${name} foi apagado com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })

            // @ts-ignore
            setClassification({
                ...classification,
                types: classification!.types!.map((type) => {
                    return {
                        ...type,
                        subtypes: type.subtypes!.filter(s => s !== subtype)
                    }
                })
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        setClassification(null);
    }, [isOpen])

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading size={"sm"}>Criar Classificação de Pesquisa</Heading>
                    <ModalCloseButton/>
                </ModalHeader>
                <ModalBody className={"flex flex-col gap-4"}>
                    <Card>
                        <CardBody>
                            <form onSubmit={handleCreateClassificationFormSubmit}>
                                <div className={"flex flex-col gap-4"}>
                                    <div className={"flex gap-2 flex-col"}>
                                        <FormControl isRequired={true}>
                                            <FormLabel>Nome</FormLabel>
                                            <Input name={"name"} autoFocus={true} type={"text"}/>
                                        </FormControl>
                                        <FormControl isRequired={true} isInvalid={isInvalidClassificationCode}>
                                            <FormLabel>Código</FormLabel>
                                            <Input name={"code"} type={"text"}/>
                                            <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                        </FormControl>
                                    </div>

                                    <Button
                                        isLoading={
                                            findResearchClassificationByCodeQueryResult.loading
                                            || createResearchClassificationMutationResult.loading
                                        }
                                        type={"submit"}
                                        colorScheme={"teal"}
                                        className={`${classification ? "hidden" : "block"}`}
                                    >
                                        Criar
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                    <Card className={`${classification ? "flex" : "hidden"}`}>
                        <CardHeader>
                            <p>Tipos</p>
                        </CardHeader>
                        <CardBody>
                            <Accordion allowMultiple={true}>
                                {classification?.types?.map((type) => {
                                    return (
                                        <AccordionItem
                                            key={type.id}
                                            className={"border-none p-3 rounded-xl hover:bg-slate-100"}
                                        >
                                            <AccordionButton className={"hover:bg-transparent flex justify-between"}>
                                                {type.name}
                                                <AccordionIcon/>
                                            </AccordionButton>
                                            <AccordionPanel>
                                                <div className={"flex gap-2 flex-col justify-end"}>
                                                    <ul>
                                                        {type.subtypes?.map((subtype) => {
                                                            return (
                                                                <li
                                                                    key={subtype.id}
                                                                    className={"flex justify-between items-center p-3 ps-4 rounded-xl hover:bg-slate-200"}
                                                                >
                                                                    {subtype.name}
                                                                    <IconButton
                                                                        isLoading={deleteResearchSubtypeMutationResult.loading}
                                                                        aria-label={""}
                                                                        onClick={() => handleDeleteSubtypeClick(subtype)}
                                                                        rounded={"full"}
                                                                        icon={<IoRemove/>}
                                                                    />
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                    <div className={"p-3"}>
                                                        <Popover
                                                            isOpen={addSubtypePopoverDisclosure.isOpen}
                                                            onOpen={addSubtypePopoverDisclosure.onOpen}
                                                            onClose={addSubtypePopoverDisclosure.onClose}
                                                            placement={"auto"}
                                                            isLazy={true}
                                                        >
                                                            <PopoverTrigger>
                                                                <IconButton
                                                                    className={"float-right"} aria-label={""}
                                                                    rounded={"full"}
                                                                    icon={<AddIcon/>}
                                                                />
                                                            </PopoverTrigger>
                                                            <PopoverContent>
                                                                <PopoverArrow/>
                                                                <PopoverCloseButton/>
                                                                <PopoverHeader>Adicionar Subtipo</PopoverHeader>
                                                                <PopoverBody>
                                                                    <form
                                                                        onSubmit={(e) => handleCreateSubtypeFormSubmit(e, type)}>
                                                                        <div className={"flex gap-2 flex-col"}>
                                                                            <FormControl isRequired={true}>
                                                                                <FormLabel>Nome</FormLabel>
                                                                                <Input name={"name"} autoFocus={true}
                                                                                       type={"text"}/>
                                                                            </FormControl>
                                                                            <FormControl
                                                                                isRequired={true}
                                                                                isInvalid={isInvalidSubtypeCode}
                                                                            >
                                                                                <FormLabel>Código</FormLabel>
                                                                                <Input name={"code"} type={"text"}/>
                                                                                <FormErrorMessage>O código já foi
                                                                                    usado</FormErrorMessage>
                                                                            </FormControl>
                                                                            <Button
                                                                                type={"submit"}
                                                                                colorScheme={"teal"}
                                                                            >
                                                                                Adicionar
                                                                            </Button>
                                                                        </div>
                                                                    </form>
                                                                </PopoverBody>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                </div>
                                            </AccordionPanel>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        </CardBody>
                    </Card>
                    <Card className={`${classification ? "flex" : "hidden"}`}>
                        <CardBody>
                            <Accordion allowToggle>
                                <AccordionItem border={"none"}>
                                    <AccordionButton className={"flex justify-between rounded-xl p-3"}>
                                        Adicionar Tipo
                                        <AccordionIcon/>
                                    </AccordionButton>
                                    <AccordionPanel>
                                        <form onSubmit={handleCreateTypeFormSubmit}>
                                            <div className={"flex flex-col gap-4"}>
                                                <div className={"flex gap-2 flex-col"}>
                                                    <FormControl isRequired={true}>
                                                        <FormLabel>Nome</FormLabel>
                                                        <Input name={"name"} autoFocus={true} type={"text"}/>
                                                    </FormControl>
                                                    <FormControl isRequired={true} isInvalid={isInvalidTypeCode}>
                                                        <FormLabel>Código</FormLabel>
                                                        <Input name={"code"} type={"text"}/>
                                                        <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                                    </FormControl>
                                                </div>
                                                <Button
                                                    isLoading={
                                                        createResearchTypeMutationResult.loading
                                                        || findResearchTypeByCodeQueryResult.loading
                                                    }
                                                    type={"submit"}
                                                    colorScheme={"teal"}
                                                >
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
                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
