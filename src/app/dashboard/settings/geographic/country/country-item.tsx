import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Checkbox,
    IconButton,
    Skeleton, useDisclosure, useToast
} from "@chakra-ui/react";
import {DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {Country} from "@/models";
import {Dispatch, SetStateAction} from "react";
import {useMutation} from "@apollo/client";
import {DELETE_COUNTRY_MUTATION, LIST_COUNTRIES_QUERY} from "@/apollo";
import {DeleteAlertDialog} from "@/components/delete-alert-dialog";
import {EditCountryModal} from "@/app/dashboard/settings/geographic/country/edit-country-modal";


export interface CountryItemProps {
    country: Country
    loading: boolean
    selects: Country[]
    setSelects: Dispatch<SetStateAction<Country[]>>
}

export function CountryItem({country, loading, setSelects, selects}: CountryItemProps) {
    const toast = useToast();
    const [deleteCountryMutation, deleteCountryMutationResult] = useMutation(
        DELETE_COUNTRY_MUTATION,
        {
            refetchQueries: [LIST_COUNTRIES_QUERY]
        }
    )
    const deleteAlertDialogDisclosure = useDisclosure();
    const editCountryModalDisclosure = useDisclosure();

    async function handleDeleteCountryButtonClick() {
        await deleteCountryMutation({
            variables: {
                id: country.id
            }
        })

        toast({
            title: "País Apagado!",
            description: `País ${country.name} apagado com sucesso.`,
            status: "success",
            isClosable: true,
            position: "top",
            colorScheme: "teal",
        })
    }

    return (
        <>
            <EditCountryModal
                country={country}
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
            <AccordionItem key={country?.id}>
                <div className={"flex gap-1 items-center"}>
                    <Skeleton maxHeight={"1rem"} isLoaded={!loading}>
                        <Checkbox
                            isChecked={selects.includes(country)}
                            onChange={() => {
                                if (selects.includes(country)) {
                                    setSelects(selects.filter(selected => selected.id !== country.id))
                                } else {
                                    setSelects(selects => [...selects, country])
                                }
                            }}
                        />
                    </Skeleton>
                    <Skeleton className={"w-full"} isLoaded={!loading}>
                        <div className={"w-full flex"}>
                            <AccordionButton className={"flex w-full justify-between p-4"}>
                                {country?.name}
                                <AccordionIcon/>
                            </AccordionButton>
                        </div>
                    </Skeleton>
                </div>
                <AccordionPanel className={"ps-8 pe-0"}>
                    <div className={"flex flex-col justify-end"}>
                        <Accordion allowMultiple={true}>
                            {country.regions?.map((region) => {
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
                                            <div className={"flex flex-col justify-end"}>
                                                <ul>
                                                    {region.provinces?.map((province) => {
                                                        return (
                                                            <li
                                                                key={province.id}
                                                                className={"flex justify-between items-center p-3 ps-4 rounded-xl hover:bg-slate-200"}
                                                            >
                                                                {province.name}
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        </AccordionPanel>
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
                    </div>
                    <div className={"float-right flex gap-2 p-1"}>
                        <IconButton
                            onClick={editCountryModalDisclosure.onOpen}
                            aria-label={""}
                            icon={<EditIcon/>}
                            variant={"link"}
                            colorScheme={"teal"}
                            padding={2}
                        />
                        <IconButton
                            aria-label={""}
                            icon={<DeleteIcon/>}
                            variant={"link"}
                            colorScheme={"teal"}
                            padding={2}
                            onClick={deleteAlertDialogDisclosure.onOpen}
                        />
                    </div>
                </AccordionPanel>
            </AccordionItem>
        </>
    )
}