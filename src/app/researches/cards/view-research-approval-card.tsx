import {
    Badge,
    Box,
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Input,
    Skeleton,
    Text,
} from "@chakra-ui/react";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Organization, Research, ResearchApproval} from "@/models";
import {Autocomplete, Option} from "chakra-ui-simple-autocomplete";
import {useLazyQuery, useQuery} from "@apollo/client";
import {
    GET_RESEARCH_APPROVAL_QUERY,
    LIST_ETHIC_COMMITTEES,
} from "@/apollo";
import {ExternalLinkIcon} from "@chakra-ui/icons";
import {useBase64} from "@/hooks/base64";

export interface ResearchApprovalCardProps {
    readonly research: Research
    readonly setResearch: Dispatch<SetStateAction<Research>>
}

export function ViewResearchApprovalCard({research, setResearch}: ResearchApprovalCardProps) {
    const [approval, setApproval] = useState<ResearchApproval>({} as ResearchApproval);
    const [result, setResult] = useState<Option[]>([]);
    const [options, setOptions] = useState<Option[]>([]);
    const [getResearchApprovalQuery, getResearchApprovalQueryResult] = useLazyQuery(GET_RESEARCH_APPROVAL_QUERY)
    const listEtcCommittees = useQuery(LIST_ETHIC_COMMITTEES, {
        pollInterval: 1000 * 10
    });

    const {fromBase64} = useBase64();


    useEffect(() => {
        if (listEtcCommittees.data?.listEthicCommittees) {
            setOptions(listEtcCommittees.data.listEthicCommittees?.map((committee: any) => {
                return {
                    value: committee.id,
                    label: committee.name,
                }
            }))
        }
    }, [listEtcCommittees])

    useEffect(() => {
        if (getResearchApprovalQueryResult.data?.getResearchApproval) {
            const approval = getResearchApprovalQueryResult.data.getResearchApproval
            setApproval(approval)
            setResult(approval.committees.map(({id, name}: Organization) => {
                return {
                    value: id,
                    label: name
                }
            }))
        }
    }, [getResearchApprovalQueryResult])

    useEffect(() => {
        if (research.id) {
            getResearchApprovalQuery({
                variables: {
                    id: research.id
                }
            })
        }
    }, [research, getResearchApprovalQuery])

    return (
        <Card>
            <CardHeader>
                <Heading size={"md"}>Aprovação Ética</Heading>
            </CardHeader>
            <CardBody>
                <div>
                    <div className={"flex flex-col gap-4"}>
                        <div
                            className={"gap-4 grid grid-rows-2 md:grid-cols-2 md:grid-rows-none"}>
                            <div>
                                <FormLabel className={"text-sm"}>Código de aprovação</FormLabel>
                                <Input
                                    isReadOnly={true}
                                    defaultValue={approval.code}
                                    type={"text"}/>
                            </div>
                            <FormControl>
                                <FormLabel className={"text-sm"}>Documento Aprovação ética</FormLabel>
                                <div className={"relative z-50 flex border rounded-lg overflow-hidden"}>
                                    <Input
                                        disabled={true}
                                        border={"none"}
                                        appearance={"none"}
                                        className={"text-transparent bg-transparent"}
                                        type={"file"}
                                        name={"file"}
                                        title={approval.file ? approval.file.name : "Selecione um arquivo"}
                                    />
                                    <IconButton
                                        onClick={() => {
                                            if (approval.file?.data) {
                                                window.open(fromBase64(approval.file.data), "_blank")
                                            }
                                        }}
                                        icon={<ExternalLinkIcon/>}
                                        aria-label={""}/>
                                    <Text className={"absolute -z-10 left-12 top-2"}>
                                        {approval.file ? approval.file.name : "Selecione um arquivo"}
                                    </Text>
                                </div>
                            </FormControl>
                        </div>
                        <div>
                            <FormLabel className={"text-sm"}>Comité de Ética</FormLabel>
                            <Skeleton isLoaded={!!options.length}>
                                <Box className={"border rounded flex w-full flex-col p-2 focus-within:border-blue-600"}>
                                    <Autocomplete
                                        isReadOnly={true}
                                        className={"outline-none w-full flex flex-col"}
                                        renderBadge={(option) => {
                                            return (
                                                <Badge className={"flex items-center m-1 gap-2 px-3 py-2 rounded-2xl"}>
                                                    {option.label}
                                                </Badge>
                                            )
                                        }}
                                        options={options}
                                        result={result}
                                        setResult={() => {
                                        }}
                                    />
                                </Box>
                            </Skeleton>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}