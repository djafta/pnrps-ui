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
import {fakeResearcherRoles} from "@/skelton-data";

import {useMutation, useQuery} from "@apollo/client";
import {DELETE_RESEARCHER_ROLE_MUTATION, LIST_RESEARCHER_ROLES_QUERY} from "@/apollo";
import {ResearcherRoleItem} from "@/app/dashboard/settings/researchers/researcher-role-item";
import {CreateResearcherRoleModal} from "@/app/dashboard/settings/researchers/create-researcher-role-modal";
import {ResearcherRole} from "@/models";
import {EditResearcherRoleModal} from "@/app/dashboard/settings/researchers/edit-researcher-role-modal";
import {DeleteAlertDialog} from "@/components/delete-alert-dialog";
import {useDefault} from "@/hooks/default";

export function ResearcherSettings() {
    const toast = useToast();
    const [search, setSearch] = useState("");
    const [selects, setSelects] = useState<ResearcherRole[]>([]);
    const [roles, setResearcherRoles] = useState<ResearcherRole[]>(fakeResearcherRoles);

    const listResearcherRolesQuery = useQuery(LIST_RESEARCHER_ROLES_QUERY);
    const [deleteResearcherRoleMutation, deleteResearcherRoleMutationResult] = useMutation(
        DELETE_RESEARCHER_ROLE_MUTATION,
        {
            refetchQueries: [LIST_RESEARCHER_ROLES_QUERY]
        }
    )

    const createResearcherRoleModalDisclosure = useDisclosure();
    const deleteAlertDialogDisclosure = useDisclosure();
    const editResearcherRoleModalDisclosure = useDisclosure();
    const filteredList: ResearcherRole[] = roles.filter(researcher => researcher.name.toLowerCase().includes(search.toLowerCase()));

    const {isDefault, hasDefault} = useDefault()

    async function handleDeleteRoleButtonClick() {
        for (let role of selects) {

            await deleteResearcherRoleMutation({
                variables: {
                    id: role.id
                }
            })

            toast({
                title: "Papel de Investigador Apagado!",
                description: `Papel de Investigador ${role.name} apagado com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })
        }

        setTimeout(deleteAlertDialogDisclosure.onClose, 100)
    }

    useEffect(() => {
        if (listResearcherRolesQuery.data) {
            setResearcherRoles(listResearcherRolesQuery.data.listResearcherRoles)
        }
    }, [listResearcherRolesQuery])

    useEffect(() => {
        setSelects(selects => roles.filter((role) => selects.find((select) => role.id === select.id)))
    }, [roles])

    return (
        <>
            <CreateResearcherRoleModal
                isOpen={createResearcherRoleModalDisclosure.isOpen}
                onClose={createResearcherRoleModalDisclosure.onClose}
            />
            <EditResearcherRoleModal
                role={selects[0]}
                isOpen={editResearcherRoleModalDisclosure.isOpen}
                onClose={editResearcherRoleModalDisclosure.onClose}
            />
            <DeleteAlertDialog
                title={"Apagar Papel de Investigador"}
                description={"Tem certeza que deseja apagar o Papel de Investigador?"}
                onConfirm={handleDeleteRoleButtonClick}
                isOpen={deleteAlertDialogDisclosure.isOpen}
                onClose={deleteAlertDialogDisclosure.onClose}
            />
            <Card width={"full"} overflow={"hidden"}>
                <CardHeader className={"bg-bar text-white p-2"}>
                    <div className={"flex justify-between items-center"}>
                        <Heading className={"font-medium flex-grow"} size={"sm"}>Papeis de Investigadores</Heading>
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
                                        (search.length > 0 ? filteredList : roles).map((role) => {
                                            return (
                                                <ResearcherRoleItem
                                                    key={role.id}
                                                    loading={listResearcherRolesQuery.loading || fakeResearcherRoles === roles}
                                                    selects={selects}
                                                    setSelects={setSelects}
                                                    role={role}
                                                />
                                            )
                                        })
                                    }
                                </Accordion>
                            </div>
                            <div className={"flex items-center justify-between flex-row-reverse gap-2 transition-all"}>
                                <div className={"flex flex-row-reverse gap-2 transition-all"}>
                                    <IconButton
                                        onClick={createResearcherRoleModalDisclosure.onOpen}
                                        aria-label={""}
                                        icon={<AddIcon/>}
                                        colorScheme={"teal"}
                                    />
                                    <IconButton
                                        onClick={deleteAlertDialogDisclosure.onOpen}
                                        className={`${selects.length > 0 ? "visible" : "invisible"}`}
                                        isDisabled={hasDefault(selects)}
                                        colorScheme={"teal"}
                                        aria-label={""}
                                        icon={<DeleteIcon/>}
                                        variant={"outline"}
                                    />
                                    <IconButton
                                        onClick={editResearcherRoleModalDisclosure.onOpen}
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