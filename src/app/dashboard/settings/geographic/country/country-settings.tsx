import {useEffect, useState} from "react";

import {
    Accordion,
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Input, ToastId,
    Tooltip, useDisclosure, useToast
} from "@chakra-ui/react";

import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {AiOutlineSearch} from "react-icons/ai";

import {useMutation, useQuery} from "@apollo/client";
import {Country} from "@/models";

import {fakeCountries} from "@/skelton-data";

import {DELETE_COUNTRY_MUTATION, LIST_COUNTRIES_QUERY} from "@/apollo";
import {CreateCountryModal} from "@/app/dashboard/settings/geographic/country/create-country-modal";
import {CountryItem} from "@/app/dashboard/settings/geographic/country/country-item";
import {DeleteAlertDialog} from "@/components/delete-alert-dialog";
import {EditCountryModal} from "@/app/dashboard/settings/geographic/country/edit-country-modal";

export function CountrySettings() {
    const toast = useToast();
    const createCountryModalDisclosure = useDisclosure();
    const deleteAlertDialogDisclosure = useDisclosure();
    const editCountryModalDisclosure = useDisclosure();
    const [search, setSearch] = useState("");
    const [selects, setSelects] = useState<Country[]>([]);
    const [countries, setCountries] = useState<Country[]>(fakeCountries);
    const listResearchCountriesQuery = useQuery(LIST_COUNTRIES_QUERY);
    const [deleteCountryMutation, deleteCountryMutationResult] = useMutation(
        DELETE_COUNTRY_MUTATION,
        {
            refetchQueries: [LIST_COUNTRIES_QUERY]
        }
    )
    const filteredList: Country[] = countries.filter(country => country.name.toLowerCase().includes(search.toLowerCase()));

    async function handleDeleteCountryButtonClick() {
        let toastId: ToastId | null = null

        for (let country of selects) {

            await deleteCountryMutation({
                variables: {
                    id: country.id
                }
            })

            if (toastId) {
                toast.update(toastId, {
                    title: "País Apagado!",
                    description: `País ${country.name} apagado com sucesso.`,
                    status: "success",
                    isClosable: true,
                    position: "top",
                    colorScheme: "teal",
                })
            } else {
                toastId = toast({
                    title: "País Apagado!",
                    description: `País ${country.name} apagado com sucesso.`,
                    status: "success",
                    isClosable: true,
                    position: "top",
                    colorScheme: "teal",
                })
            }
        }

        deleteAlertDialogDisclosure.onClose()
    }

    useEffect(() => {
        if (listResearchCountriesQuery.data) {
            setCountries(listResearchCountriesQuery.data.listCountries)

            setSelects(selects => countries.filter((country) => {
                return selects.find(select => select.id === country.id)
            }))
        }
    }, [listResearchCountriesQuery])

    return (
        <>
            <CreateCountryModal
                isOpen={createCountryModalDisclosure.isOpen}
                onClose={createCountryModalDisclosure.onClose}
            />
            <EditCountryModal
                country={selects[0]}
                isOpen={editCountryModalDisclosure.isOpen}
                onClose={editCountryModalDisclosure.onClose}
            />
            <DeleteAlertDialog
                title={"Apagar País"}
                description={"Tem certeza que deseja apagar o país?"}
                onConfirm={handleDeleteCountryButtonClick}
                isOpen={deleteAlertDialogDisclosure.isOpen}
                onClose={deleteAlertDialogDisclosure.onClose}
            />
            <Card className={"w-full overflow-hidden"}>
                <CardHeader className={"bg-bar text-white p-2"}>
                    <div className={"flex justify-between items-center"}>
                        <Heading className={"font-medium flex-grow"} size={"sm"}>Paises</Heading>
                        <FormControl
                            className={`
                            flex max-w-[20rem] items-center my-auto rounded-lg bg-transparent focus-within:bg-white 
                            overflow-hidden transition-colors`
                            }
                        >
                            <Input
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                                variant={"unstyled"}
                                className={"p-2 min-w-0 text-gray-500 appearance-none outline-none bg-transparent"}
                                type={"text"}
                            />

                            <Tooltip colorScheme={"teal"} placement={"auto-end"} label={"Clique para procurar"}>
                                <FormLabel className={"h-full"}>
                                    <AiOutlineSearch className={"text-lg mt-2 fill-gray-400"}/>
                                </FormLabel>
                            </Tooltip>
                        </FormControl>
                    </div>
                </CardHeader>
                <CardBody className={"flex"}>
                    <div className={"w-full flex-1 flex"}>
                        <div className={"flex flex-1 w-full gap-4 flex-col justify-between"}>
                            <div className={"min-h-[30rem] max-h-[65vh]  overflow-y-auto"}>
                                <Accordion allowMultiple={true}>
                                    {
                                        (search.length > 0 ? filteredList : countries).map((country) => {
                                            return (
                                                <CountryItem
                                                    key={country.id}
                                                    loading={listResearchCountriesQuery.loading || fakeCountries === countries}
                                                    selects={selects}
                                                    setSelects={setSelects}
                                                    country={country}
                                                />
                                            )
                                        })
                                    }
                                </Accordion>
                            </div>
                            <div className={"flex items-center justify-between flex-row-reverse gap-2 transition-all"}>
                                <div className={"flex flex-row-reverse gap-2 transition-all"}>
                                    <IconButton
                                        onClick={createCountryModalDisclosure.onOpen}
                                        aria-label={""}
                                        icon={<AddIcon/>}
                                        colorScheme={"teal"}
                                    />
                                    <IconButton
                                        className={`${selects.length > 0 ? "visible" : "invisible"}`}
                                        colorScheme={"teal"}
                                        aria-label={""}
                                        icon={<DeleteIcon/>}
                                        variant={"outline"}
                                        onClick={deleteAlertDialogDisclosure.onOpen}
                                    />
                                    <IconButton
                                        className={`${selects.length == 1 ? "visible" : "invisible"}`}
                                        icon={<EditIcon/>}
                                        aria-label={""}
                                        colorScheme={"teal"}
                                        variant={"outline"}
                                        onClick={editCountryModalDisclosure.onOpen}
                                    />
                                </div>
                                <p className={`text-gray-400 text-sm ${selects.length > 0 ? "block" : "hidden"}`}>
                                    {selects.length} items selecionados
                                </p>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    )
}