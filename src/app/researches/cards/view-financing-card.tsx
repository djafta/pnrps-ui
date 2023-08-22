import {
    Badge,
    Card,
    CardBody,
    CardHeader,
    FormLabel,
    Heading,
    Input,
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
} from "@chakra-ui/react";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Financier, Financing, FinancingType, Research} from "@/models";
import {useLazyQuery, useQuery} from "@apollo/client";
import {
    GET_RESEARCH_FINANCINGS_QUERY,
    LIST_FINANCIERS_QUERY,
    LIST_FINANCING_TYPES_QUERY
} from "@/apollo";
import {useDefault} from "@/hooks/default";

export interface FinancingCardProps {
    readonly research: Research
    readonly setResearch: Dispatch<SetStateAction<Research>>
}

export function ViewFinancingCard({research, setResearch}: FinancingCardProps) {
    const listFinanciersQuery = useQuery(LIST_FINANCIERS_QUERY);
    const listFinancingTypesQuery = useQuery(LIST_FINANCING_TYPES_QUERY);
    const [getResearchFinancingsQuery, getResearchFinancingsQueryResult] = useLazyQuery(GET_RESEARCH_FINANCINGS_QUERY);

    const [financiers, setFinanciers] = useState<Financier[]>([])
    const [financings, setFinancings] = useState<Financing[]>([])
    const [financingTypes, setFinancingTypes] = useState<FinancingType[]>([])

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
                                                isReadOnly={true}
                                                defaultValue={financings.find(financing => isDefault(financing.financier))?.amount}
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
                                                                    </Tr>
                                                                )
                                                            })
                                                    }
                                                </Tbody>
                                            </Table>
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
        </Card>
    )
}