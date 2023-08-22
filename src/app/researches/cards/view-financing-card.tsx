import {
    Badge,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    FormLabel,
    Heading,
    IconButton,
    Input,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Select,
    Tab,
    Table,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useToast
} from "@chakra-ui/react";
import React, {Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useState} from "react";
import {Financier, Financing, FinancingType, Research} from "@/models";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {
    GET_RESEARCH_FINANCINGS_QUERY,
    LIST_FINANCIERS_QUERY,
    LIST_FINANCING_TYPES_QUERY, UPDATE_RESEARCH_FINANCING_MUTATION
} from "@/apollo";
import {AddIcon, CloseIcon} from "@chakra-ui/icons";
import {useDefault} from "@/hooks/default";

export interface FinancingCardProps {
    readonly research: Research
    readonly setResearch: Dispatch<SetStateAction<Research>>
}

export function ViewFinancingCard({research, setResearch}: FinancingCardProps) {
    const listFinanciersQuery = useQuery(LIST_FINANCIERS_QUERY);
    const listFinancingTypesQuery = useQuery(LIST_FINANCING_TYPES_QUERY);
    const [getResearchFinancingsQuery, getResearchFinancingsQueryResult] = useLazyQuery(GET_RESEARCH_FINANCINGS_QUERY);
    const [updateResearchFinancingMutation, updateResearchFinancingMutationResult] = useMutation(UPDATE_RESEARCH_FINANCING_MUTATION);

    const [financiers, setFinanciers] = useState<Financier[]>([])
    const [financings, setFinancings] = useState<Financing[]>([])
    const [financingTypes, setFinancingTypes] = useState<FinancingType[]>([])
    const toast = useToast();

    const {isDefault} = useDefault();

    useEffect(() => {
        if (listFinanciersQuery.data?.listFinanciers) {
            setFinanciers(listFinanciersQuery.data?.listFinanciers)
        }
        if (listFinancingTypesQuery.data?.listFinancingTypes) {
            setFinancingTypes(listFinancingTypesQuery.data?.listFinancingTypes)
        }
        if (getResearchFinancingsQueryResult.data?.getResearchFinancings) {
            setFinancings(getResearchFinancingsQueryResult.data.getResearchFinancings)
        }
    }, [
        listFinanciersQuery,
        listFinancingTypesQuery,
        getResearchFinancingsQueryResult
    ])

    useEffect(() => {
        if (research.id) {
            getResearchFinancingsQuery({
                variables: {
                    id: research.id
                }
            })
        }
    }, [research, getResearchFinancingsQuery])

    const handleAddFinancingSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement
        const data = new FormData(target)
        const amount = Number(data.get("amount"))
        const financier = String(data.get("financier"))
        const financing = String(data.get("financing"))

        setFinancings(financings => [
            ...financings,
            {
                amount,
                financier: financiers.find(f => f.id === financier) as Financier,
                type: financingTypes.find(f => f.id === financing) as FinancingType,
            }
        ])

        target.querySelector("input")!.value = ""
    }, [financiers, financingTypes])

    const handleSaveButtonClick = useCallback(async () => {
        await updateResearchFinancingMutation({
            variables: {
                input: {
                    financings: financings.map((financing => {
                        return {
                            id: financing.id,
                            amount: financing.amount,
                            researchId: research.id,
                            financierId: financing.financier.id,
                            financingTypeId: financing.type?.id
                        }
                    }))
                }
            }
        })

        toast({
            title: "Pesquisa atualizada!",
            description: `Financiamento da pesquisa atualizado com sucesso`,
            status: "success",
            isClosable: true,
            position: "top",
            colorScheme: "teal",
        })
    }, [financings, research, toast, updateResearchFinancingMutation])

    return (
        <Card colorScheme={"green"}>
            <CardHeader>
                <Heading size={"md"}>Financiamento</Heading>
            </CardHeader>
            <CardBody>
                <div>
                    <div className={"grid grid-rows-1"}>
                        <div>
                            <Tabs variant='enclosed'>
                                <TabList>
                                    <Tab>Receita Própria</Tab>
                                    <Tab>Financiadores</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <div>
                                            <FormLabel className={"text-sm"}>Valor</FormLabel>
                                            <Input
                                                defaultValue={financings.find(financing => isDefault(financing.financier))?.amount}
                                                onChange={(e) => {
                                                    let financing = financings.find(financing => isDefault(financing.financier))
                                                    if (!financing) {
                                                        financing = {
                                                            amount: 0,
                                                            financier: financiers.find(financier => isDefault(financier)) as Financier
                                                        }
                                                    }
                                                    // @ts-ignore
                                                    setFinancings(financings => [
                                                        ...financings.filter(financing => !isDefault(financing.financier)),
                                                        {
                                                            ...financing,
                                                            amount: Number(e.target.value)
                                                        }
                                                    ])
                                                }}
                                                type={"number"}
                                            />
                                        </div>
                                    </TabPanel>
                                    <TabPanel>
                                        <div>
                                            <Table>
                                                <Thead>
                                                    <Tr>
                                                        <Th>Tipo</Th>
                                                        <Th>Financiador</Th>
                                                        <Th>Montante</Th>
                                                        <Th></Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {
                                                        financings
                                                            .filter((financing) => !!financing.type)
                                                            .map((financing, index) => {
                                                                return (
                                                                    <Tr key={financing.financier.id}>
                                                                        <Td>{financing.type!.name}</Td>
                                                                        <Td>{financing.financier.name}</Td>
                                                                        <Td>{financing.amount}</Td>
                                                                        <Td className={"flex justify-end px-1"}>
                                                                            <IconButton
                                                                                onClick={() => {
                                                                                    setFinancings(
                                                                                        financings => [
                                                                                            ...financings.filter(f => f !== financing)
                                                                                        ]
                                                                                    )
                                                                                }}
                                                                                size={"xs"}
                                                                                variant={"unstyled"}
                                                                                icon={<CloseIcon/>}
                                                                                aria-label={""}
                                                                            />
                                                                        </Td>
                                                                    </Tr>
                                                                )
                                                            })
                                                    }
                                                </Tbody>
                                            </Table>
                                        </div>
                                        <div className={"flex justify-end mt-5"}>
                                            <Popover>
                                                <PopoverTrigger>
                                                    <IconButton
                                                        colorScheme={"teal"}
                                                        variant={"outline"}
                                                        icon={<AddIcon/>}
                                                        aria-label={""}
                                                    />
                                                </PopoverTrigger>
                                                <PopoverContent className={"sm:w-[500px]"}>
                                                    <PopoverArrow/>
                                                    <PopoverBody>
                                                        <form
                                                            onSubmit={handleAddFinancingSubmit}
                                                            className={"grid grid-rows-3 gap-4"}
                                                        >
                                                            <div>
                                                                <FormLabel className={"text-sm"}>
                                                                    Tipo de financiamento
                                                                </FormLabel>
                                                                <Select name={"financing"}>
                                                                    {
                                                                        financingTypes.map((financingType) => {
                                                                            return (
                                                                                <option value={financingType.id}
                                                                                        key={financingType.id}>
                                                                                    {financingType.name}
                                                                                </option>
                                                                            )
                                                                        })
                                                                    }
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <FormLabel className={"text-sm"}>Financiador</FormLabel>
                                                                <Select name={"financier"}>
                                                                    {
                                                                        financiers
                                                                            .filter(f => !financings.find((financing =>
                                                                                    f.id === financing.financier?.id
                                                                            )) && !isDefault(f))
                                                                            .map((financier) => {
                                                                                return (
                                                                                    <option value={financier.id}
                                                                                            key={financier.id}>
                                                                                        {financier.name}
                                                                                    </option>
                                                                                )
                                                                            })
                                                                    }
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <FormLabel className={"text-sm"}>Valor</FormLabel>
                                                                <Input name={"amount"} type={"number"}/>
                                                            </div>
                                                            <div>
                                                                <Button
                                                                    width={"full"}
                                                                    colorScheme={"teal"}
                                                                    type={"submit"}
                                                                >Adicionar</Button>
                                                            </div>
                                                        </form>
                                                    </PopoverBody>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </div>
                        <div className={"p-4"}>
                            <p>Total
                                <Badge marginStart={2}>
                                    {
                                        financings.length ?
                                            financings.map(financing => financing.amount)
                                                .reduce((previousValue, currentValue) => previousValue + currentValue)
                                            : 0
                                    }
                                </Badge>
                            </p>
                        </div>
                    </div>
                </div>
            </CardBody>
            <CardFooter>
                <div className={"flex justify-end w-full"}>
                    <Button
                        isLoading={updateResearchFinancingMutationResult.loading}
                        onClick={handleSaveButtonClick}
                        colorScheme={"teal"}>Guardar</Button>
                </div>
            </CardFooter>
        </Card>
    )
}