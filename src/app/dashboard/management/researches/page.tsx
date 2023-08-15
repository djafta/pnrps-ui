"use client"

import {useAuth} from "@/hooks/auth";
import {EditResearchModal} from "@/app/dashboard/management/researches/edit-research-modal";
import {CreateResearchModal} from "@/app/dashboard/management/researches/create-research-modal";
import {
    Button,
    Card,
    FormControl,
    Input,
    Switch,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tooltip,
    Tr,
    useDisclosure
} from "@chakra-ui/react";

import {LIST_RESEARCHES_QUERY} from "@/apollo";
import {useEffect, useState} from "react";
import {useQuery} from "@apollo/client";
import {Research} from "@/models";

export default function ResearchManagement() {
    const createResearchModalDisclosure = useDisclosure();
    const editResearchModalDisclosure = useDisclosure();
    const [research, setResearch] = useState<Research | null>(null);
    const [researches, setResearches] = useState<Research[]>([])

    const listResearchesQuery = useQuery(LIST_RESEARCHES_QUERY, {
        pollInterval: 1000 * 30 // 30 seconds
    })
    const {isAuthorized} = useAuth()

    useEffect(() => {
        if (listResearchesQuery.data?.listResearches) {
            setResearches(listResearchesQuery.data?.listResearches)
        }
    }, [listResearchesQuery, setResearches])

    function handleResearchRowClick(research: Research | undefined) {
        if (research) {
            setResearch(research)
            editResearchModalDisclosure.onOpen()
        }
    }

    useEffect(() => {
        setResearch(research => researches.find((r) => research?.id === r.id) as Research)
    }, [researches])

    return (
        <main className={"pt-24 flex flex-col gap-10 lg:ps-16"}>
            <EditResearchModal
                isOpen={editResearchModalDisclosure.isOpen}
                onClose={editResearchModalDisclosure.onClose}
                research={research}
            />
            <CreateResearchModal
                isOpen={createResearchModalDisclosure.isOpen}
                onClose={createResearchModalDisclosure.onClose}
            />
            <div className={"p-2 flex flex-col gap-2"}>
                <div className={"flex justify-end"}>
                    {
                        isAuthorized("create:research:self") &&
                        <Button colorScheme={"teal"} onClick={createResearchModalDisclosure.onOpen}>
                            Criar Pesquisa
                        </Button>
                    }
                </div>
                <Card>
                    <div className={"p-2"}>
                        <FormControl className={"flex flex-col md:flex-row gap-4"}>
                            <div>
                                <Input type={"search"}/>
                            </div>
                            <div className={"flex gap-4 flex-col md:items-center md:flex-row whitespace-nowrap"}>
                                <Tooltip placement={"auto"} hasArrow={true} label={"Mostrar pesquisas validadas"}>
                                    <div>
                                        <Switch colorScheme={"teal"} className={"flex items-center"}>
                                            Pesquisas Validadas
                                        </Switch>
                                    </div>
                                </Tooltip>
                                <Tooltip placement={"auto"} hasArrow={true} label={"Mostrar pesquisas autorizadas"}>
                                    <div>
                                        <Switch colorScheme={"teal"} className={"flex items-center"}>
                                            Pesquisas Autorizadas
                                        </Switch>
                                    </div>
                                </Tooltip>
                            </div>
                        </FormControl>
                        <div>

                        </div>
                    </div>
                    <TableContainer>
                        <Table variant={"simple"} colorScheme={"teal"}>
                            <TableCaption>Pesquisas</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Acronimo</Th>
                                    <Th>Titulo</Th>
                                    <Th>Tipo</Th>
                                    <Th>Area</Th>
                                    <Th>Estado</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {researches.map((research) => {
                                    return (
                                        <Tr key={research.id} onClick={() => handleResearchRowClick(research)}
                                            className={"hover:bg-teal-500 hover:text-white cursor-pointer transition-colors"}>
                                            <Td>{research.acronym}</Td>
                                            <Td>{research.title}</Td>
                                            <Td>{research.subtype?.name}</Td>
                                            <Td>{research.subfield?.name}</Td>
                                            <Td>{research.acronym}</Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Card>
            </div>
        </main>
    )
}
