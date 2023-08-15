import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Checkbox,
    IconButton,
    Skeleton,
    useDisclosure,
    useToast
} from "@chakra-ui/react";

import {DeleteIcon, EditIcon} from "@chakra-ui/icons";

import {ResearcherRole} from "@/models";
import {useMutation} from "@apollo/client";
import {Dispatch, SetStateAction} from "react";

import {DELETE_RESEARCHER_ROLE_MUTATION, LIST_RESEARCHER_ROLES_QUERY} from "@/apollo";
import {DeleteAlertDialog} from "@/components/delete-alert-dialog";
import {EditResearcherRoleModal} from "@/app/dashboard/settings/researchers/edit-researcher-role-modal";
import {useDefault} from "@/hooks/default";

export interface ResearcherRoleItemProps {
    role: ResearcherRole
    loading: boolean
    selects: ResearcherRole[]
    setSelects: Dispatch<SetStateAction<ResearcherRole[]>>
}

export function ResearcherRoleItem({role, loading, setSelects, selects}: ResearcherRoleItemProps) {
    const toast = useToast();
    const [deleteResearcherRoleMutation, deleteResearcherRoleMutationResult] = useMutation(
        DELETE_RESEARCHER_ROLE_MUTATION,
        {
            refetchQueries: [LIST_RESEARCHER_ROLES_QUERY]
        }
    )
    const deleteAlertDialogDisclosure = useDisclosure();
    const editResearcherRoleModalDisclosure = useDisclosure();
    const {isDefault} = useDefault()

    async function handleDeleteRoleButtonClick() {
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

    return (
        <>
            <EditResearcherRoleModal
                role={role}
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
            <AccordionItem key={role?.id}>
                <div className={"flex gap-1 items-center"}>
                    <Skeleton maxHeight={"1rem"} isLoaded={!loading}>
                        <Checkbox
                            isChecked={selects.includes(role)}
                            onChange={() => {
                                if (selects.includes(role)) {
                                    setSelects(selects.filter(selected => selected.id !== role.id))
                                } else {
                                    setSelects(selects => [...selects, role])
                                }
                            }}
                        />
                    </Skeleton>
                    <Skeleton className={"w-full"} isLoaded={!loading}>
                        <div className={"w-full flex"}>
                            <AccordionButton className={"flex w-full justify-between p-4"}>
                                {role?.name}
                                <AccordionIcon/>
                            </AccordionButton>
                        </div>
                    </Skeleton>
                </div>
                <AccordionPanel>
                    <p>{role?.description}</p>
                    <div className={"float-right flex gap-2 p-1"}>
                        <IconButton
                            onClick={editResearcherRoleModalDisclosure.onOpen}
                            aria-label={""}
                            icon={<EditIcon/>}
                            variant={"link"}
                            colorScheme={"teal"}
                            padding={2}
                        />
                        <IconButton
                            aria-label={""}
                            icon={<DeleteIcon/>}
                            variant={"link"}
                            colorScheme={"teal"}
                            padding={2}
                            isDisabled={isDefault(role)}
                            onClick={deleteAlertDialogDisclosure.onOpen}
                        />
                    </div>
                </AccordionPanel>
            </AccordionItem>
        </>
    )
}