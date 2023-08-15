import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Checkbox,
    IconButton,
    Skeleton, useDisclosure, useToast
} from "@chakra-ui/react";
import {DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {ResearchClassification} from "@/models";
import {Dispatch, SetStateAction} from "react";
import {useMutation} from "@apollo/client";
import {DELETE_RESEARCH_CLASSIFICATION_MUTATION, LIST_RESEARCH_CLASSIFICATIONS_QUERY} from "@/apollo";
import {DeleteAlertDialog} from "@/components/delete-alert-dialog";
import {EditClassificationModal} from "@/app/dashboard/settings/researches/classification/edit-classification-modal";


export interface ClassificationItemProps {
    classification: ResearchClassification
    loading: boolean
    selects: ResearchClassification[]
    setSelects: Dispatch<SetStateAction<ResearchClassification[]>>
}

export function ClassificationItem({classification, loading, setSelects, selects}: ClassificationItemProps) {
    const toast = useToast();
    const [deleteResearchClassificationMutation, deleteResearchClassificationMutationResult] = useMutation(
        DELETE_RESEARCH_CLASSIFICATION_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_CLASSIFICATIONS_QUERY]
        }
    )
    const deleteAlertDialogDisclosure = useDisclosure();
    const editClassificationModalDisclosure = useDisclosure();

    async function handleDeleteClassificationButtonClick() {
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

    return (
        <>
            <EditClassificationModal
                classification={classification}
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
            <AccordionItem key={classification?.id}>
                <div className={"flex gap-1 items-center"}>
                    <Skeleton maxHeight={"1rem"} isLoaded={!loading}>
                        <Checkbox
                            isChecked={selects.includes(classification)}
                            onChange={() => {
                                if (selects.includes(classification)) {
                                    setSelects(selects.filter(selected => selected.id !== classification.id))
                                } else {
                                    setSelects(selects => [...selects, classification])
                                }
                            }}
                        />
                    </Skeleton>
                    <Skeleton className={"w-full"} isLoaded={!loading}>
                        <div className={"w-full flex"}>
                            <AccordionButton className={"flex w-full justify-between p-4"}>
                                {classification?.name}
                                <AccordionIcon/>
                            </AccordionButton>
                        </div>
                    </Skeleton>
                </div>
                <AccordionPanel className={"ps-8 pe-0"}>
                    <div className={"flex flex-col justify-end"}>
                        <Accordion allowMultiple={true}>
                            {classification.types?.map((type) => {
                                return (
                                    <AccordionItem
                                        key={type.id}
                                        className={"border-none p-3 rounded-xl hover:bg-slate-100"}
                                    >
                                        <AccordionButton className={"hover:bg-transparent flex justify-between"}>
                                            {type.name}
                                            <AccordionIcon/>
                                        </AccordionButton>
                                        <AccordionPanel>
                                            <div className={"flex flex-col justify-end"}>
                                                <ul>
                                                    {type.subtypes?.map((subtype) => {
                                                        return (
                                                            <li
                                                                key={subtype.id}
                                                                className={"flex justify-between items-center p-3 ps-4 rounded-xl hover:bg-slate-200"}
                                                            >
                                                                {subtype.name}
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        </AccordionPanel>
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
                    </div>
                    <div className={"float-right flex gap-2 p-1"}>
                        <IconButton
                            onClick={editClassificationModalDisclosure.onOpen}
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