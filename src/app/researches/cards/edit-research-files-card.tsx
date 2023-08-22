import React, {Dispatch, SetStateAction, useCallback, useEffect, useState} from "react";

import {
    Button,
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Popover,
    PopoverArrow,
    PopoverBody, PopoverCloseButton,
    PopoverContent, PopoverHeader,
    PopoverTrigger,
    Select,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useToast
} from "@chakra-ui/react";
import {AiOutlineFilePdf} from "react-icons/ai";

import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {
    CREATE_RESEARCH_FILE_MUTATION,
    DELETE_RESEARCH_FILE_MUTATION,
    GET_RESEARCH_FILES_QUERY,
    LIST_RESEARCH_DOCUMENTS_QUERY
} from "@/apollo";

import {Research, ResearchDocument, ResearchFile} from "@/models";
import {AddIcon, CloseIcon, ExternalLinkIcon} from "@chakra-ui/icons";
import {useBase64} from "@/hooks/base64";

export interface ResearchFilesCardProps {
    readonly research: Research
    readonly setResearch: Dispatch<SetStateAction<Research>>
}

export function EditResearchFilesCard({research}: ResearchFilesCardProps) {
    const toast = useToast();
    const listResearchDocumentsQuery = useQuery(LIST_RESEARCH_DOCUMENTS_QUERY);
    const [getResearchFilesQuery, getResearchFilesQueryResult] = useLazyQuery(GET_RESEARCH_FILES_QUERY);
    const [createResearchFileMutation, createResearchFileMutationResult] = useMutation(CREATE_RESEARCH_FILE_MUTATION, {
        refetchQueries: [GET_RESEARCH_FILES_QUERY]
    });
    const [deleteResearchFileMutation, deleteResearchFileMutationResult] = useMutation(DELETE_RESEARCH_FILE_MUTATION, {
        refetchQueries: [GET_RESEARCH_FILES_QUERY]
    });
    const [documents, setDocuments] = useState<ResearchDocument[]>([])
    const [file, setFile] = useState<ResearchFile>({} as ResearchFile)
    const [files, setFiles] = useState<ResearchFile[]>([])
    const {toBase64, fromBase64} = useBase64();

    const handleAddFileClick = useCallback(async () => {
        try {
            if (file.type && file.createdAt && file.data) {
                await createResearchFileMutation({
                    variables: {
                        input: {
                            researchDocumentId: file.type.id,
                            researchId: research.id,
                            createdAt: file.createdAt,
                            data: file.data,
                            name: file.name,
                            mime: file.mime,
                        }
                    }
                })
                toast({
                    title: "Arquivo Adicionado",
                    description: `Arquivo "${file.name}" adicionado com sucesso.`,
                    status: "success",
                    isClosable: true,
                    position: "top",
                    colorScheme: "teal",
                })
            }
        } catch (e) {
            toast({
                title: "Problemas ao adicionar o arquivo",
                description: `Verifique se o arquivo com o nome "${file.name}" não existe nesta pesquisa`,
                status: "error",
                isClosable: true,
                position: "top",
                colorScheme: "yellow",
            })
        }
    }, [file, research, createResearchFileMutation, toast])

    useEffect(() => {
        if (listResearchDocumentsQuery.data?.listResearchDocuments) {
            setDocuments(listResearchDocumentsQuery.data?.listResearchDocuments)
        }
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

    useEffect(() => {
        if (documents.length) {
            setFile(file => {
                return {
                    ...file,
                    type: documents[0]
                }
            })
        }
    }, [documents])

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
                                                    <IconButton
                                                        onClick={async () => {
                                                            await deleteResearchFileMutation({
                                                                variables: {
                                                                    id: file.id
                                                                }
                                                            })
                                                            toast({
                                                                title: "Arquivo Apagado",
                                                                description: `Arquivo "${file.name}" apagado com sucesso.`,
                                                                status: "success",
                                                                isClosable: true,
                                                                position: "top",
                                                                colorScheme: "teal",
                                                            })
                                                        }}
                                                        size={"xs"}
                                                        variant={"unstyled"}
                                                        icon={<CloseIcon/>}
                                                        aria-label={""}
                                                    />
                                                </div>
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
                            <PopoverHeader>
                                <Heading size={"sm"} fontWeight={"normal"}>Adicionar arquivo</Heading>
                                <PopoverCloseButton/>
                            </PopoverHeader>
                            <PopoverBody>
                                <div className={"flex flex-col gap-4"}>
                                    <div className={"gap-4 grid grid-rows-3"}>
                                        <FormControl>
                                            <FormLabel className={"text-sm"}>Tipo</FormLabel>
                                            <Select
                                                onChange={(e) => {
                                                    setFile({
                                                        ...file,
                                                        type: documents.find(d => d.id === e.target.value) as ResearchDocument
                                                    })
                                                }}
                                                name={"type"}>
                                                {
                                                    documents?.map((document) => {
                                                        return (
                                                            <option
                                                                key={document.id}
                                                                value={document.id}>
                                                                {document.name}
                                                            </option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel className={"text-sm"}>Arquivo</FormLabel>
                                            <InputGroup>
                                                <InputLeftElement>
                                                    <AiOutlineFilePdf/>
                                                </InputLeftElement>
                                                <Input
                                                    onChange={async (e) => {
                                                        if (e.target.files) {
                                                            const _file = e.target.files?.item(0) as File

                                                            if (_file) {
                                                                setFile({
                                                                    ...file,
                                                                    data: await toBase64(_file),
                                                                    name: _file.name.substring(0, _file.name.lastIndexOf(".")),
                                                                    mime: _file.name.split(".").pop() as string
                                                                })
                                                            }
                                                        }
                                                    }}
                                                    appearance={"none"}
                                                    className={"text-transparent"}
                                                    type={"file"}
                                                    name={"file"}
                                                    title={file.name ? file.name : "Selecione um arquivo"}
                                                />
                                                <Text className={"absolute -z-10 left-12 top-2"}>
                                                    {file.name ? file.name : "Selecione um arquivo"}
                                                </Text>
                                            </InputGroup>
                                        </FormControl>
                                        <div>
                                            <FormLabel className={"text-sm"}>Data</FormLabel>
                                            <Input
                                                onChange={(e) => setFile({
                                                    ...file,
                                                    createdAt: new Date(e.target.value)
                                                })}
                                                type={"date"}
                                                name={"date"}/>
                                        </div>
                                    </div>
                                    <Button
                                        isLoading={createResearchFileMutationResult.loading}
                                        onClick={handleAddFileClick}
                                        colorScheme={"teal"}
                                    >Adicionar</Button>
                                </div>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </div>
            </CardBody>
        </Card>

    )
}