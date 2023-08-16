"use client";

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
    Tooltip,
    useDisclosure,
    useToast
} from "@chakra-ui/react";

import {useQuery, useMutation} from "@apollo/client";
import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import {AiOutlineSearch} from "react-icons/ai";
import {ResearchField} from "@/models";

import {DELETE_RESEARCH_FIELD_MUTATION, LIST_RESEARCH_FIELDS_QUERY} from "@/apollo";

import {fakeFields} from "@/skelton-data";
import {FieldItem} from "@/app/dashboard/settings/researches/field/field-item";
import {EditFieldModal} from "@/app/dashboard/settings/researches/field/edit-field-modal";
import {CreateFieldModal} from "@/app/dashboard/settings/researches/field/create-field-modal";

export function FieldSettings() {
    const toast = useToast();
    const createFieldModalDisclosure = useDisclosure();
    const editFieldModalDisclosure = useDisclosure();
    const [fields, setFields] = useState<ResearchField[]>(fakeFields);

    const [isInvalid, setInvalid] = useState(false);
    const [selects, setSelects] = useState<ResearchField[]>([]);
    const [search, setSearch] = useState("");

    const listResearchFieldsQuery = useQuery(LIST_RESEARCH_FIELDS_QUERY);
    const [deleteResearchFieldMutation, deleteResearchFieldMutationResult] = useMutation(DELETE_RESEARCH_FIELD_MUTATION, {
        refetchQueries: [{
            query: LIST_RESEARCH_FIELDS_QUERY
        }]
    });

    const filteredList: ResearchField[] = fields.filter(field => field.name.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        if (listResearchFieldsQuery.data?.listResearchFields) {
            setFields(listResearchFieldsQuery.data.listResearchFields);
            setSelects(prevState => listResearchFieldsQuery.data?.listResearchFields.filter((f: ResearchField) => prevState.find(value => value.id === f.id)))
        }
    }, [listResearchFieldsQuery, setSelects])

    async function handleSelectedFieldsDeleteClick() {
        for (let field of selects) {
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
    }

    function handleFieldEditClick() {
        editFieldModalDisclosure.onOpen();
    }

    return (
        <>
            <CreateFieldModal
                isOpen={createFieldModalDisclosure.isOpen}
                onClose={createFieldModalDisclosure.onClose}
            />

            <EditFieldModal
                isOpen={editFieldModalDisclosure.isOpen}
                onClose={editFieldModalDisclosure.onClose}
                field={selects[0]}
            />

            <Card className={"min-h-[30rem] xl:min-h-[36rem] max-h-[80vh] w-full overflow-hidden"}>
                <CardHeader className={"bg-bar text-white p-2"}>
                    <div className={"flex justify-between items-center"}>
                        <Heading className={"font-medium flex-grow"} size={"sm"}>Áreas da pesquisa</Heading>
                        <FormControl
                            className={"flex max-w-[20rem] items-center my-auto rounded-lg bg-transparent focus-within:bg-white overflow-hidden transition-colors"}>
                            <Input variant={"unstyled"} onChange={(e) => {
                                setSelects([]);
                                setSearch(e.target.value);
                            }}
                                   className={"p-2 min-w-0 text-gray-500 appearance-none outline-none bg-transparent"}
                                   type={"text"}/>
                            <Tooltip colorScheme={"teal"} placement={"auto-end"}
                                     label={"Clique para procurar áreas de pesquisa"}>
                                <FormLabel className={"h-full"}>
                                    <AiOutlineSearch className={"text-lg mt-2 fill-gray-400"}/>
                                </FormLabel>
                            </Tooltip>
                        </FormControl>
                    </div>
                </CardHeader>
                <CardBody className={"flex flex-col"}>
                    <div className={"w-full flex-1 flex"}>
                        <div className={"flex flex-1 gap-4 flex-col justify-between"}>
                            <Accordion allowMultiple={true}>
                                {
                                    (search.length > 0 ? filteredList : fields).map((field) => {
                                        return (
                                            <FieldItem
                                                key={field.id}
                                                field={field}
                                                loading={listResearchFieldsQuery.loading || fields === fakeFields}
                                                selects={selects}
                                                setSelects={setSelects}
                                                onEditClick={editFieldModalDisclosure.onOpen}
                                            />
                                        )
                                    })
                                }
                            </Accordion>

                            <div className={"flex items-center justify-between flex-row-reverse gap-2 transition-all"}>
                                <div className={"flex flex-row-reverse gap-2 transition-all"}>
                                    <IconButton
                                        onClick={createFieldModalDisclosure.onOpen}
                                        aria-label={""}
                                        icon={<AddIcon/>}
                                        colorScheme={"teal"}
                                    />
                                    <IconButton
                                        onClick={handleSelectedFieldsDeleteClick}
                                        isLoading={deleteResearchFieldMutationResult.loading}
                                        className={`${selects.length > 0 ? "visible" : "invisible"}`}
                                        colorScheme={"teal"}
                                        aria-label={""} icon={<DeleteIcon/>}
                                        variant={"outline"}
                                    />
                                    <IconButton
                                        icon={<EditIcon/>}
                                        onClick={handleFieldEditClick}
                                        aria-label={""}
                                        colorScheme={"teal"}
                                        className={`${selects.length == 1 ? "visible" : "invisible"}`}
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
