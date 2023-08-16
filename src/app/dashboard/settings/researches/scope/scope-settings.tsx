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
import {fakeScopes} from "@/skelton-data";

import {
    DELETE_RESEARCH_SCOPE_MUTATION,
    LIST_RESEARCH_SCOPES_QUERY
} from "@/apollo";

import {ResearchScope} from "@/models";

import {DeleteAlertDialog} from "@/components/delete-alert-dialog";

import {CreateScopeModal} from "@/app/dashboard/settings/researches/scope/create-scope-modal";
import {EditScopeModal} from "@/app/dashboard/settings/researches/scope/edit-scope-modal";
import {ScopeItem} from "@/app/dashboard/settings/researches/scope/scope-item";

export function ScopeSettings() {
    const toast = useToast();
    const createScopeModalDisclosure = useDisclosure();
    const editScopeModalDisclosure = useDisclosure();
    const deleteScopeAlertDialog = useDisclosure();

    const [search, setSearch] = useState("");
    const [selects, setSelects] = useState<ResearchScope[]>([]);
    const [scopes, setScopes] = useState<ResearchScope[]>(fakeScopes);
    const listResearchScopesQuery = useQuery(LIST_RESEARCH_SCOPES_QUERY);

    const [deleteResearchScopeMutation, deleteResearchScopeMutationResult] = useMutation(
        DELETE_RESEARCH_SCOPE_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_SCOPES_QUERY]
        }
    )

    const filteredList: ResearchScope[] = scopes?.filter(scope => scope.name.toLowerCase().includes(search.toLowerCase()));

    async function handleDeleteScopeButtonClick() {
        await deleteResearchScopeMutation({
            variables: {
                id: selects[0].id
            }
        })

        toast({
            title: "Âmbito Apagado!",
            description: `Ãmbito ${selects[0].name} apagado com sucesso.`,
            status: "success",
            isClosable: true,
            position: "top",
            colorScheme: "teal",
        })

        deleteScopeAlertDialog.onClose();
    }

    useEffect(() => {
        if (listResearchScopesQuery.data) {
            setScopes(listResearchScopesQuery.data.listResearchScopes)
            setSelects(selects => scopes.filter((scope) => {
                return selects.find(select => select.id === scope.id)
            }))
        }

    }, [listResearchScopesQuery, scopes])

    return (
        <>
            <CreateScopeModal
                isOpen={createScopeModalDisclosure.isOpen}
                onClose={createScopeModalDisclosure.onClose}
            />
            <EditScopeModal
                scope={scopes.find(scope => scope.id === selects[0]?.id)}
                isOpen={editScopeModalDisclosure.isOpen}
                onClose={editScopeModalDisclosure.onClose}
            />
            <DeleteAlertDialog
                title={"Apagar Âmbito!"}
                description={"Tem certeza que deseja apagar a âmbito?"}
                onConfirm={handleDeleteScopeButtonClick}
                onClose={deleteScopeAlertDialog.onClose}
                isOpen={deleteScopeAlertDialog.isOpen}
            />
            <Card>
                <CardHeader className={"bg-bar text-white p-2"}>
                    <div className={"flex justify-between items-center"}>
                        <Heading className={"font-medium flex-grow"} size={"sm"}>Ambitos da pesquisa</Heading>
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
                    <div className={"w-full flex-1 flex"}>
                        <div className={"flex flex-1 w-full gap-4 flex-col justify-between"}>
                            <div className={"min-h-[26rem] max-h-[65vh]  overflow-y-auto"}>
                                {
                                    (search.length > 0 ? filteredList : scopes)?.map((scope) => {
                                        return (
                                            <ScopeItem
                                                key={scope.id}
                                                loading={listResearchScopesQuery.loading}
                                                selects={selects}
                                                setSelects={setSelects}
                                                scope={scope}
                                            />
                                        )
                                    })
                                }
                            </div>
                            <div className={"flex items-center justify-between flex-row-reverse gap-2 transition-all"}>
                                <div className={"flex flex-row-reverse gap-2 transition-all"}>
                                    <IconButton
                                        onClick={createScopeModalDisclosure.onOpen}
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
                                        onClick={deleteScopeAlertDialog.onOpen}
                                    />
                                    <IconButton
                                        className={`${selects.length == 1 ? "visible" : "invisible"}`}
                                        icon={<EditIcon/>}
                                        aria-label={""}
                                        colorScheme={"teal"}
                                        variant={"outline"}
                                        onClick={editScopeModalDisclosure.onOpen}
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