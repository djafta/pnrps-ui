import {
    Button,
    Card,
    CardBody, CardFooter,
    CardHeader,
    FormLabel,
    Heading,
    Input,
    Select,
    Skeleton,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs, useToast
} from "@chakra-ui/react";
import {Country, Region, Province, Research} from "@/models";
import React, {Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {
    LIST_COUNTRIES_QUERY,
    LIST_RESEARCHES_QUERY,
    UPDATE_RESEARCH_COVERAGE_AREA_MUTATION,
} from "@/apollo";

export interface EditGeographicDataProps {
    readonly research: Research
    readonly setResearch: Dispatch<SetStateAction<Research>>
}

export function EditResearchGeographicDataCard({research, setResearch}: EditGeographicDataProps) {
    const listResearchCountriesQuery = useQuery(LIST_COUNTRIES_QUERY, {
        pollInterval: 1000 * 10 // 10 seconds
    });
    const [updateResearchMutation, updateResearchMutationResult] = useMutation(UPDATE_RESEARCH_COVERAGE_AREA_MUTATION, {
        refetchQueries: [LIST_RESEARCHES_QUERY]
    });
    const [countries, setCountries] = useState<Country[]>([])
    const [index, setIndex] = useState(0);
    const toast = useToast();

    const handleSaveButtonClick = useCallback(async () => {
        console.log({
            input: {
                id: research.id,
                countries: index === 0 ? research.countries : undefined,
                regionId: index === 1 ? research.region?.id : undefined,
                provinceId: index === 2 ? research.province?.id : undefined,
            }
        })

        await updateResearchMutation({
            variables: {
                input: {
                    id: research.id,
                    countries: index === 0 ? research.countries : undefined,
                    regionId: index === 1 ? research.region?.id : undefined,
                    provinceId: index === 2 ? research.province?.id : undefined,
                }
            }
        })

        toast({
            title: "Pesquisa Atualizada",
            description: `Abrangência Geográfica da pesquisa "${research.title}" atualizada com sucesso.`,
            status: "success",
            isClosable: true,
            position: "top",
            colorScheme: "teal",
        })
    }, [research, toast, index, updateResearchMutation])

    useEffect(() => {
        if (listResearchCountriesQuery.data?.listCountries) {
            setCountries(listResearchCountriesQuery.data.listCountries)
        }
    }, [listResearchCountriesQuery])

    useEffect(() => {
        if (countries) {
            const country = countries[0]
            const region = country?.regions && country.regions[0]

            if (research.countries) {
                setIndex(0)
            } else if (research.province) {
                setIndex(2)
            } else {
                setIndex(1)
            }

            setResearch((research) => {
                return {
                    ...research,
                    country,
                    region: research.region || region,
                }
            })
        }
    }, [countries, setResearch])

    return (
        <Card>
            <CardHeader>
                <Heading size={"md"}> Informação Geográfica</Heading>
            </CardHeader>
            <CardBody>
                <div>
                    <div className={"grid grid-rows-1"}>
                        <div>
                            <Tabs index={index} variant='enclosed'
                                  onChange={(index) => {
                                      setIndex(index)
                                  }}>
                                <TabList>
                                    <Tab>Multicentrica</Tab>
                                    <Tab>Regional</Tab>
                                    <Tab>Provincial</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <div>
                                            <FormLabel className={"text-sm"}>Paises</FormLabel>
                                            <Skeleton isLoaded={!!countries}>
                                                <Input
                                                    defaultValue={research.countries}
                                                    onChange={(e) => {
                                                        setResearch({
                                                            ...research,
                                                            countries: e.target.value
                                                        })
                                                    }}
                                                    type={"text"}/>
                                            </Skeleton>
                                        </div>
                                    </TabPanel>
                                    <TabPanel>
                                        <div
                                            className={"grid grid-rows-2 gap-4 md:grid-cols-2 md:grid-rows-none"}>
                                            <div>
                                                <FormLabel className={"text-sm"}>País</FormLabel>
                                                <Skeleton isLoaded={!!countries.length}>
                                                    <Select
                                                        onChange={e => {
                                                            const country = countries?.find(c => c.id === e.target.value)
                                                            const region = country?.regions && country.regions[0]
                                                            const province = region?.provinces && region.provinces[0]

                                                            setResearch({
                                                                ...research,
                                                                countries: undefined,
                                                                country,
                                                                region,
                                                                province
                                                            })
                                                        }}
                                                    >
                                                        {
                                                            countries?.map((country: Country) => {
                                                                return (
                                                                    <option value={country.id} key={country.id}>
                                                                        {country.name}
                                                                    </option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                </Skeleton>
                                            </div>
                                            <div>
                                                <FormLabel className={"text-sm"}>Região</FormLabel>
                                                <Skeleton isLoaded={!!research.country?.regions.length}>
                                                    <Select
                                                        onChange={e => {
                                                            const region = research.country?.regions.find(r => r.id === e.target.value)
                                                            const province = region?.provinces && region.provinces[0]

                                                            setResearch({
                                                                ...research,
                                                                countries: undefined,
                                                                region,
                                                                province
                                                            })
                                                        }}
                                                    >
                                                        {
                                                            research.country?.regions?.map((region: Region) => {
                                                                return (
                                                                    <option value={region.id} key={region.id}>
                                                                        {region.name}
                                                                    </option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                </Skeleton>
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel>
                                        <div
                                            className={"grid grid-rows-3 gap-4 md:grid-cols-3 md:grid-rows-none"}>
                                            <div>
                                                <FormLabel className={"text-sm"}>País</FormLabel>
                                                <Skeleton isLoaded={!!countries.length}>
                                                    <Select
                                                        onChange={e => {
                                                            const country = countries?.find(c => c.id === e.target.value)
                                                            const region = country?.regions && country.regions[0]
                                                            const province = region?.provinces && region.provinces[0]

                                                            setResearch({
                                                                ...research,
                                                                countries: undefined,
                                                                country,
                                                                region,
                                                                province
                                                            })
                                                        }}
                                                    >
                                                        {
                                                            countries?.map((country: Country) => {
                                                                return (
                                                                    <option value={country.id} key={country.id}>
                                                                        {country.name}
                                                                    </option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                </Skeleton>
                                            </div>
                                            <div>
                                                <FormLabel className={"text-sm"}>Região</FormLabel>
                                                <Skeleton isLoaded={!!research.country?.regions.length}>
                                                    <Select
                                                        onChange={e => {
                                                            const region = research.country?.regions.find(r => r.id === e.target.value)
                                                            const province = region?.provinces && region.provinces[0]
                                                            setResearch({
                                                                ...research,
                                                                region,
                                                                province
                                                            })
                                                        }}
                                                    >
                                                        {
                                                            research.country?.regions.map((region: Region) => {
                                                                return (
                                                                    <option value={region.id} key={region.id}>
                                                                        {region.name}
                                                                    </option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                </Skeleton>
                                            </div>
                                            <div>
                                                <FormLabel className={"text-sm"}>Provincia</FormLabel>
                                                <Skeleton isLoaded={!!research.region?.provinces.length}>
                                                    <Select
                                                        defaultValue={research.province?.id}
                                                        onChange={e => {
                                                            setResearch({
                                                                ...research,
                                                                countries: undefined,
                                                                province: research.region?.provinces.find(c => c.id === e.target.value)
                                                            })
                                                        }}
                                                    >
                                                        {
                                                            research.region?.provinces?.map((province: Province) => {
                                                                return (
                                                                    <option value={province.id} key={province.id}>
                                                                        {province.name}
                                                                    </option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                </Skeleton>
                                            </div>
                                        </div>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </div>
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