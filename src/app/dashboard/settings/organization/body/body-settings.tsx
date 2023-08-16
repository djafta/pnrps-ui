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
    DELETE_ORGANIZATION_MUTATION,
    LIST_ORGANIZATIONS_QUERY
} from "@/apollo";

import {Organization} from "@/models";

import {DeleteAlertDialog} from "@/components/delete-alert-dialog";

import {CreateBodyModal} from "@/app/dashboard/settings/organization/body/create-body-modal";
import {EditBodyModal} from "@/app/dashboard/settings/organization/body/edit-body-modal";
import {BodyItem} from "@/app/dashboard/settings/organization/body/body-item";

export function BodySettings() {
    const toast = useToast();
    const createBodyModalDisclosure = useDisclosure();
    const editBodyModalDisclosure = useDisclosure();
    const deleteBodyAlertDialog = useDisclosure();

    const [search, setSearch] = useState("");
    const [selects, setSelects] = useState<Organization[]>([]);
    const [bodies, setBodies] = useState<Organization[]>(fakeBodies as Organization[]);
    const listBodiesQuery = useQuery(LIST_ORGANIZATIONS_QUERY);

    const [deleteBodyMutation, deleteBodyMutationResult] = useMutation(
        DELETE_ORGANIZATION_MUTATION,
        {
            refetchQueries: [LIST_ORGANIZATIONS_QUERY]
        }
    )

    const filteredList: Organization[] = bodies?.filter(scope => scope.name.toLowerCase().includes(search.toLowerCase()));

    async function handleDeleteBodyButtonClick() {
        await deleteBodyMutation({
            variables: {
                id: selects[0].id
            }
        })

        toast({
            title: "Organizaçao Apagada!",
            description: `Organizaçao ${selects[0].name} apagada com sucesso.`,
            status: "success",
            isClosable: true,
            position: "top",
            colorScheme: "teal",
        })

        deleteBodyAlertDialog.onClose();
    }

    useEffect(() => {
        if (listBodiesQuery.data) {
            setBodies(listBodiesQuery.data.listOrganizations)
            setSelects(selects => bodies.filter((scope) => {
                return selects.find(select => select.id === scope.id)
            }))
        }

    }, [listBodiesQuery, bodies])

    return (
        <>
            <CreateBodyModal
                isOpen={createBodyModalDisclosure.isOpen}
                onClose={createBodyModalDisclosure.onClose}
            />
            <EditBodyModal
                body={bodies.find(scope => scope.id === selects[0]?.id)}
                isOpen={editBodyModalDisclosure.isOpen}
                onClose={editBodyModalDisclosure.onClose}
            />
            <DeleteAlertDialog
                title={"Apagar Organizaçao!"}
                description={"Tem certeza que deseja apagar a organização?"}
                onConfirm={handleDeleteBodyButtonClick}
                onClose={deleteBodyAlertDialog.onClose}
                isOpen={deleteBodyAlertDialog.isOpen}
            />
            <Card className={"min-h-[30rem] xl:min-h-[36rem] max-h-[80vh] w-full overflow-hidden"}>
                <CardHeader className={"bg-bar text-white p-2"}>
                    <div className={"flex justify-between items-center"}>
                        <Heading className={"font-medium flex-grow"} size={"sm"}>Organizações</Heading>
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
                            <div>
                                {
                                    (search.length > 0 ? filteredList : bodies)?.map((body) => {
                                        return (
                                            <BodyItem
                                                key={body.id}
                                                loading={listBodiesQuery.loading}
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
                                        onClick={createBodyModalDisclosure.onOpen}
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
                                        onClick={deleteBodyAlertDialog.onOpen}
                                    />
                                    <IconButton
                                        className={`${selects.length == 1 ? "visible" : "invisible"}`}
                                        icon={<EditIcon/>}
                                        aria-label={""}
                                        colorScheme={"teal"}
                                        variant={"outline"}
                                        onClick={editBodyModalDisclosure.onOpen}
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