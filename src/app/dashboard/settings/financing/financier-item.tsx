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

import {Financier} from "@/models";
import {useMutation} from "@apollo/client";
import {Dispatch, SetStateAction} from "react";

import {DELETE_FINANCIER_MUTATION, LIST_FINANCIERS_QUERY} from "@/apollo";
import {DeleteAlertDialog} from "@/components/delete-alert-dialog";
import {EditFinancierModal} from "@/app/dashboard/settings/financing/edit-financier-modal";


export interface FinancierItemProps {
    financier: Financier
    loading: boolean
    selects: Financier[]
    setSelects: Dispatch<SetStateAction<Financier[]>>
}

export function FinancierItem({financier, loading, setSelects, selects}: FinancierItemProps) {
    const toast = useToast();
    const [deleteFinancierMutation, deleteFinancierMutationResult] = useMutation(
        DELETE_FINANCIER_MUTATION,
        {
            refetchQueries: [LIST_FINANCIERS_QUERY]
        }
    )
    const deleteAlertDialogDisclosure = useDisclosure();
    const editFinancierModalDisclosure = useDisclosure();

    async function handleDeleteClassificationButtonClick() {
        await deleteFinancierMutation({
            variables: {
                id: financier.id
            }
        })

        toast({
            title: "Financiador Apagado!",
            description: `Financiador ${financier.name} apagado com sucesso.`,
            status: "success",
            isClosable: true,
            position: "top",
            colorScheme: "teal",
        })
    }

    return (
        <>
            <EditFinancierModal
                financier={financier}
                isOpen={editFinancierModalDisclosure.isOpen}
                onClose={editFinancierModalDisclosure.onClose}
            />
            <DeleteAlertDialog
                title={"Apagar Financiador"}
                description={"Tem certeza que deseja apagar o financiador?"}
                onConfirm={handleDeleteClassificationButtonClick}
                isOpen={deleteAlertDialogDisclosure.isOpen}
                onClose={deleteAlertDialogDisclosure.onClose}
            />
            <AccordionItem key={financier?.id}>
                <div className={"flex gap-1 items-center"}>
                    <Skeleton maxHeight={"1rem"} isLoaded={!loading}>
                        <Checkbox
                            isChecked={selects.includes(financier)}
                            onChange={() => {
                                if (selects.includes(financier)) {
                                    setSelects(selects.filter(selected => selected.id !== financier.id))
                                } else {
                                    setSelects(selects => [...selects, financier])
                                }
                            }}
                        />
                    </Skeleton>
                    <Skeleton className={"w-full"} isLoaded={!loading}>
                        <div className={"w-full flex"}>
                            <AccordionButton className={"flex w-full justify-between p-4"}>
                                {financier?.name}
                                <AccordionIcon/>
                            </AccordionButton>
                        </div>
                    </Skeleton>
                </div>
                <AccordionPanel>
                    <p>{financier?.description}</p>
                    <div className={"float-right flex gap-2 p-1"}>
                        <IconButton
                            onClick={editFinancierModalDisclosure.onOpen}
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
                            onClick={deleteAlertDialogDisclosure.onOpen}
                        />
                    </div>
                </AccordionPanel>
            </AccordionItem>
        </>
    )
}