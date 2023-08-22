import React, {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";

import {
    Card,
    CardBody,
    CardHeader,
    Heading,
    IconButton,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";

import {useLazyQuery, useQuery} from "@apollo/client";
import {
    GET_RESEARCH_FILES_QUERY,
    LIST_RESEARCH_DOCUMENTS_QUERY
} from "@/apollo";

import {Research, ResearchFile} from "@/models";
import {ExternalLinkIcon} from "@chakra-ui/icons";
import {useBase64} from "@/hooks/base64";

export interface ResearchFilesCardProps {
    readonly research: Research
    readonly setResearch: Dispatch<SetStateAction<Research>>
}

export function ViewResearchFilesCard({research}: ResearchFilesCardProps) {
    const listResearchDocumentsQuery = useQuery(LIST_RESEARCH_DOCUMENTS_QUERY);
    const [getResearchFilesQuery, getResearchFilesQueryResult] = useLazyQuery(GET_RESEARCH_FILES_QUERY);

    const [files, setFiles] = useState<ResearchFile[]>([])
    const {fromBase64} = useBase64();

    useEffect(() => {
        if (getResearchFilesQueryResult.data?.getResearchFiles) {
            setFiles(getResearchFilesQueryResult.data?.getResearchFiles)
        }
    }, [listResearchDocumentsQuery, getResearchFilesQueryResult])

    useEffect(() => {
        if (research.id) {
            getResearchFilesQuery({
                variables: {
                    id: research.id
                }
            })
        }
    }, [getResearchFilesQuery, research])

    return (
        <Card>
            <CardHeader>
                <Heading size={"md"}>Arquivos</Heading>
            </CardHeader>
            <CardBody>
                <div className={"overflow-x-auto w-full max-w-full"}>
                    <Table className={"overflow-x-auto"}>
                        <Thead>
                            <Tr>
                                <Th>Tipo</Th>
                                <Th>Nome</Th>
                                <Th>Data</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                files?.map((file, index) => {
                                    return (
                                        <Tr key={file.name}>
                                            <Td>{file.type.name}</Td>
                                            <Td>{file.name}</Td>
                                            <Td>{new Date(file.createdAt).toLocaleDateString()}</Td>
                                            <Td className={"flex justify-end px-1"}>
                                                <div className={"flex gap-6 items-center"}>
                                                    <IconButton
                                                        onClick={() => {
                                                            if (file?.data) {
                                                                window.open(fromBase64(file.data), "_blank")
                                                            }
                                                        }}
                                                        variant={"unstyled"}
                                                        icon={<ExternalLinkIcon/>}
                                                        aria-label={""}/>
                                                </div>
                                            </Td>
                                        </Tr>
                                    )
                                })
                            }
                        </Tbody>
                    </Table>
                </div>
            </CardBody>
        </Card>

    )
}