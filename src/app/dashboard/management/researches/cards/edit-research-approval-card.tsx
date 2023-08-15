import {
    Badge,
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Input,
    Skeleton,
    Text,
    useToast
} from "@chakra-ui/react";
import React, {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";
import {Organization, Research, ResearchApproval} from "@/models";
import {Autocomplete, Option} from "chakra-ui-simple-autocomplete";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {
    CREATE_RESEARCH_APPROVAL_MUTATION,
    GET_RESEARCH_APPROVAL_QUERY,
    LIST_ETHIC_COMMITTEES,
} from "@/apollo";
import {CloseIcon, ExternalLinkIcon} from "@chakra-ui/icons";
import {useBase64} from "@/hooks/base64";

export interface ResearchApprovalCardProps {
    readonly research: Research
    readonly setResearch: Dispatch<SetStateAction<Research>>
}

export function EditResearchApprovalCard({research, setResearch}: ResearchApprovalCardProps) {
    const toast = useToast();
    const [approval, setApproval] = useState<ResearchApproval>({} as ResearchApproval);
    const [result, setResult] = useState<Option[]>([]);
    const [options, setOptions] = useState<Option[]>([]);
    const [getResearchApprovalQuery, getResearchApprovalQueryResult] = useLazyQuery(GET_RESEARCH_APPROVAL_QUERY)
    const listEtcCommittees = useQuery(LIST_ETHIC_COMMITTEES, {
        pollInterval: 1000 * 10
    });
    const [createResearchApprovalMutation, createResearchApprovalMutationResult] = useMutation(CREATE_RESEARCH_APPROVAL_MUTATION, {
        refetchQueries: [GET_RESEARCH_APPROVAL_QUERY]
    })

    const {toBase64, fromBase64} = useBase64();

    const handleSaveButtonClick = useCallback(async () => {
        await createResearchApprovalMutation({
            variables: {
                input: {
                    id: approval.id,
                    code: approval.code,
                    researchId: research.id,
                    committees: approval.committees.map((committee) => {
                        return {
                            organizationId: committee.id
                        }
                    }),
                    file: {
                        name: approval.file?.name,
                        data: approval.file?.data,
                        mime: approval.file?.mime
                    }
                }
            }
        })
        toast({
            title: "Pesquisa Atualizada",
            description: `Aprovação ética da pesquisa "${research.title}" salva com sucesso.`,
            status: "success",
            isClosable: true,
            position: "top",
            colorScheme: "teal",
        })
    }, [approval, research, createResearchApprovalMutation, toast])

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
                                    defaultValue={approval.code}
                                    onChange={(e) => {
                                        setApproval(approval => {
                                            return {
                                                ...approval,
                                                code: e.target.value
                                            }
                                        })
                                    }} type={"text"}/>
                            </div>
                            <FormControl>
                                <FormLabel className={"text-sm"}>Documento Aprovação ética</FormLabel>
                                <div className={"relative z-50 flex border rounded-lg overflow-hidden"}>
                                    <Input
                                        border={"none"}
                                        onChange={async (e) => {
                                            const file = e.target.files?.item(0)
                                            if (file) {
                                                const data = await toBase64(file);

                                                setApproval(approval => {
                                                    return {
                                                        ...approval,
                                                        file: {
                                                            data,
                                                            name: file.name.substring(0, file.name.lastIndexOf(".")),
                                                            mime: file.name.split(".").pop() as string
                                                        }
                                                    }
                                                })
                                            }
                                        }}
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
                                        className={"outline-none w-full flex flex-col"}
                                        renderBadge={(option) => {
                                            return (
                                                <Badge className={"flex items-center m-1 gap-2 px-3 py-2 rounded-2xl"}>
                                                    {option.label}
                                                    <CloseIcon width={"10px"}/>
                                                </Badge>
                                            )
                                        }}
                                        options={options}
                                        result={result}
                                        setResult={(options: Option[]) => {
                                            setApproval(approval => {
                                                return {
                                                    ...approval,
                                                    committees: options.map(({value, label}) => {
                                                        return {
                                                            id: value,
                                                            name: label
                                                        } as Organization
                                                    })
                                                }
                                            })
                                            setResult(options);
                                        }}
                                    />
                                </Box>
                            </Skeleton>
                        </div>
                    </div>
                </div>
            </CardBody>
            <CardFooter>
                <div className={"flex justify-end w-full"}>
                    <Button
                        onClick={handleSaveButtonClick}
                        isLoading={createResearchApprovalMutationResult.loading}
                        colorScheme={"teal"}>Guardar</Button>
                </div>
            </CardFooter>
        </Card>
    )
}