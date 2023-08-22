import {
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Select,
    Skeleton,
} from "@chakra-ui/react";

import {
    Research,
    ResearchClassification,
    ResearchField,
    ResearchScope,
} from "@/models";

import React, {Dispatch, SetStateAction, useEffect, useMemo} from "react";

import {useQuery} from "@apollo/client";

import {
    LIST_RESEARCH_CLASSIFICATIONS_QUERY,
    LIST_RESEARCH_FIELDS_QUERY,
    LIST_RESEARCH_SCOPES_QUERY,
} from "@/apollo";

export interface EditResearchDataProps {
    readonly research: Research
    readonly setResearch: Dispatch<SetStateAction<Research>>
}

export function ViewResearchDataCard({research, setResearch}: EditResearchDataProps) {
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

    const classifications = useMemo(() => {
        return (listResearchClassificationQuery.data?.listResearchClassifications || []) as ResearchClassification[]
    }, [listResearchClassificationQuery])

    const fields = useMemo(() => {
        return (listResearchFieldsQuery.data?.listResearchFields || []) as ResearchField[]
    }, [listResearchFieldsQuery])

    const scopes = useMemo(() => {
        return (listResearchScopesQuery.data?.listResearchScopes || []) as ResearchScope[]
    }, [listResearchScopesQuery])

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
                        <FormControl>
                            <FormLabel className={"text-sm"}>Código da pesquisa</FormLabel>
                            <Input
                                isReadOnly={true}
                                defaultValue={research.code}
                                type={"text"}
                            />
                        </FormControl>
                    </div>
                    <div className={"grid grid-rows-2 gap-4 md:grid-cols-3 md:grid-rows-none"}>
                        <div>
                            <FormControl>
                                <FormLabel className={"text-sm"}>Acrónimo da pesquisa</FormLabel>
                                <Input
                                    isReadOnly={true}
                                    defaultValue={research.acronym}
                                    type={"text"}
                                />
                            </FormControl>
                        </div>
                        <div className={"md:col-span-2"}>
                            <FormControl>
                                <FormLabel className={"text-sm"}>Título da pesquisa</FormLabel>
                                <Input
                                    isReadOnly={true}
                                    defaultValue={research.title}
                                    type={"text"}
                                />
                            </FormControl>
                        </div>
                    </div>
                    <div className={"grid grid-rows-3 gap-4 md:grid-cols-3 md:grid-rows-none"}>
                        <FormControl>
                            <FormLabel className={"text-sm"}>Classificação da pesquisa</FormLabel>
                            <Skeleton isLoaded={!!classifications.length}>
                                <Select
                                    isReadOnly={true}
                                    value={research.classification?.id}
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
                        <FormControl>
                            <FormLabel className={"text-sm"}>Tipo de pesquisa</FormLabel>
                            <Skeleton isLoaded={!!research.classification?.types?.length}>
                                <Select
                                    isReadOnly={true}
                                    value={research.type?.id}
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
                        <FormControl>
                            <FormLabel className={"text-sm"}>Subtipo de pesquisa</FormLabel>
                            <Skeleton isLoaded={!!research.type?.subtypes?.length}>
                                <Select
                                    isReadOnly={true}
                                    value={research.subtype?.id}
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
                                    isReadOnly={true}
                                    value={research.field?.id}
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
                        <FormControl>
                            <FormLabel className={"text-sm"}>Subárea de pesquisa</FormLabel>
                            <Skeleton isLoaded={!!research.field?.subfields?.length}>
                                <Select
                                    isReadOnly={true}
                                    value={research.subfield?.id}
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
                        <FormControl>
                            <FormLabel className={"text-sm"}>Âmbito da pesquisa</FormLabel>
                            <Skeleton isLoaded={!!scopes.length}>
                                <Select
                                    isReadOnly={true}
                                    value={research.scope?.id}
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
                                    isReadOnly={true}
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
                                isReadOnly={true}
                                defaultValue={research.startDate && new Date(research?.startDate).toISOString().split("T")[0]}
                                type={"date"}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel className={"text-sm"}>Data de Fim</FormLabel>
                            <Input
                                isReadOnly={true}
                                defaultValue={research.endDate && new Date(research?.endDate).toISOString().split("T")[0]}
                                type={"date"}
                            />
                        </FormControl>
                    </div>
                </div>
            </CardBody>
        </Card>

    )
}
