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

import {FinancingType} from "@/models";
import {useMutation} from "@apollo/client";
import {Dispatch, SetStateAction} from "react";

import {DELETE_FINANCING_TYPE_MUTATION, LIST_FINANCING_TYPES_QUERY} from "@/apollo";
import {DeleteAlertDialog} from "@/components/delete-alert-dialog";
import {EditFinancingTypeModal} from "@/app/dashboard/settings/financing/edit-financing-type-modal";


export interface FinancingTypeItemProps {
    financingType: FinancingType
    loading: boolean
    selects: FinancingType[]
    setSelects: Dispatch<SetStateAction<FinancingType[]>>
}

export function FinancingTypeItem({financingType, loading, setSelects, selects}: FinancingTypeItemProps) {
    const toast = useToast();
    const [deleteFinancingTypeMutation, deleteFinancingTypeMutationResult] = useMutation(
        DELETE_FINANCING_TYPE_MUTATION,
        {
            refetchQueries: [LIST_FINANCING_TYPES_QUERY]
        }
    )
    const deleteAlertDialogDisclosure = useDisclosure();
    const editFinancingTypeModalDisclosure = useDisclosure();

    async function handleDeleteClassificationButtonClick() {
        await deleteFinancingTypeMutation({
            variables: {
                id: financingType.id
            }
        })

        toast({
            title: "Tipo de Financiamento Apagado!",
            description: `Tipo de Financiamento ${financingType.name} apagado com sucesso.`,
            status: "success",
            isClosable: true,
            position: "top",
            colorScheme: "teal",
        })
    }

    return (
        <>
            <EditFinancingTypeModal
                financingType={financingType}
                isOpen={editFinancingTypeModalDisclosure.isOpen}
                onClose={editFinancingTypeModalDisclosure.onClose}
            />
            <DeleteAlertDialog
                title={"Apagar Tipo de Financiamento"}
                description={"Tem certeza que deseja apagar o tipo de financiamento?"}
                onConfirm={handleDeleteClassificationButtonClick}
                isOpen={deleteAlertDialogDisclosure.isOpen}
                onClose={deleteAlertDialogDisclosure.onClose}
            />
            <AccordionItem key={financingType?.id}>
                <div className={"flex gap-1 items-center"}>
                    <Skeleton maxHeight={"1rem"} isLoaded={!loading}>
                        <Checkbox
                            isChecked={selects.includes(financingType)}
                            onChange={() => {
                                if (selects.includes(financingType)) {
                                    setSelects(selects.filter(selected => selected.id !== financingType.id))
                                } else {
                                    setSelects(selects => [...selects, financingType])
                                }
                            }}
                        />
                    </Skeleton>
                    <Skeleton className={"w-full"} isLoaded={!loading}>
                        <div className={"w-full flex"}>
                            <AccordionButton className={"flex w-full justify-between p-4"}>
                                {financingType?.name}
                                <AccordionIcon/>
                            </AccordionButton>
                        </div>
                    </Skeleton>
                </div>
                <AccordionPanel>
                    <p>{financingType?.description}</p>
                    <div className={"float-right flex gap-2 p-1"}>
                        <IconButton
                            onClick={editFinancingTypeModalDisclosure.onOpen}
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