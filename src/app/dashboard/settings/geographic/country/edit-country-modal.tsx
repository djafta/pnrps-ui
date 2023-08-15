import {FormEvent, useState} from "react";

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
    UseModalProps,
    useToast
} from "@chakra-ui/react";

import {Country} from "@/models";
import {useLazyQuery, useMutation} from "@apollo/client";
import {
    CREATE_REGION_MUTATION,
    FIND_COUNTRY_BY_CODE_QUERY,
    FIND_REGION_BY_CODE_QUERY,
    LIST_COUNTRIES_QUERY,
    UPDATE_COUNTRY_MUTATION,
} from "@/apollo";
import {RegionItem} from "@/app/dashboard/settings/geographic/country/region-item";

export interface EditCountryModalProps extends UseModalProps {
    readonly country: Country
}

export function EditCountryModal({isOpen, onClose, country}: EditCountryModalProps) {
    const toast = useToast();
    const [countryData, setCountryData] = useState<Country>(country);
    const [isInvalidRegionCode, setInvalidRegionCode] = useState(false);
    const [isInvalidCountryCode, setInvalidCountryCode] = useState(false);

    const [updateCountryMutation, updateCountryMutationResult] = useMutation(
        UPDATE_COUNTRY_MUTATION,
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

    async function handleUpdateCountryClick() {

        try {
            if (countryData?.code) {

                const {data} = await findCountryByCodeQuery({
                    variables: {
                        code: countryData?.code
                    }
                })

                if (data.findCountryByCode && data.findCountryByCode?.id !== country?.id) {
                    return setInvalidCountryCode(true);
                } else {
                    setInvalidCountryCode(false);
                }
            }

            await updateCountryMutation({
                variables: {
                    input: {
                        name: countryData?.name,
                        code: countryData?.code,
                        id: country?.id
                    }
                }
            })

            toast({
                title: "País Atualizado!",
                description: `País ${country?.name} atualizado com sucesso.`,
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

                await createRegionMutation({
                    variables: {
                        input: {
                            name,
                            code,
                            countryId: country?.id
                        }
                    }
                })

                toast({
                    title: "País Criado!",
                    description: `País ${name} criado com sucesso.`,
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading size={"sm"}>Editar País</Heading>
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
                                                    setCountryData({
                                                        ...countryData,
                                                        name: e.target.value
                                                    })
                                                }}
                                                defaultValue={country?.name}
                                                name={"name"}
                                                autoFocus={true}
                                                type={"text"}
                                            />
                                        </FormControl>
                                        <FormControl isRequired={true} isInvalid={isInvalidCountryCode}>
                                            <FormLabel>Código</FormLabel>
                                            <Input
                                                onChange={(e) => {
                                                    setCountryData({
                                                        ...countryData,
                                                        code: e.target.value
                                                    })
                                                }}
                                                defaultValue={country?.code}
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
                    <Card className={`${country ? "flex" : "hidden"}`}>
                        <CardHeader>
                            <p>Regiões</p>
                        </CardHeader>
                        <CardBody>
                            <Accordion allowMultiple={true}>
                                {country?.regions?.map((region) => {
                                    return (
                                        <RegionItem key={region.id} region={region}/>
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
                    <Button
                        isLoading={
                            findCountryByCodeQueryResult.loading
                            || updateCountryMutationResult.loading
                        }
                        type={"submit"}
                        colorScheme={"teal"}
                        className={`float-right`}
                        onClick={handleUpdateCountryClick}
                    >
                        Gravar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
