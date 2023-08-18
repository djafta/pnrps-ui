import {Card, CardBody, CardHeader, FormControl, FormLabel, Heading, Input, Select, Skeleton} from "@chakra-ui/react";
import {
    Research,
    ResearchClassification,
    ResearchField,
    ResearchScope,
} from "@/models";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useQuery} from "@apollo/client";
import {
    LIST_RESEARCH_CLASSIFICATIONS_QUERY,
    LIST_RESEARCH_FIELDS_QUERY,
    LIST_RESEARCH_SCOPES_QUERY
} from "@/apollo";

export interface ResearchDataProps {
    readonly research: Research
    readonly setResearch: Dispatch<SetStateAction<Research>>
}

export function CreateResearchDataCard({research, setResearch}: ResearchDataProps) {
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

    const [classifications, setClassifications] = useState<ResearchClassification[]>([])
    const [fields, setFields] = useState<ResearchField[]>([])
    const [scopes, setScopes] = useState<ResearchScope[]>([])

    useEffect(() => {
        if (listResearchClassificationQuery.data?.listResearchClassifications) {
            setClassifications(listResearchClassificationQuery.data?.listResearchClassifications)
        }
        if (listResearchFieldsQuery.data?.listResearchFields) {
            setFields(listResearchFieldsQuery.data.listResearchFields)
        }
        if (listResearchScopesQuery.data?.listResearchScopes) {
            setScopes(listResearchScopesQuery.data.listResearchScopes)
        }
    }, [
        listResearchClassificationQuery,
        listResearchFieldsQuery,
        listResearchScopesQuery,
    ])

    useEffect(() => {
        const classification = classifications[0]

        if (classification) {
            const type = classification.types && classification.types[0]
            if (type) {
                setResearch((research) => {
                    return {
                        ...research,
                        classification,
                        type,
                        subtype: type.subtypes && type.subtypes[0]
                    }
                })
            }
        }

        const field = fields[0]
        if (field) {
            setResearch(research => {
                return {
                    ...research,
                    field,
                    subfield: field.subfields && field.subfields[0]
                }
            })
        }
    }, [classifications, fields, setResearch])

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
                                defaultValue={research.startDate}
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
                                defaultValue={research.endDate}
                                type={"date"}
                            />
                        </FormControl>
                    </div>
                </div>
            </CardBody>
        </Card>

    )
}
