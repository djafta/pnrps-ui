import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Input,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    useDisclosure,
    useToast
} from "@chakra-ui/react";

import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {ResearchSubtype, ResearchType} from "@/models";
import {useLazyQuery, useMutation} from "@apollo/client";
import {FormEvent, useState} from "react";
import {IoRemove} from "react-icons/io5";

import {
    CREATE_RESEARCH_SUBTYPE_MUTATION,
    DELETE_RESEARCH_SUBTYPE_MUTATION, DELETE_RESEARCH_TYPE_MUTATION,
    FIND_RESEARCH_SUBTYPE_BY_CODE_QUERY, FIND_RESEARCH_TYPE_BY_CODE_QUERY,
    LIST_RESEARCH_CLASSIFICATIONS_QUERY,
    UPDATE_RESEARCH_TYPE_MUTATION
} from "@/apollo";

export interface TypeItemProps {
    type: ResearchType
}

export function TypeItem({type}: TypeItemProps) {
    const toast = useToast();
    const addSubtypePopoverDisclosure = useDisclosure();
    const updateTypePopoverDisclosure = useDisclosure();
    const [isInvalidSubtypeCode, setInvalidSubtypeCode] = useState(false);
    const [isInvalidTypeCode, setInvalidTypeCode] = useState(false);

    const [findResearchSubtypeByCodeQuery, findResearchSubtypeByCodeQueryResult] = useLazyQuery(
        FIND_RESEARCH_SUBTYPE_BY_CODE_QUERY,
        {
            fetchPolicy: "no-cache"
        }
    )

    const [deleteResearchSubtypeMutation, deleteResearchSubtypeMutationResult] = useMutation(
        DELETE_RESEARCH_SUBTYPE_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_CLASSIFICATIONS_QUERY]
        }
    )

    const [updateResearchTypeMutation, updateResearchTypeMutationResult] = useMutation(
        UPDATE_RESEARCH_TYPE_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_CLASSIFICATIONS_QUERY]
        }
    )

    const [deleteResearchTypeMutation, deleteResearchTypeMutationResult] = useMutation(
        DELETE_RESEARCH_TYPE_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_CLASSIFICATIONS_QUERY]
        }
    )

    const [findResearchTypeByCodeQuery, findResearchTypeByCodeQueryResult] = useLazyQuery(
        FIND_RESEARCH_TYPE_BY_CODE_QUERY,
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

            await createResearchSubtypeMutation({
                variables: {
                    input: {
                        name,
                        code,
                        researchTypeId: type.id
                    }
                }
            })

            toast({
                title: "Sub-tipo Criado!",
                description: `Sub-tipo ${name} criado com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })

            setTimeout(addSubtypePopoverDisclosure.onClose, 500);

        } catch (e) {
            console.log(e)
        }

        // Clear all form inputs after mutation
        target.querySelectorAll("input").forEach(input => input.value = "");
    }

    async function handleUpdateSubtypeFormSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const name = data.get("name") as string;
        const code = data.get("code") as string;

        try {
            const {data} = await findResearchTypeByCodeQuery({
                variables: {
                    code
                }
            })

            if (data.findResearchTypeByCode && data.findResearchTypeByCode.id !== type.id) {
                return setInvalidTypeCode(true);
            } else {
                setInvalidTypeCode(false);
            }

            await updateResearchTypeMutation({
                variables: {
                    input: {
                        name,
                        code,
                        id: type.id
                    }
                }
            })

            toast({
                title: "Tipo Atualizado!",
                description: `Tipo ${name} atualizado com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })

            setTimeout(updateTypePopoverDisclosure.onClose, 500);
        } catch (e) {
            console.log(e)
        }
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

        } catch (e) {
            console.log(e)
        }
    }

    async function handleDeleteTypeClick() {
        try {
            await deleteResearchTypeMutation({
                variables: {
                    id: type.id
                }
            })

            toast({
                title: "Tipo Apagado!",
                description: `Tipo ${name} foi apagado com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })

        } catch (e) {
            console.log(e)
        }
    }

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
                                        onSubmit={(e) => handleCreateSubtypeFormSubmit(e, type)}
                                    >
                                        <div className={"flex gap-2 flex-col"}>
                                            <FormControl isRequired={true}>
                                                <FormLabel>Nome</FormLabel>
                                                <Input name={"name"} autoFocus={true} type={"text"}/>
                                            </FormControl>
                                            <FormControl isRequired={true} isInvalid={isInvalidSubtypeCode}>
                                                <FormLabel>Código</FormLabel>
                                                <Input name={"code"} type={"text"}/>
                                                <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                            </FormControl>
                                            <Button type={"submit"} colorScheme={"teal"}>Adicionar</Button>
                                        </div>
                                    </form>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className={"float-right flex gap-2"}>
                        <Popover
                            isOpen={updateTypePopoverDisclosure.isOpen}
                            onOpen={updateTypePopoverDisclosure.onOpen}
                            onClose={updateTypePopoverDisclosure.onClose}
                            placement={"auto"}
                            isLazy={true}
                        >
                            <PopoverTrigger>
                                <IconButton
                                    aria-label={""}
                                    icon={<EditIcon/>}
                                    variant={"link"}
                                    colorScheme={"teal"}
                                    padding={2}
                                />
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverArrow/>
                                <PopoverCloseButton/>
                                <PopoverHeader>Editar Tipo</PopoverHeader>
                                <PopoverBody>
                                    <form onSubmit={handleUpdateSubtypeFormSubmit}>
                                        <div className={"flex gap-2 flex-col"}>
                                            <FormControl isRequired={true}>
                                                <FormLabel>Nome</FormLabel>
                                                <Input
                                                    name={"name"}
                                                    autoFocus={true}
                                                    type={"text"}
                                                    defaultValue={type.name}
                                                />
                                            </FormControl>
                                            <FormControl isRequired={true} isInvalid={isInvalidTypeCode}>
                                                <FormLabel>Código</FormLabel>
                                                <Input name={"code"} type={"text"} defaultValue={type.code}/>
                                                <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                            </FormControl>
                                            <Button
                                                type={"submit"}
                                                colorScheme={"teal"}
                                                isLoading={
                                                    updateResearchTypeMutationResult.loading
                                                    || findResearchTypeByCodeQueryResult.loading
                                                }
                                            >
                                                Gravar
                                            </Button>
                                        </div>
                                    </form>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                        <IconButton
                            aria-label={""}
                            icon={<DeleteIcon/>}
                            variant={"link"}
                            colorScheme={"teal"}
                            padding={2}
                            onClick={handleDeleteTypeClick}
                            isLoading={deleteResearchTypeMutationResult.loading}
                        />
                    </div>
                </div>
            </AccordionPanel>
        </AccordionItem>
    )
}
