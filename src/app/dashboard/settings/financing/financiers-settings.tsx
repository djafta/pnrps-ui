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
    Input,
    Tooltip, useDisclosure
} from "@chakra-ui/react";

import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {AiOutlineSearch} from "react-icons/ai";
import {fakeFinanciers} from "@/skelton-data";

import {useQuery} from "@apollo/client";
import {LIST_FINANCIERS_QUERY} from "@/apollo";
import {FinancierItem} from "@/app/dashboard/settings/financing/financier-item";
import {CreateFinancierModal} from "@/app/dashboard/settings/financing/create-financier-modal";
import {Financier} from "@/models";

export function FinanciersSettings() {
    const createFinancierModalDisclosure = useDisclosure();
    const [search, setSearch] = useState("");
    const [selects, setSelects] = useState<Financier[]>([]);
    const [financiers, setFinanciers] = useState<Financier[]>(fakeFinanciers);
    const listFinanciersQuery = useQuery(LIST_FINANCIERS_QUERY);

    const filteredList: Financier[] = financiers.filter(financier => financier.name.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        if (listFinanciersQuery.data) {
            setFinanciers(listFinanciersQuery.data.listFinanciers)
        }
    }, [listFinanciersQuery])

    return (
        <>
            <CreateFinancierModal
                isOpen={createFinancierModalDisclosure.isOpen}
                onClose={createFinancierModalDisclosure.onClose}
            />

            <Card width={"full"} overflow={"hidden"}>
                <CardHeader className={"bg-bar text-white p-2"}>
                    <div className={"flex justify-between items-center"}>
                        <Heading className={"font-medium flex-grow"} size={"sm"}>Financiadores</Heading>
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
                <CardBody>
                    <div className={"w-full flex"}>
                        <div className={"flex w-full gap-4 flex-col"}>
                            <div>
                                <Accordion allowMultiple={true}>
                                    {
                                        (search.length > 0 ? filteredList : financiers).map((financier) => {
                                            return (
                                                <FinancierItem
                                                    key={financier.id}
                                                    loading={listFinanciersQuery.loading || fakeFinanciers === financiers}
                                                    selects={selects}
                                                    setSelects={setSelects}
                                                    financier={financier}
                                                />
                                            )
                                        })
                                    }
                                </Accordion>
                            </div>
                            <div className={"flex items-center justify-between flex-row-reverse gap-2 transition-all"}>
                                <div className={"flex flex-row-reverse gap-2 transition-all"}>
                                    <IconButton
                                        onClick={createFinancierModalDisclosure.onOpen}
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
                                    />
                                    <IconButton
                                        className={`${selects.length == 1 ? "visible" : "invisible"}`}
                                        icon={<EditIcon/>}
                                        aria-label={""}
                                        colorScheme={"teal"}
                                        variant={"outline"}
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