import {useEffect, useState} from "react";

import {
    Accordion,
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Input,
    Tooltip, useDisclosure, useToast
} from "@chakra-ui/react";

import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {AiOutlineSearch} from "react-icons/ai";

import {useMutation, useQuery} from "@apollo/client";
import {ClassificationItem} from "@/app/dashboard/settings/researches/classification/classification-item";
import {ResearchField, ResearchClassification} from "@/models";

import {fakeClassifications} from "@/skelton-data";

import {DELETE_RESEARCH_CLASSIFICATION_MUTATION, LIST_RESEARCH_CLASSIFICATIONS_QUERY} from "@/apollo";
import {
    CreateClassificationModal
} from "@/app/dashboard/settings/researches/classification/create-classification-modal";
import {EditClassificationModal} from "@/app/dashboard/settings/researches/classification/edit-classification-modal";
import {DeleteAlertDialog} from "@/components/delete-alert-dialog";

export function ClassificationSettings() {
    const toast = useToast();
    const createClassificationModalDisclosure = useDisclosure();
    const [search, setSearch] = useState("");
    const [selects, setSelects] = useState<ResearchClassification[]>([]);
    const [classifications, setClassifications] = useState<ResearchClassification[]>(fakeClassifications);
    const listResearchClassificationQuery = useQuery(LIST_RESEARCH_CLASSIFICATIONS_QUERY);
    const [deleteResearchClassificationMutation, deleteResearchClassificationMutationResult] = useMutation(
        DELETE_RESEARCH_CLASSIFICATION_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_CLASSIFICATIONS_QUERY]
        }
    )

    const filteredList: ResearchField[] = classifications.filter(classification => classification.name.toLowerCase().includes(search.toLowerCase()));
    const deleteAlertDialogDisclosure = useDisclosure();
    const editClassificationModalDisclosure = useDisclosure();

    async function handleDeleteClassificationButtonClick() {
        for (let classification of selects) {

            await deleteResearchClassificationMutation({
                variables: {
                    id: classification.id
                }
            })

            toast({
                title: "Classificação Apagada!",
                description: `Classificação ${classification.name} apagada com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })
        }
    }

    useEffect(() => {
        if (listResearchClassificationQuery.data) {
            setClassifications(listResearchClassificationQuery.data.listResearchClassifications)
        }

    }, [listResearchClassificationQuery])

    useEffect(() => {
        setSelects(selects => classifications.filter((classification) => selects.find((select) => classification.id === select.id)))

    }, [classifications])
    return (
        <>
            <CreateClassificationModal
                isOpen={createClassificationModalDisclosure.isOpen}
                onClose={createClassificationModalDisclosure.onClose}
            />
            <EditClassificationModal
                classification={selects[0]}
                isOpen={editClassificationModalDisclosure.isOpen}
                onClose={editClassificationModalDisclosure.onClose}
            />
            <DeleteAlertDialog
                title={"Apagar Classificação de Pesquisa"}
                description={"Tem certeza que deseja apagar a classificação de pesquisa?"}
                onConfirm={handleDeleteClassificationButtonClick}
                isOpen={deleteAlertDialogDisclosure.isOpen}
                onClose={deleteAlertDialogDisclosure.onClose}
            />

            <Card width={"full"} overflow={"hidden"}>
                <CardHeader className={"bg-bar text-white p-2"}>
                    <div className={"flex justify-between items-center"}>
                        <Heading className={"font-medium flex-grow"} size={"sm"}>Classificações da pesquisa</Heading>
                        <FormControl
                            className={`
                            flex max-w-[20rem] items-center my-auto rounded-lg bg-transparent focus-within:bg-white 
                            overflow-hidden transition-colors`
                            }
                        >
                            <Input
                                onChange={(e) => {
                                    setSearch(e.target.value);
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
                <CardBody>
                    <div className={"w-full flex"}>
                        <div className={"flex w-full gap-4 flex-col"}>
                            <div>
                                <Accordion allowMultiple={true}>
                                    {
                                        (search.length > 0 ? filteredList : classifications).map((classification) => {
                                            return (
                                                <ClassificationItem
                                                    key={classification.id}
                                                    loading={listResearchClassificationQuery.loading || fakeClassifications === classifications}
                                                    selects={selects}
                                                    setSelects={setSelects}
                                                    classification={classification}
                                                />
                                            )
                                        })
                                    }
                                </Accordion>
                            </div>
                            <div className={"flex items-center justify-between flex-row-reverse gap-2 transition-all"}>
                                <div className={"flex flex-row-reverse gap-2 transition-all"}>
                                    <IconButton
                                        onClick={createClassificationModalDisclosure.onOpen}
                                        aria-label={""}
                                        icon={<AddIcon/>}
                                        colorScheme={"teal"}
                                    />
                                    <IconButton
                                        onClick={deleteAlertDialogDisclosure.onOpen}
                                        className={`${selects.length > 0 ? "visible" : "invisible"}`}
                                        colorScheme={"teal"}
                                        aria-label={""}
                                        icon={<DeleteIcon/>}
                                        variant={"outline"}
                                    />
                                    <IconButton
                                        onClick={editClassificationModalDisclosure.onOpen}
                                        className={`${selects.length == 1 ? "visible" : "invisible"}`}
                                        icon={<EditIcon/>}
                                        aria-label={""}
                                        colorScheme={"teal"}
                                        variant={"outline"}
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