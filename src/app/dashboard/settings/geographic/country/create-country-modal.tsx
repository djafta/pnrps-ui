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
    PopoverTrigger,
    useDisclosure,
    UseModalProps,
    useToast
} from "@chakra-ui/react";

import {IoRemove} from "react-icons/io5";
import {AddIcon} from "@chakra-ui/icons";

import {Country, Province, Region} from "@/models";
import {useLazyQuery, useMutation} from "@apollo/client";
import {
    CREATE_COUNTRY_MUTATION,
    CREATE_PROVINCE_MUTATION,
    CREATE_REGION_MUTATION,
    DELETE_PROVINCE_MUTATION,
    FIND_COUNTRY_BY_CODE_QUERY,
    FIND_PROVINCE_BY_CODE_QUERY,
    FIND_REGION_BY_CODE_QUERY,
    LIST_COUNTRIES_QUERY,
} from "@/apollo";

export function CreateCountryModal({isOpen, onClose}: UseModalProps) {
    const toast = useToast();
    const [country, setCountry] = useState<Country | null>(null);
    const [isInvalidCountryCode, setInvalidCountryCode] = useState(false);
    const [isInvalidRegionCode, setInvalidRegionCode] = useState(false);
    const [isInvalidProvinceCode, setInvalidProvinceCode] = useState(false);

    const addProvincePopoverDisclosure = useDisclosure();

    const [createCountryMutation, createCountryMutationResult] = useMutation(
        CREATE_COUNTRY_MUTATION,
        {
            refetchQueries: [LIST_COUNTRIES_QUERY]
        }
    )

    const [createRegionMutation, createRegionMutationResult] = useMutation(
        CREATE_REGION_MUTATION,
        {
            refetchQueries: [LIST_COUNTRIES_QUERY]
        }
    )

    const [findCountryByCodeQuery, findCountryByCodeQueryResult] = useLazyQuery(
        FIND_COUNTRY_BY_CODE_QUERY,
        {
            fetchPolicy: "no-cache"
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

    async function handleCreateCountryFormSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const name = data.get("name") as string;
        const code = data.get("code") as string;

        try {
            const {data} = await findCountryByCodeQuery({
                variables: {
                    code
                }
            })

            if (data.findCountryByCode) {
                return setInvalidCountryCode(true);
            } else {
                setInvalidCountryCode(false);
            }

            const result = await createCountryMutation({
                variables: {
                    input: {
                        name,
                        code
                    }
                }
            })

            setCountry(result.data.createCountry);

            toast({
                title: "País Criado!",
                description: `País ${name} criado com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })
        } catch (e) {
            console.log(e)
        }
    }

    async function handleCreateRegionFormSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const name = data.get("name") as string;
        const code = data.get("code") as string;

        if (country) {

            try {
                const {data} = await findRegionByCodeQuery({
                    variables: {
                        code
                    }
                })

                if (data.findRegionByCode) {
                    return setInvalidRegionCode(true);
                } else {
                    setInvalidRegionCode(false);
                }

                const result = await createRegionMutation({
                    variables: {
                        input: {
                            name,
                            code,
                            countryId: country.id
                        }
                    }
                })

                if (country.regions) {
                    setCountry({
                        ...country,
                        regions: [...country.regions, result.data.createRegion]
                    });
                } else {
                    setCountry({
                        ...country,
                        regions: [result.data.createRegion]
                    });
                }

                toast({
                    title: "Região Criada!",
                    description: `Região ${name} criada com sucesso.`,
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

    async function handleAddProvinceFormSubmit(e: FormEvent<HTMLFormElement>, region: Region) {
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

            if (data.findProvinceByCode) {
                return setInvalidProvinceCode(true);
            } else {
                setInvalidProvinceCode(false);
            }

            const result = await createProvinceMutation({
                variables: {
                    input: {
                        name,
                        code,
                        regionId: region.id
                    }
                }
            })

            const findCountryResult = await findCountryByCodeQuery({
                variables: {
                    code: country?.code
                }
            })

            setCountry(findCountryResult.data.findCountryByCode);

            toast({
                title: "Província Criada!",
                description: `Província ${name} criada com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })

            setTimeout(addProvincePopoverDisclosure.onClose, 1000);

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        setCountry(null);
    }, [isOpen])

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading size={"sm"}>Criar País</Heading>
                    <ModalCloseButton/>
                </ModalHeader>
                <ModalBody className={"flex flex-col gap-4"}>
                    <Card>
                        <CardBody>
                            <form onSubmit={handleCreateCountryFormSubmit}>
                                <div className={"flex flex-col gap-4"}>
                                    <div className={"flex gap-2 flex-col"}>
                                        <FormControl isRequired={true}>
                                            <FormLabel>Nome</FormLabel>
                                            <Input name={"name"} autoFocus={true} type={"text"}/>
                                        </FormControl>
                                        <FormControl isRequired={true} isInvalid={isInvalidCountryCode}>
                                            <FormLabel>Código</FormLabel>
                                            <Input name={"code"} type={"text"}/>
                                            <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                        </FormControl>
                                    </div>

                                    <Button
                                        isLoading={
                                            findCountryByCodeQueryResult.loading
                                            || createCountryMutationResult.loading
                                        }
                                        type={"submit"}
                                        colorScheme={"teal"}
                                        className={`${country ? "hidden" : "block"}`}
                                    >
                                        Criar
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                    <Card className={`${country ? "flex" : "hidden"}`}>
                        <CardHeader>
                            <p>Regiões</p>
                        </CardHeader>
                        <CardBody>
                            <Accordion allowMultiple={true}>
                                {country?.regions?.map((region) => {
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
                                                                        rounded={"full"}
                                                                        aria-label={""}
                                                                        icon={<IoRemove/>}
                                                                        onClick={() => handleDeleteProvinceClick(province)}
                                                                    />
                                                                </li>
                                                            )
                                                        })}
                                                    </ul>
                                                    <div className={"p-3"}>
                                                        <Popover
                                                            placement={"auto"}
                                                            isLazy={true}
                                                            isOpen={addProvincePopoverDisclosure.isOpen}
                                                            onClose={addProvincePopoverDisclosure.onClose}
                                                        >
                                                            <PopoverTrigger>
                                                                <IconButton
                                                                    className={"float-right"} aria-label={""}
                                                                    rounded={"full"}
                                                                    icon={<AddIcon/>}
                                                                    onClick={addProvincePopoverDisclosure.onOpen}
                                                                />
                                                            </PopoverTrigger>
                                                            <PopoverContent>
                                                                <PopoverArrow/>
                                                                <PopoverCloseButton/>
                                                                <PopoverHeader>Adicionar Província</PopoverHeader>
                                                                <PopoverBody>
                                                                    <form
                                                                        onSubmit={(e) => handleAddProvinceFormSubmit(e, region)}
                                                                    >
                                                                        <div className={"flex gap-2 flex-col"}>
                                                                            <FormControl isRequired={true}>
                                                                                <FormLabel>Nome</FormLabel>
                                                                                <Input
                                                                                    name={"name"}
                                                                                    autoFocus={true}
                                                                                    type={"text"}
                                                                                />
                                                                            </FormControl>
                                                                            <FormControl
                                                                                isRequired={true}
                                                                                isInvalid={isInvalidProvinceCode}
                                                                            >
                                                                                <FormLabel>Código</FormLabel>
                                                                                <Input name={"code"} type={"text"}/>
                                                                                <FormErrorMessage>
                                                                                    O código já foi usado
                                                                                </FormErrorMessage>
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
                    <Card className={`${country ? "flex" : "hidden"}`}>
                        <CardBody>
                            <Accordion allowToggle>
                                <AccordionItem border={"none"}>
                                    <AccordionButton className={"flex justify-between rounded-xl p-3"}>
                                        Adicionar Região
                                        <AccordionIcon/>
                                    </AccordionButton>
                                    <AccordionPanel>
                                        <form onSubmit={handleCreateRegionFormSubmit}>
                                            <div className={"flex flex-col gap-4"}>
                                                <div className={"flex gap-2 flex-col"}>
                                                    <FormControl isRequired={true}>
                                                        <FormLabel>Nome</FormLabel>
                                                        <Input name={"name"} autoFocus={true} type={"text"}/>
                                                    </FormControl>
                                                    <FormControl isRequired={true} isInvalid={isInvalidRegionCode}>
                                                        <FormLabel>Código</FormLabel>
                                                        <Input name={"code"} type={"text"}/>
                                                        <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                                    </FormControl>
                                                </div>
                                                <Button
                                                    isLoading={
                                                        createRegionMutationResult.loading
                                                        || findRegionByCodeQueryResult.loading
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
