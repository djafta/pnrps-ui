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
import {fakeBodies} from "@/skelton-data";

import {
    DELETE_ORGANIZATION_TYPE_MUTATION,
    LIST_ORGANIZATION_TYPES_QUERY
} from "@/apollo";

import {OrganizationType} from "@/models";

import {DeleteAlertDialog} from "@/components/delete-alert-dialog";

import {CreateTypeModal} from "@/app/dashboard/settings/organization/type/create-type-modal";
import {EditTypeModal} from "@/app/dashboard/settings/organization/type/edit-type-modal";
import {TypeItem} from "@/app/dashboard/settings/organization/type/type-item";
import {useDefault} from "@/hooks/default";

export function TypeSettings() {
    const toast = useToast();
    const createTypeModalDisclosure = useDisclosure();
    const editTypeModalDisclosure = useDisclosure();
    const deleteTypeAlertDialog = useDisclosure();

    const [search, setSearch] = useState("");
    const [selects, setSelects] = useState<OrganizationType[]>([]);
    const [types, setTypes] = useState<OrganizationType[]>(fakeBodies);
    const listOrganizationTypesQuery = useQuery(LIST_ORGANIZATION_TYPES_QUERY);

    const [deleteTypeMutation, deleteTypeMutationResult] = useMutation(
        DELETE_ORGANIZATION_TYPE_MUTATION,
        {
            refetchQueries: [LIST_ORGANIZATION_TYPES_QUERY]
        }
    )
    const {isDefault, hasDefault} = useDefault();

    const filteredList: OrganizationType[] = types?.filter(scope => scope.name.toLowerCase().includes(search.toLowerCase()));

    async function handleDeleteTypeButtonClick() {
        await deleteTypeMutation({
            variables: {
                id: selects[0].id
            }
        })

        toast({
            title: "Tipo de Organizaçao Apagada!",
            description: `Tipo de Organizaçao ${selects[0].name} apagada com sucesso.`,
            status: "success",
            isClosable: true,
            position: "top",
            colorScheme: "teal",
        })

        deleteTypeAlertDialog.onClose();
    }

    useEffect(() => {
        if (listOrganizationTypesQuery.data) {
            setTypes(listOrganizationTypesQuery.data.listOrganizationTypes)
            setSelects(selects => types.filter((type) => {
                return selects.find(select => select.id === type.id)
            }))
        }

    }, [listOrganizationTypesQuery, types])

    return (
        <>
            <CreateTypeModal
                isOpen={createTypeModalDisclosure.isOpen}
                onClose={createTypeModalDisclosure.onClose}
            />
            <EditTypeModal
                type={types.find(scope => scope.id === selects[0]?.id)}
                isOpen={editTypeModalDisclosure.isOpen}
                onClose={editTypeModalDisclosure.onClose}
            />
            <DeleteAlertDialog
                title={"Apagar Tipo de Organizaçao!"}
                description={"Tem certeza que deseja apagar o tipo de organização?"}
                onConfirm={handleDeleteTypeButtonClick}
                onClose={deleteTypeAlertDialog.onClose}
                isOpen={deleteTypeAlertDialog.isOpen}
            />
            <Card>
                <CardHeader className={"bg-bar text-white p-2"}>
                    <div className={"flex justify-between items-center"}>
                        <Heading className={"font-medium flex-grow"} size={"sm"}>Tipos de Organização</Heading>
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
                            <div className={"min-h-[30rem] max-h-[65vh]  overflow-y-auto"}>
                                {
                                    (search.length > 0 ? filteredList : types)?.map((body) => {
                                        return (
                                            <TypeItem
                                                key={body.id}
                                                loading={listOrganizationTypesQuery.loading}
                                                selects={selects}
                                                setSelects={setSelects}
                                                body={body}
                                            />
                                        )
                                    })
                                }
                            </div>
                            <div className={"flex items-center justify-between flex-row-reverse gap-2 transition-all"}>
                                <div className={"flex flex-row-reverse gap-2 transition-all"}>
                                    <IconButton
                                        onClick={createTypeModalDisclosure.onOpen}
                                        aria-label={""}
                                        icon={<AddIcon/>}
                                        colorScheme={"teal"}
                                    />
                                    <IconButton
                                        isDisabled={hasDefault(selects)}
                                        className={`${selects.length > 0 ? "visible" : "invisible"}`}
                                        colorScheme={"teal"}
                                        aria-label={""}
                                        icon={<DeleteIcon/>}
                                        variant={"outline"}
                                        onClick={deleteTypeAlertDialog.onOpen}
                                    />
                                    <IconButton
                                        className={`${selects.length == 1 ? "visible" : "invisible"}`}
                                        icon={<EditIcon/>}
                                        aria-label={""}
                                        colorScheme={"teal"}
                                        variant={"outline"}
                                        onClick={editTypeModalDisclosure.onOpen}
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