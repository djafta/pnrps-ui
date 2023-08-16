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

import {useQuery} from "@apollo/client";
import {FinancingType} from "@/models";

import {fakeFinancingTypes} from "@/skelton-data";

import {LIST_FINANCING_TYPES_QUERY} from "@/apollo";
import {CreateFinancingTypeModal} from "@/app/dashboard/settings/financing/create-financing-type-modal";
import {FinancingTypeItem} from "@/app/dashboard/settings/financing/financing-type-item";

export function FinancingTypesSettings() {
    const createFinancingTypeModalDisclosure = useDisclosure();
    const [search, setSearch] = useState("");
    const [selects, setSelects] = useState<FinancingType[]>([]);
    const [financingTypes, setFinancingTypes] = useState<FinancingType[]>(fakeFinancingTypes);
    const listFinancingTypeQuery = useQuery(LIST_FINANCING_TYPES_QUERY);

    const filteredList: FinancingType[] = financingTypes.filter(financingType => financingType.name.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        if (listFinancingTypeQuery.data) {
            setFinancingTypes(listFinancingTypeQuery.data.listFinancingTypes)
        }
    }, [listFinancingTypeQuery])

    return (
        <>
            <CreateFinancingTypeModal
                isOpen={createFinancingTypeModalDisclosure.isOpen}
                onClose={createFinancingTypeModalDisclosure.onClose}
            />

            <Card width={"full"} overflow={"hidden"}>
                <CardHeader className={"bg-bar text-white p-2"}>
                    <div className={"flex justify-between items-center"}>
                        <Heading className={"font-medium flex-grow"} size={"sm"}>Tipos de Financiamentos</Heading>
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
                            <div className={"min-h-[26rem] max-h-[65vh]  overflow-y-auto"}>
                                <Accordion allowMultiple={true}>
                                    {
                                        (search.length > 0 ? filteredList : financingTypes).map((financingType) => {
                                            return (
                                                <FinancingTypeItem
                                                    key={financingType.id}
                                                    loading={listFinancingTypeQuery.loading || fakeFinancingTypes === financingTypes}
                                                    selects={selects}
                                                    setSelects={setSelects}
                                                    financingType={financingType}
                                                />
                                            )
                                        })
                                    }
                                </Accordion>
                            </div>
                            <div className={"flex items-center justify-between flex-row-reverse gap-2 transition-all"}>
                                <div className={"flex flex-row-reverse gap-2 transition-all"}>
                                    <IconButton
                                        onClick={createFinancingTypeModalDisclosure.onOpen}
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