import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Checkbox,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Input, InputGroup, InputLeftElement, InputRightElement,
    Popover,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent, PopoverFooter,
    PopoverHeader,
    Select,
    Skeleton,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs, Text,
    Textarea,
    useDisclosure, useToast
} from "@chakra-ui/react";
import {AiOutlineDelete, AiOutlineFileAdd, AiOutlineFilePdf, AiOutlineSave} from "react-icons/ai";
import React, {FormEvent, useCallback, useEffect, useState} from "react";
import {Research, ResearchMaterialTransferAgreement, ResearchSample} from "@/models";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {
    CREATE_RESEARCH_MATERIAL_TRANSFER_AGREEMENT,
    GET_RESEARCH_MATERIAL_TRANSFER_AGREEMENTS,
    LIST_RESEARCH_SAMPLES_QUERY
} from "@/apollo";
import {useBase64} from "@/hooks/base64";
import {ExternalLinkIcon} from "@chakra-ui/icons";

export interface EditResearchAgreementsCardProps {
    readonly research: Research
}

export function EditResearchAgreementsCard({research}: EditResearchAgreementsCardProps) {
    const listResearchSamplesQuery = useQuery(LIST_RESEARCH_SAMPLES_QUERY, {
        pollInterval: 1000 * 10 // 10 seconds
    })
    const [getResearchMaterailTransferAgreementsQuery, getResearchMaterialTransferAgreementsQueryResult] = useLazyQuery(GET_RESEARCH_MATERIAL_TRANSFER_AGREEMENTS);
    const [createResearchMaterialTransferAgreementMutation, createResearchMaterialTransferAgreementMutationResult] = useMutation(CREATE_RESEARCH_MATERIAL_TRANSFER_AGREEMENT, {})

    const createResearchMaterialTransferAgreementDisclosure = useDisclosure();
    const [samples, setSamples] = useState<ResearchSample[]>([]);
    const [mtas, setMtas] = useState<ResearchMaterialTransferAgreement[]>([])
    const {toBase64, fromBase64} = useBase64();
    const toast = useToast();

    const handleCreateResearchMaterialTransferAgreement = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);

        const researchSampleId = data.get("sample") as string
        const description = data.get("description") as string
        const quantity = data.get("quantity") as string
        const file = data.get("file") as File

        await createResearchMaterialTransferAgreementMutation({
            variables: {
                input: {
                    researchSampleId,
                    description,
                    researchId: research.id,
                    quantity,
                    file: {
                        data: await toBase64(file),
                        name: file.name.substring(0, file.name.lastIndexOf(".")),
                        mime: file.name.split(".").pop()
                    }
                }
            }
        })
        toast({
            title: "Acordo de Transferência de Materail criado",
            description: `Acordo de Transferência de Materail "${file.name}" criado com sucesso.`,
            status: "success",
            isClosable: true,
            position: "top",
            colorScheme: "teal",
        })
    }, [createResearchMaterialTransferAgreementMutation, research, toBase64, toast])

    useEffect(() => {
        if (research.id) {
            getResearchMaterailTransferAgreementsQuery({
                variables: {
                    id: research.id
                }
            })
        }
    }, [research])

    useEffect(() => {
        if (listResearchSamplesQuery.data?.listResearchSamples) {
            setSamples(listResearchSamplesQuery.data.listResearchSamples)
        }

        if (getResearchMaterialTransferAgreementsQueryResult.data?.getResearchMaterialTransferAgreements) {
            setMtas(getResearchMaterialTransferAgreementsQueryResult.data.getResearchMaterialTransferAgreements)
        }
    }, [listResearchSamplesQuery, getResearchMaterialTransferAgreementsQueryResult])

    return (
        <Card>
            <CardHeader>
                <Heading size={"md"}>Acordos</Heading>
            </CardHeader>
            <CardBody>
                <div>
                    <Tabs variant='enclosed'>
                        <TabList>
                            <Tab>Transferência de dados</Tab>
                            <Tab>Transferência de material</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <div className={"flex flex-col gap-4"}>
                                    <div className={"flex gap-2"}>
                                        <div className={"flex items-start"}>
                                            <Checkbox/>
                                        </div>
                                        <div className={"flex w-full flex-col gap-4"}>
                                            <FormControl className={"p-1"}>
                                                <FormLabel
                                                    className={"text-sm"}>Anexo</FormLabel>
                                                <Input type={"file"}/>
                                            </FormControl>
                                            <FormControl className={"p-1"}>
                                                <FormLabel
                                                    className={"text-sm"}>Observação</FormLabel>
                                                <Textarea>

                                                </Textarea>
                                            </FormControl>
                                        </div>
                                    </div>

                                    <div className={"flex gap-2 justify-end"}>
                                        <IconButton colorScheme={"teal"} variant={"outline"}
                                                    icon={<AiOutlineFileAdd/>} aria-label={""}/>
                                        <IconButton colorScheme={"red"} variant={"outline"}
                                                    icon={<AiOutlineDelete/>} aria-label={""}/>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className={"flex flex-col gap-4"}>
                                    {
                                        mtas.map((mta) => (
                                            <form
                                                key={mta.id}
                                                className={"flex flex-col gap-4 overflow-y-auto max-h-80"}>
                                                <div className={"flex gap-2"}>
                                                    <div className={"flex items-start"}>
                                                        <Checkbox/>
                                                    </div>
                                                    <div className={"flex w-full flex-col gap-4"}>
                                                        <FormControl isReadOnly={true} className={"p-1"}>
                                                            <FormLabel
                                                                className={"text-sm"}>Anexo</FormLabel>
                                                            <InputGroup>
                                                                <InputLeftElement>
                                                                    <AiOutlineFilePdf/>
                                                                </InputLeftElement>
                                                                <Input
                                                                    appearance={"none"}
                                                                    className={"text-transparent"}
                                                                    type={"file"}
                                                                    name={"file"}
                                                                    title={mta.file.name ? mta.file.name : "Selecione um arquivo"}
                                                                />
                                                                <InputRightElement>
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            if (mta.file?.data) {
                                                                                window.open(fromBase64(mta.file.data), "_blank")
                                                                            }
                                                                        }}
                                                                        variant={"unstyled"}
                                                                        icon={<ExternalLinkIcon/>}
                                                                        aria-label={""}/>
                                                                </InputRightElement>
                                                                <Text className={"absolute -z-10 left-12 top-2"}>
                                                                    {mta.file.name ? mta.file.name : "Selecione um arquivo"}
                                                                </Text>
                                                            </InputGroup>
                                                        </FormControl>

                                                        <div
                                                            className={"grid gap-2 grid-rows-2 md:grid-rows-none md:grid-cols-2"}>
                                                            <FormControl isReadOnly={true} className={"p-1"}>
                                                                <FormLabel
                                                                    className={"text-sm"}>Tipo</FormLabel>
                                                                <Skeleton isLoaded={!!samples.length}>
                                                                    <Select defaultValue={mta.sample.id}
                                                                            name={"sample"}>
                                                                        {
                                                                            samples.map((sample) => (
                                                                                <option
                                                                                    key={sample.id}
                                                                                    value={sample.id}>{sample.name}</option>
                                                                            ))
                                                                        }
                                                                    </Select>
                                                                </Skeleton>
                                                            </FormControl>
                                                            <FormControl isReadOnly={true} className={"p-1"}>
                                                                <FormLabel
                                                                    className={"text-sm"}>Quantidade</FormLabel>
                                                                <Input defaultValue={mta.quantity} name={"quantity"}
                                                                       type={"text"}/>
                                                            </FormControl>
                                                        </div>

                                                        <FormControl isReadOnly={true} className={"p-1"}>
                                                            <FormLabel className={"text-sm"}>Observação</FormLabel>
                                                            <Textarea defaultValue={mta.description}
                                                                      name={"description"}>

                                                            </Textarea>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                            </form>
                                        ))
                                    }
                                    <Popover
                                        isOpen={createResearchMaterialTransferAgreementDisclosure.isOpen}
                                        onOpen={createResearchMaterialTransferAgreementDisclosure.onOpen}
                                        onClose={createResearchMaterialTransferAgreementDisclosure.onClose}
                                    >
                                        <PopoverContent className={"w-screen lg:w-[960px]"}>
                                            <form
                                                onSubmit={handleCreateResearchMaterialTransferAgreement}
                                            >
                                                <PopoverHeader>
                                                    <Heading size={"sm"}>
                                                        Adicionar Acordo de Tranferência de Material
                                                    </Heading>
                                                    <PopoverCloseButton/>
                                                </PopoverHeader>
                                                <PopoverBody>
                                                    <div
                                                        className={"flex flex-col gap-4 overflow-y-auto max-h-80"}>
                                                        <div className={"flex gap-2"}>
                                                            <div className={"flex w-full flex-col gap-4"}>
                                                                <div className={"p-1"}>
                                                                    <FormLabel
                                                                        className={"text-sm"}>Anexo</FormLabel>
                                                                    <Input name={"file"} type={"file"}/>
                                                                </div>

                                                                <div
                                                                    className={"grid gap-2 grid-rows-2 md:grid-rows-none md:grid-cols-2"}>
                                                                    <div className={"p-1"}>
                                                                        <FormLabel
                                                                            className={"text-sm"}>Tipo</FormLabel>
                                                                        <Skeleton isLoaded={!!samples.length}>
                                                                            <Select
                                                                                name={"sample"}>
                                                                                {
                                                                                    samples.map((sample) => (
                                                                                        <option
                                                                                            key={sample.id}
                                                                                            value={sample.id}>{sample.name}</option>
                                                                                    ))
                                                                                }
                                                                            </Select>
                                                                        </Skeleton>
                                                                    </div>
                                                                    <div className={"p-1"}>
                                                                        <FormLabel
                                                                            className={"text-sm"}>Quantidade</FormLabel>
                                                                        <Input name={"quantity"} type={"text"}/>
                                                                    </div>
                                                                </div>

                                                                <div className={"p-1"}>
                                                                    <FormLabel
                                                                        className={"text-sm"}>Observação</FormLabel>
                                                                    <Textarea name={"description"}>

                                                                    </Textarea>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </PopoverBody>
                                                <PopoverFooter>
                                                    <div className={"flex justify-end"}>
                                                        <Button type={"submit"} colorScheme={"teal"}>Guardar</Button>
                                                    </div>
                                                </PopoverFooter>
                                            </form>
                                        </PopoverContent>
                                    </Popover>

                                    <div className={"flex gap-2 justify-start"}>
                                        <IconButton
                                            colorScheme={"teal"}
                                            variant={"unstyled"}
                                            icon={<AiOutlineFileAdd/>}
                                            aria-label={""}
                                            onClick={createResearchMaterialTransferAgreementDisclosure.onOpen}
                                        />
                                        <IconButton colorScheme={"teal"} variant={"unstyled"} icon={<AiOutlineSave/>}
                                                    aria-label={""}/>
                                        <IconButton colorScheme={"teal"} variant={"unstyled"}
                                                    icon={<AiOutlineDelete/>} aria-label={""}/>
                                    </div>
                                </div>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </CardBody>
        </Card>
    )
}