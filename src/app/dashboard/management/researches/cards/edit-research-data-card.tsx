import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Select,
    Skeleton,
    useToast
} from "@chakra-ui/react";

import {
    Research,
    ResearchClassification,
    ResearchField,
    ResearchScope,
} from "@/models";

import React, {Dispatch, SetStateAction, useCallback, useEffect, useMemo} from "react";

import {useMutation, useQuery} from "@apollo/client";

import {
    LIST_RESEARCH_CLASSIFICATIONS_QUERY,
    LIST_RESEARCH_FIELDS_QUERY,
    LIST_RESEARCH_SCOPES_QUERY,
    LIST_RESEARCHES_QUERY,
    UPDATE_RESEARCH_MUTATION
} from "@/apollo";

export interface EditResearchDataProps {
    readonly research: Research
    readonly setResearch: Dispatch<SetStateAction<Research>>
}

export function EditResearchDataCard({research, setResearch}: EditResearchDataProps) {
    const listResearchClassificationQuery = useQuery(LIST_RESEARCH_CLASSIFICATIONS_QUERY, {
        pollInterval: 1000 * 10,
        notifyOnNetworkStatusChange: true
    });
    const listResearchFieldsQuery = useQuery(LIST_RESEARCH_FIELDS_QUERY, {
        pollInterval: 1000 * 10
    });
    const listResearchScopesQuery = useQuery(LIST_RESEARCH_SCOPES_QUERY, {
        pollInterval: 1000 * 10
    });
    const [updateResearchMutation, updateResearchMutationResult] = useMutation(UPDATE_RESEARCH_MUTATION, {
        refetchQueries: [LIST_RESEARCHES_QUERY]
    });

    const classifications = useMemo(() => {
        return (listResearchClassificationQuery.data?.listResearchClassifications || []) as ResearchClassification[]
    }, [listResearchClassificationQuery])

    const fields = useMemo(() => {
        return (listResearchFieldsQuery.data?.listResearchFields || []) as ResearchField[]
    }, [listResearchFieldsQuery])

    const scopes = useMemo(() => {
        return (listResearchScopesQuery.data?.listResearchScopes || []) as ResearchScope[]
    }, [listResearchScopesQuery])

    const toast = useToast();

    const handleSaveButtonClick = useCallback(async () => {
        await updateResearchMutation({
            variables: {
                input: {
                    id: research.id,
                    otherScope: research.otherScope,
                    endDate: research.endDate,
                    startDate: research.startDate,
                    acronym: research.acronym,
                    title: research.title,
                    code: research.code,
                    researchSubfieldId: research.subfield?.id,
                    researchScopeId: research.scope?.id,
                    researchSubtypeId: research.subtype?.id,
                    visibility: research.visibility
                }
            }
        })

        toast({
            title: "Pesquisa Atualizada",
            description: `Pesquisa "${research.title}" atualizada com sucesso.`,
            status: "success",
            isClosable: true,
            position: "top",
            colorScheme: "teal",
        })
    }, [research, toast, updateResearchMutation])

    useEffect(() => {
        if (!research.classification || !research.field && (classifications && fields && scopes)) {

            const classification = classifications.find(classification => {
                return classification.types?.find((type) => type.subtypes?.find(subtype => subtype.id === research.subtype?.id))
            })

            if (classification) {
                const type = classification.types && classification.types.find(type => type.subtypes?.find((subtype) => subtype.id === research.subtype?.id))

                if (type) {
                    setResearch((research) => {
                        return {
                            ...research,
                            classification,
                            type,
                        }
                    })
                }
            }

            const field = fields.find((field => field.subfields?.find(subfield => subfield.id === research.subfield?.id)))

            if (field) {
                setResearch(research => {
                    return {
                        ...research,
                        field,
                    }
                })
            }
        }
    }, [classifications, fields, research, scopes, setResearch])

    return (
        <Card>
            <CardHeader>
                <Heading size={"md"} colorScheme={"teal"}>Pesquisa</Heading>
            </CardHeader>
            <CardBody>
                <div className={"flex flex-col gap-4"}>
                    <div>
                        <FormControl isRequired={true}>
                            <FormLabel className={"text-sm"}>Código da pesquisa</FormLabel>
                            <Input
                                onChange={(e) => {
                                    setResearch({
                                        ...research,
                                        code: e.target.value
                                    })
                                }}
                                defaultValue={research.code}
                                type={"text"}
                            />
                        </FormControl>
                    </div>
                    <div className={"grid grid-rows-2 gap-4 md:grid-cols-3 md:grid-rows-none"}>
                        <div>
                            <FormControl isRequired={true}>
                                <FormLabel className={"text-sm"}>Acrónimo da pesquisa</FormLabel>
                                <Input
                                    onChange={(e) => {
                                        setResearch({
                                            ...research,
                                            acronym: e.target.value
                                        })
                                    }}
                                    defaultValue={research.acronym}
                                    type={"text"}
                                />
                            </FormControl>
                        </div>
                        <div className={"md:col-span-2"}>
                            <FormControl>
                                <FormLabel className={"text-sm"}>Título da pesquisa</FormLabel>
                                <Input
                                    onChange={(e) => {
                                        setResearch({
                                            ...research,
                                            title: e.target.value
                                        })
                                    }}
                                    defaultValue={research.title}
                                    type={"text"}
                                />
                            </FormControl>
                        </div>
                    </div>
                    <div className={"grid grid-rows-3 gap-4 md:grid-cols-3 md:grid-rows-none"}>
                        <FormControl isRequired={true}>
                            <FormLabel className={"text-sm"}>Classificação da pesquisa</FormLabel>
                            <Skeleton isLoaded={!!classifications.length}>
                                <Select
                                    value={research.classification?.id}
                                    onChange={e => {
                                        const classification = classifications?.find(c => c.id === e.target.value)
                                        const type = classification?.types && classification?.types[0]
                                        const subtype = type?.subtypes && type.subtypes[0]

                                        setResearch({
                                            ...research,
                                            classification,
                                            type,
                                            subtype
                                        })
                                    }}
                                >
                                    {
                                        classifications?.map((classification: ResearchClassification, index) => {
                                            return (
                                                <option
                                                    value={classification.id}
                                                    key={classification.id}
                                                >
                                                    {classification.name}
                                                </option>
                                            )
                                        })
                                    }
                                </Select>
                            </Skeleton>
                        </FormControl>
                        <FormControl isRequired={true}>
                            <FormLabel className={"text-sm"}>Tipo de pesquisa</FormLabel>
                            <Skeleton isLoaded={!!research.classification?.types?.length}>
                                <Select
                                    value={research.type?.id}
                                    onChange={e => {
                                        const type = research.classification?.types?.find(c => c.id === e.target.value)
                                        const subtype = type?.subtypes && type?.subtypes[0]
                                        if (type) {
                                            setResearch({
                                                ...research,
                                                type,
                                                subtype
                                            })
                                        }
                                    }}
                                >
                                    {
                                        research.classification?.types?.map((type, index) => {
                                            return (
                                                <option key={type.id} value={type.id}>
                                                    {type.name}
                                                </option>
                                            )
                                        })
                                    }
                                </Select>
                            </Skeleton>
                        </FormControl>
                        <FormControl isRequired={true}>
                            <FormLabel className={"text-sm"}>Subtipo de pesquisa</FormLabel>
                            <Skeleton isLoaded={!!research.type?.subtypes?.length}>
                                <Select
                                    value={research.subtype?.id}
                                    onChange={e => {
                                        setResearch({
                                            ...research,
                                            subtype: research.type?.subtypes?.find(c => c.id === e.target.value)
                                        })
                                    }}
                                >
                                    {
                                        research.type?.subtypes?.map((subtype, index) => {
                                            return (
                                                <option
                                                    key={subtype.id}
                                                    value={subtype.id}
                                                >
                                                    {subtype.name}
                                                </option>
                                            )
                                        })
                                    }
                                </Select>
                            </Skeleton>
                        </FormControl>
                    </div>
                    <div className={"grid grid-rows-2 gap-4 md:grid-cols-2 md:grid-rows-none"}>
                        <FormControl>
                            <FormLabel className={"text-sm"}>Área da pesquisa</FormLabel>
                            <Skeleton isLoaded={!!fields.length}>
                                <Select
                                    value={research.field?.id}
                                    onChange={e => {
                                        setResearch({
                                            ...research,
                                            field: fields?.find(c => c.id === e.target.value)
                                        })
                                    }}
                                >
                                    {
                                        fields?.map((field, index) => {
                                            return (
                                                <option
                                                    value={field.id}
                                                    key={field.id}
                                                >
                                                    {field.name}
                                                </option>
                                            )
                                        })
                                    }
                                </Select>
                            </Skeleton>
                        </FormControl>
                        <FormControl isRequired={true}>
                            <FormLabel className={"text-sm"}>Subárea de pesquisa</FormLabel>
                            <Skeleton isLoaded={!!research.field?.subfields?.length}>
                                <Select
                                    value={research.subfield?.id}
                                    onChange={e => {
                                        setResearch({
                                            ...research,
                                            subfield: research.field?.subfields?.find(c => c.id === e.target.value)
                                        })
                                    }}
                                >
                                    {
                                        research.field?.subfields?.map((subfield, index) => {
                                            return (
                                                <option
                                                    value={subfield.id}
                                                    key={subfield.id}
                                                >
                                                    {subfield.name}
                                                </option>
                                            )
                                        })
                                    }
                                </Select>
                            </Skeleton>
                        </FormControl>
                    </div>
                    <div className={"grid grid-rows-2 gap-4 md:grid-cols-2 md:grid-rows-none"}>
                        <FormControl isRequired={!research.otherScope}>
                            <FormLabel className={"text-sm"}>Âmbito da pesquisa</FormLabel>
                            <Skeleton isLoaded={!!scopes.length}>
                                <Select
                                    value={research.scope?.id}
                                    onChange={e => {
                                        setResearch({
                                            ...research,
                                            scope: scopes?.find(c => c.id === e.target.value)
                                        })
                                    }}
                                >
                                    <option value={""}></option>
                                    {
                                        scopes?.map((scope, index) => {
                                            return (
                                                <option
                                                    value={scope.id}
                                                    key={scope.id}
                                                >
                                                    {scope.name}
                                                </option>
                                            )
                                        })
                                    }
                                </Select>
                            </Skeleton>
                        </FormControl>
                        <FormControl>
                            <FormLabel className={"text-sm"}>Outro Âmbito da pesquisa</FormLabel>
                            <Skeleton isLoaded={!!scopes.length}>
                                <Input
                                    onChange={(e) => {
                                        setResearch({
                                            ...research,
                                            otherScope: e.target.value
                                        })
                                    }}
                                    defaultValue={research.otherScope}
                                    type={"text"}
                                />
                            </Skeleton>
                        </FormControl>
                    </div>
                    <div className={"grid grid-rows-2 gap-4 md:grid-cols-2 md:grid-rows-none"}>
                        <FormControl>
                            <FormLabel className={"text-sm"}>Data de Início</FormLabel>
                            <Input
                                onChange={(e) => {
                                    setResearch({
                                        ...research,
                                        startDate: e.target.value
                                    })
                                }}
                                defaultValue={research.startDate && new Date(research?.startDate).toISOString().split("T")[0]}
                                type={"date"}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel className={"text-sm"}>Data de Fim</FormLabel>
                            <Input
                                onChange={(e) => {
                                    setResearch({
                                        ...research,
                                        endDate: e.target.value
                                    })
                                }}
                                defaultValue={research.endDate && new Date(research?.endDate).toISOString().split("T")[0]}
                                type={"date"}
                            />
                        </FormControl>
                    </div>
                </div>
            </CardBody>
            <CardFooter>
                <div className={"flex justify-end w-full"}>
                    <Button
                        isLoading={updateResearchMutationResult.loading}
                        onClick={handleSaveButtonClick}
                        colorScheme={"teal"}>Guardar</Button>
                </div>
            </CardFooter>
        </Card>

    )
}
