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
import {Province, Region} from "@/models";
import {useLazyQuery, useMutation} from "@apollo/client";
import {FormEvent, useState} from "react";
import {IoRemove} from "react-icons/io5";

import {
    CREATE_PROVINCE_MUTATION,
    DELETE_PROVINCE_MUTATION,
    DELETE_REGION_MUTATION,
    FIND_PROVINCE_BY_CODE_QUERY,
    FIND_REGION_BY_CODE_QUERY,
    LIST_COUNTRIES_QUERY,
    UPDATE_REGION_MUTATION
} from "@/apollo";

export interface RegionItemProps {
    region: Region
}

export function RegionItem({region: region}: RegionItemProps) {
    const toast = useToast();
    const addProvincePopoverDisclosure = useDisclosure();
    const updateRegionPopoverDisclosure = useDisclosure();
    const [isInvalidProvinceCode, setInvalidProvinceCode] = useState(false);
    const [isInvalidRegionCode, setInvalidRegionCode] = useState(false);

    const [findProvinceByCodeQuery, findProvinceByCodeQueryResult] = useLazyQuery(
        FIND_PROVINCE_BY_CODE_QUERY,
        {
            fetchPolicy: "no-cache"
        }
    )

    const [deleteProvinceMutation, deleteProvinceMutationResult] = useMutation(
        DELETE_PROVINCE_MUTATION,
        {
            refetchQueries: [LIST_COUNTRIES_QUERY]
        }
    )

    const [updateRegionMutation, updateRegionMutationResult] = useMutation(
        UPDATE_REGION_MUTATION,
        {
            refetchQueries: [LIST_COUNTRIES_QUERY]
        }
    )

    const [deleteRegionMutation, deleteRegionMutationResult] = useMutation(
        DELETE_REGION_MUTATION,
        {
            refetchQueries: [LIST_COUNTRIES_QUERY]
        }
    )

    const [findRegionByCodeQuery, findRegionByCodeQueryResult] = useLazyQuery(
        FIND_REGION_BY_CODE_QUERY,
        {
            fetchPolicy: "no-cache"
        }
    )

    const [createProvinceMutation, createProvinceMutationResult] = useMutation(
        CREATE_PROVINCE_MUTATION,
        {
            refetchQueries: [LIST_COUNTRIES_QUERY]
        }
    )

    async function handleCreateProvinceFormSubmit(e: FormEvent, region: Region) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const name = data.get("name") as string;
        const code = data.get("code") as string;

        try {
            const {data} = await findProvinceByCodeQuery({
                variables: {
                    code
                }
            })

            if (data.findProvinceByCode) {
                return setInvalidProvinceCode(true);
            } else {
                setInvalidProvinceCode(false);
            }

            await createProvinceMutation({
                variables: {
                    input: {
                        name,
                        code,
                        regionId: region.id
                    }
                }
            })

            toast({
                title: "Província Criada!",
                description: `Província ${name} criada com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })

            setTimeout(addProvincePopoverDisclosure.onClose, 500);

        } catch (e) {
            console.log(e)
        }

        // Clear all form inputs after mutation
        target.querySelectorAll("input").forEach(input => input.value = "");
    }

    async function handleUpdateProvinceFormSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const name = data.get("name") as string;
        const code = data.get("code") as string;

        try {
            const {data} = await findRegionByCodeQuery({
                variables: {
                    code
                }
            })

            if (data.findRegionByCode && data.findRegionByCode.id !== region.id) {
                return setInvalidRegionCode(true);
            } else {
                setInvalidRegionCode(false);
            }

            await updateRegionMutation({
                variables: {
                    input: {
                        name,
                        code,
                        id: region.id
                    }
                }
            })

            toast({
                title: "Região Atualizada!",
                description: `Região ${name} atualizada com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })

            setTimeout(updateRegionPopoverDisclosure.onClose, 500);
        } catch (e) {
            console.log(e)
        }
    }

    async function handleDeleteProvinceClick(province: Province) {
        try {
            await deleteProvinceMutation({
                variables: {
                    id: province.id
                }
            })

            toast({
                title: "Província Apagada!",
                description: `Província ${province.name} foi apagada com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })

        } catch (e) {
            console.log(e)
        }
    }

    async function handleDeleteRegionClick() {
        try {
            await deleteRegionMutation({
                variables: {
                    id: region.id
                }
            })

            toast({
                title: "Região Apagado!",
                description: `Região ${region.name} foi apagado com sucesso.`,
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
            key={region.id}
            className={"border-none p-3 rounded-xl hover:bg-slate-100"}
        >
            <AccordionButton className={"hover:bg-transparent flex justify-between"}>
                {region.name}
                <AccordionIcon/>
            </AccordionButton>
            <AccordionPanel>
                <div className={"flex gap-2 flex-col justify-end"}>
                    <ul>
                        {region.provinces?.map((province) => {
                            return (
                                <li
                                    key={province.id}
                                    className={"flex justify-between items-center p-3 ps-4 rounded-xl hover:bg-slate-200"}
                                >
                                    {province.name}
                                    <IconButton
                                        isLoading={deleteProvinceMutationResult.loading}
                                        aria-label={""}
                                        onClick={() => handleDeleteProvinceClick(province)}
                                        rounded={"full"}
                                        icon={<IoRemove/>}
                                    />
                                </li>
                            )
                        })}
                    </ul>
                    <div className={"p-3"}>
                        <Popover
                            isOpen={addProvincePopoverDisclosure.isOpen}
                            onOpen={addProvincePopoverDisclosure.onOpen}
                            onClose={addProvincePopoverDisclosure.onClose}
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
                                <PopoverHeader>Adicionar Província</PopoverHeader>
                                <PopoverBody>
                                    <form
                                        onSubmit={(e) => handleCreateProvinceFormSubmit(e, region)}
                                    >
                                        <div className={"flex gap-2 flex-col"}>
                                            <FormControl isRequired={true}>
                                                <FormLabel>Nome</FormLabel>
                                                <Input name={"name"} autoFocus={true} type={"text"}/>
                                            </FormControl>
                                            <FormControl isRequired={true} isInvalid={isInvalidProvinceCode}>
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
                            isOpen={updateRegionPopoverDisclosure.isOpen}
                            onOpen={updateRegionPopoverDisclosure.onOpen}
                            onClose={updateRegionPopoverDisclosure.onClose}
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
                                <PopoverHeader>Editar Região</PopoverHeader>
                                <PopoverBody>
                                    <form onSubmit={handleUpdateProvinceFormSubmit}>
                                        <div className={"flex gap-2 flex-col"}>
                                            <FormControl isRequired={true}>
                                                <FormLabel>Nome</FormLabel>
                                                <Input
                                                    name={"name"}
                                                    autoFocus={true}
                                                    type={"text"}
                                                    defaultValue={region.name}
                                                />
                                            </FormControl>
                                            <FormControl isRequired={true} isInvalid={isInvalidRegionCode}>
                                                <FormLabel>Código</FormLabel>
                                                <Input name={"code"} type={"text"} defaultValue={region.code}/>
                                                <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                            </FormControl>
                                            <Button
                                                type={"submit"}
                                                colorScheme={"teal"}
                                                isLoading={
                                                    updateRegionMutationResult.loading
                                                    || findRegionByCodeQueryResult.loading
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
                            onClick={handleDeleteRegionClick}
                            isLoading={deleteRegionMutationResult.loading}
                        />
                    </div>
                </div>
            </AccordionPanel>
        </AccordionItem>
    )
}
