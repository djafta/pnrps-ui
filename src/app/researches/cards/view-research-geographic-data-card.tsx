import {
    Card,
    CardBody,
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
    Tabs,
} from "@chakra-ui/react";
import {Country, Region, Province, Research} from "@/models";
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import {useQuery} from "@apollo/client";
import {
    LIST_COUNTRIES_QUERY,
} from "@/apollo";

export interface EditGeographicDataProps {
    readonly research: Research
    readonly setResearch: Dispatch<SetStateAction<Research>>
}

export function ViewResearchGeographicDataCard({research, setResearch}: EditGeographicDataProps) {
    const listResearchCountriesQuery = useQuery(LIST_COUNTRIES_QUERY, {
        pollInterval: 1000 * 10 // 10 seconds
    });

    const countries = useMemo(() => {
        return (listResearchCountriesQuery.data?.listCountries || []) as Country[]
    }, [listResearchCountriesQuery])

    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (countries) {
            if (research.countries) {
                setIndex(0)
            } else if (research.province) {
                setIndex(2)
            } else {
                setIndex(1)
            }
            setResearch((research) => {

                let country: Country | undefined = undefined
                let region: Region | undefined = undefined

                for (let c of countries) {
                    for (let r of c.regions) {
                        if (r.provinces.find(p => p.id === research.province?.id)) {
                            region = r;
                            break
                        }
                    }
                }

                for (let c of countries) {
                    if (c.regions.find(r => r.id === region?.id)) {
                        country = c;
                        break
                    }
                }

                return {
                    ...research,
                    country,
                    region: region ? region : country?.regions[0]
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
                                                    isReadOnly={true}
                                                    defaultValue={research.countries}
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
                                                        isReadOnly={true}
                                                        name={"country"}
                                                        value={research.country?.id}
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
                                                        isReadOnly={true}
                                                        value={research.region?.id}
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
                                                        isReadOnly={true}
                                                        name={"country"}
                                                        value={research.country?.id}
                                                    >
                                                        {
                                                            countries?.map((country: Country) => {
                                                                return (
                                                                    <option
                                                                        value={country.id} key={country.id}>
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
                                                        isReadOnly={true}
                                                        value={research.region?.id}
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
                                                <Skeleton
                                                    isLoaded={!!research.region?.provinces?.length || !!research.province}>
                                                    <Select
                                                        isReadOnly={true}
                                                        value={research.province?.id}
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
        </Card>
    )
}