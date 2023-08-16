import {useEffect, useState} from "react";

import {
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Input,
    Tooltip,
    useDisclosure, useToast
} from "@chakra-ui/react";

import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {AiOutlineSearch} from "react-icons/ai";

import {useMutation, useQuery} from "@apollo/client";
import {fakeSamples} from "@/skelton-data";

import {
    DELETE_RESEARCH_SAMPLE_MUTATION,
    LIST_RESEARCH_SAMPLES_QUERY
} from "@/apollo";

import {CreateSampleModal} from "@/app/dashboard/settings/researches/sample/create-sample-modal";
import {EditSampleModal} from "@/app/dashboard/settings/researches/sample/edit-sample-modal";
import {ResearchSample} from "@/models";
import {SampleItem} from "@/app/dashboard/settings/researches/sample/sample-item";

import {DeleteAlertDialog} from "@/components/delete-alert-dialog";

export function SampleSettings() {
    const toast = useToast();
    const createSampleModalDisclosure = useDisclosure();
    const editSampleModalDisclosure = useDisclosure();
    const deleteSampleAlertDialog = useDisclosure();

    const [search, setSearch] = useState("");
    const [selects, setSelects] = useState<ResearchSample[]>([]);
    const [samples, setSamples] = useState<ResearchSample[]>(fakeSamples);
    const listResearchSamplesQuery = useQuery(LIST_RESEARCH_SAMPLES_QUERY);
    const [deleteResearchSampleMutation, deleteResearchSampleMutationResult] = useMutation(
        DELETE_RESEARCH_SAMPLE_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_SAMPLES_QUERY]
        }
    )
    const filteredList: ResearchSample[] = samples?.filter(sample => sample.name.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        if (listResearchSamplesQuery.data) {
            setSamples(listResearchSamplesQuery.data.listResearchSamples)
        }
    }, [listResearchSamplesQuery])

    async function handleDeleteSampleButtonClick() {
        await deleteResearchSampleMutation({
            variables: {
                id: selects[0].id
            }
        })

        toast({
            title: "Amostra Apagada!",
            description: `Amostra ${selects[0].name} apagada com sucesso.`,
            status: "success",
            isClosable: true,
            position: "top",
            colorScheme: "teal",
        })

        deleteSampleAlertDialog.onClose();
    }

    return (
        <>
            <CreateSampleModal
                isOpen={createSampleModalDisclosure.isOpen}
                onClose={createSampleModalDisclosure.onClose}
            />
            <EditSampleModal
                sample={selects[0]}
                isOpen={editSampleModalDisclosure.isOpen}
                onClose={editSampleModalDisclosure.onClose}
            />
            <DeleteAlertDialog
                title={"Apagar Amostra!"}
                description={"Tem certeza que deseja apagar a amostra?"}
                onConfirm={handleDeleteSampleButtonClick}
                onClose={deleteSampleAlertDialog.onClose}
                isOpen={deleteSampleAlertDialog.isOpen}
            />
            <Card>
                <CardHeader className={"bg-bar text-white p-2"}>
                    <div className={"flex justify-between items-center"}>
                        <Heading className={"font-medium flex-grow"} size={"sm"}>Amostras da pesquisa</Heading>
                        <FormControl
                            className={`
                            flex max-w-[20rem] items-center my-auto rounded-lg bg-transparent focus-within:bg-white 
                            overflow-hidden transition-colors`
                            }
                        >
                            <Input
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setSelects([])
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
                <CardBody className={"flex"}>
                    <div className={"w-full flex flex-1"}>
                        <div className={"flex w-full flex-1 gap-4 flex-col justify-between"}>
                            <div className={"min-h-[26rem] max-h-[65vh]  overflow-y-auto"}>
                                {
                                    (search.length > 0 ? filteredList : samples)?.map((sample) => {
                                        return (
                                            <SampleItem
                                                key={sample.id}
                                                loading={listResearchSamplesQuery.loading || fakeSamples === samples}
                                                selects={selects}
                                                setSelects={setSelects}
                                                sample={sample}
                                            />
                                        )
                                    })
                                }
                            </div>
                            <div className={"flex items-center justify-between flex-row-reverse gap-2 transition-all"}>
                                <div className={"flex flex-row-reverse gap-2 transition-all"}>
                                    <IconButton
                                        onClick={createSampleModalDisclosure.onOpen}
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
                                        onClick={deleteSampleAlertDialog.onOpen}
                                    />
                                    <IconButton
                                        className={`${selects.length == 1 ? "visible" : "invisible"}`}
                                        icon={<EditIcon/>}
                                        aria-label={""}
                                        colorScheme={"teal"}
                                        variant={"outline"}
                                        onClick={editSampleModalDisclosure.onOpen}
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