import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Checkbox,
    IconButton,
    Skeleton, useToast
} from "@chakra-ui/react";

import {useMutation} from "@apollo/client";
import {ResearchField} from "@/models";
import {DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {Dispatch, SetStateAction} from "react";

import {DELETE_RESEARCH_FIELD_MUTATION, LIST_RESEARCH_FIELDS_QUERY} from "@/apollo";

export interface FieldItemProps {
    field: ResearchField
    loading: boolean
    selects: ResearchField[]
    setSelects: Dispatch<SetStateAction<ResearchField[]>>
    onEditClick: () => void
}

export function FieldItem({field, loading, setSelects, selects, onEditClick}: FieldItemProps) {
    const toast = useToast();
    const [deleteResearchFieldMutation, deleteResearchFieldMutationResult] = useMutation(DELETE_RESEARCH_FIELD_MUTATION, {
        refetchQueries: [{
            query: LIST_RESEARCH_FIELDS_QUERY
        }]
    });

    async function handleFieldDeleteClick(field: ResearchField) {
        await deleteResearchFieldMutation({
            variables: {
                id: field.id
            }
        })

        toast({
            title: `Área de pesquisa apagada`,
            description: `Área de pesquisa ${field.name} apagada com sucesso`,
            status: "success",
            colorScheme: "teal",
            position: "top",
            isClosable: true,
        })
    }

    return (
        <AccordionItem key={field?.id}>
            <div className={"flex gap-1 items-center"}>
                <Skeleton maxHeight={"1rem"} isLoaded={!loading}>
                    <Checkbox
                        isChecked={selects.includes(field)}
                        onChange={() => {
                            if (selects.includes(field)) {
                                setSelects(selects.filter(f => f.id != field.id));
                            } else {
                                setSelects(selects => [...selects, field]);
                            }
                        }}
                    />
                </Skeleton>
                <Skeleton className={"w-full"}
                          isLoaded={!loading}
                >
                    <div className={"w-full flex"}>
                        <AccordionButton
                            className={"flex w-full justify-between p-4"}>
                            {field?.name}
                            <AccordionIcon/>
                        </AccordionButton>
                    </div>
                </Skeleton>
            </div>
            <AccordionPanel className={"ps-8 pe-0"}>
                <div className={"flex flex-col justify-end"}>
                    <ul>
                        {field.subfields?.map((subfield) => {
                            return (
                                <li
                                    key={subfield.id}
                                    className={"flex justify-between items-center p-3 rounded-xl hover:bg-slate-100"}
                                >
                                    {subfield.name}
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className={"float-right flex gap-2 p-1"}>
                    <IconButton
                        onClick={() => {
                            setSelects([field])
                            onEditClick()
                        }}
                        aria-label={""}
                        icon={<EditIcon/>}
                        variant={"link"}
                        colorScheme={"teal"}
                        padding={2}
                    />
                    <IconButton
                        onClick={() => handleFieldDeleteClick(field)}
                        isLoading={deleteResearchFieldMutationResult.loading}
                        aria-label={""}
                        icon={<DeleteIcon/>}
                        variant={"link"}
                        colorScheme={"teal"}
                        padding={2}
                    />
                </div>
            </AccordionPanel>
        </AccordionItem>

    )
}
