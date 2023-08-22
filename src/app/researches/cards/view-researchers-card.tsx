import {
    Card,
    CardBody,
    CardHeader,
    Heading,
    Table,
    Tbody,
    Td,
    Thead,
    Tr,
} from "@chakra-ui/react";

import {Dispatch, SetStateAction, useEffect, useMemo} from "react";
import {Collaboration, Research} from "@/models";
import {useLazyQuery} from "@apollo/client";

import {GET_RESEARCH_COLLABORATIONS_QUERY} from "@/apollo";

export interface ResearchersCardProps {
    readonly research: Research
    readonly setResearch: Dispatch<SetStateAction<Research>>
}

export function ViewResearchersCard({research}: ResearchersCardProps) {
    const [getResearchCollaborationsQuery, getResearchCollaborationsQueryResult] = useLazyQuery(GET_RESEARCH_COLLABORATIONS_QUERY, {
        pollInterval: 1000 * 10, // 10 seconds
    });

    const collaborations = useMemo(() => {
        return (getResearchCollaborationsQueryResult.data?.getResearchCollaborations || []) as Collaboration[]
    }, [getResearchCollaborationsQueryResult])

    useEffect(() => {
        if (research.id) {
            getResearchCollaborationsQuery({
                variables: {
                    id: research.id
                }
            })
        }
    }, [getResearchCollaborationsQuery, research])

    return (
        <Card>
            <CardHeader>
                <Heading size={"md"}>Investigadores</Heading>
            </CardHeader>
            <CardBody>
                <div className={"flex flex-col gap-4"}>
                    <div className={"flex flex-col gap-4 overflow-y-auto max-h-80"}>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Td>Função</Td>
                                    <Td>Nome</Td>
                                    <Td>Email</Td>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    collaborations?.map((collaboration) => {
                                        return (
                                            <Tr key={collaboration.id}>
                                                <Td>{collaboration.role.name}</Td>
                                                <Td>
                                                    <div className={"flex gap-1 items-center"}>
                                                        <p>
                                                            {collaboration.researcher.firstName} {collaboration.researcher.lastName}
                                                        </p>
                                                    </div>
                                                </Td>
                                                <Td className={"flex px-1"}>
                                                    <a
                                                        className={"text-xs py-1 px-2 rounded-3xl bg-teal-700 text-white"}
                                                        href={`mailto:${collaboration.researcher?.email}`}>
                                                        {collaboration.researcher?.email}
                                                    </a>
                                                </Td>
                                            </Tr>
                                        )
                                    })
                                }
                            </Tbody>
                        </Table>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}