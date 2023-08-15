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
    useDisclosure,
    useToast
} from "@chakra-ui/react";

import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {AiOutlineSearch} from "react-icons/ai";

import {useMutation, useQuery} from "@apollo/client";
import {fakeDocuments} from "@/skelton-data";

import {
    DELETE_RESEARCH_DOCUMENT_MUTATION,
    LIST_RESEARCH_DOCUMENTS_QUERY,
} from "@/apollo";

import {ResearchDocument} from "@/models";

import {DeleteAlertDialog} from "@/components/delete-alert-dialog";
import {CreateDocumentModal} from "@/app/dashboard/settings/researches/document/create-document-modal";
import {EditDocumentModal} from "@/app/dashboard/settings/researches/document/edit-document-modal";
import {DocumentItem} from "@/app/dashboard/settings/researches/document/document-item";

export function DocumentSettings() {
    const toast = useToast();
    const createDocumentModalDisclosure = useDisclosure();
    const editDocumentModalDisclosure = useDisclosure();
    const deleteDocumentAlertDialog = useDisclosure();

    const [search, setSearch] = useState("");
    const [selects, setSelects] = useState<ResearchDocument[]>([]);
    const [documents, setDocuments] = useState<ResearchDocument[]>(fakeDocuments);
    const listResearchDocumentsQuery = useQuery(LIST_RESEARCH_DOCUMENTS_QUERY);

    const [deleteResearchDocumentMutation, deleteResearchDocumentMutationResult] = useMutation(
        DELETE_RESEARCH_DOCUMENT_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_DOCUMENTS_QUERY]
        }
    )

    const filteredList: ResearchDocument[] = documents?.filter(document => document.name.toLowerCase().includes(search.toLowerCase()));

    async function handleDeleteDocumentButtonClick() {
        await deleteResearchDocumentMutation({
            variables: {
                id: selects[0].id
            }
        })

        toast({
            title: "Documento Apagado!",
            description: `Documento ${selects[0].name} apagado com sucesso.`,
            status: "success",
            isClosable: true,
            position: "top",
            colorScheme: "teal",
        })

        deleteDocumentAlertDialog.onClose();
    }

    useEffect(() => {
        if (listResearchDocumentsQuery.data) {
            setDocuments(listResearchDocumentsQuery.data.listResearchDocuments)
            setSelects(selects => documents.filter((document) => {
                return selects.find(select => select.id === document.id)
            }))
        }

    }, [listResearchDocumentsQuery, documents])

    return (
        <>
            <CreateDocumentModal
                isOpen={createDocumentModalDisclosure.isOpen}
                onClose={createDocumentModalDisclosure.onClose}
            />
            <EditDocumentModal
                document={documents.find(document => document.id === selects[0]?.id)}
                isOpen={editDocumentModalDisclosure.isOpen}
                onClose={editDocumentModalDisclosure.onClose}
            />
            <DeleteAlertDialog
                title={"Apagar Documento!"}
                description={"Tem certeza que deseja apagar o Documento?"}
                onConfirm={handleDeleteDocumentButtonClick}
                onClose={deleteDocumentAlertDialog.onClose}
                isOpen={deleteDocumentAlertDialog.isOpen}
            />
            <Card width={"full"} overflow={"hidden"}>
                <CardHeader className={"bg-bar text-white p-2"}>
                    <div className={"flex justify-between items-center"}>
                        <Heading className={"font-medium flex-grow"} size={"sm"}>Documentos da pesquisa</Heading>
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
                <CardBody>
                    <div className={"w-full flex"}>
                        <div className={"flex w-full gap-4 flex-col"}>
                            <div>
                                {
                                    (search.length > 0 ? filteredList : documents)?.map((document) => {
                                        return (
                                            <DocumentItem
                                                key={document.id}
                                                loading={listResearchDocumentsQuery.loading}
                                                selects={selects}
                                                setSelects={setSelects}
                                                document={document}
                                            />
                                        )
                                    })
                                }
                            </div>
                            <div className={"flex items-center justify-between flex-row-reverse gap-2 transition-all"}>
                                <div className={"flex flex-row-reverse gap-2 transition-all"}>
                                    <IconButton
                                        onClick={createDocumentModalDisclosure.onOpen}
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
                                        onClick={deleteDocumentAlertDialog.onOpen}
                                    />
                                    <IconButton
                                        className={`${selects.length == 1 ? "visible" : "invisible"}`}
                                        icon={<EditIcon/>}
                                        aria-label={""}
                                        colorScheme={"teal"}
                                        variant={"outline"}
                                        onClick={editDocumentModalDisclosure.onOpen}
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