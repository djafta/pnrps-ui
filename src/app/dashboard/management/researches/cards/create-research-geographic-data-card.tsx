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
    Tabs
} from "@chakra-ui/react";
import {Country, Region, Province, Research} from "@/models";
import React, {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import {useQuery} from "@apollo/client";
import {LIST_COUNTRIES_QUERY} from "@/apollo";

export interface GeographicDataProps {
    readonly research: Research
    readonly setResearch: Dispatch<SetStateAction<Research>>
}

export function CreateResearchGeographicDataCard({research, setResearch}: GeographicDataProps) {
    const listResearchCountriesQuery = useQuery(LIST_COUNTRIES_QUERY, {
        pollInterval: 1000 * 10 // 10 seconds
    });

    const countries = useMemo(() => {
        return (listResearchCountriesQuery.data?.listCountries || []) as Country[]
    }, [listResearchCountriesQuery])

    useEffect(() => {
        if (countries) {
            const country = countries[0]
            const region = country?.regions && country.regions[0]
            const province = region?.provinces && region.provinces[0]

            setResearch((research) => {
                return {
                    ...research,
                    country,
                    region,
                    province
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
                            <Tabs variant='enclosed'>
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
                                                <Input onChange={(e) => setResearch({
                                                    ...research,
                                                    countries: e.target.value
                                                })} type={"text"}/>
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
                                                                country,
                                                                region,
                                                                province
                                                            })
                                                        }}
                                                    >
                                                        {
                                                            countries?.map((country: Country) => {
                                                                return (
                                                                    <option
                                                                        value={country.id}
                                                                        key={country.id}
                                                                    >
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
                                                            research.country?.regions?.map((region: Region) => {
                                                                return (
                                                                    <option
                                                                        value={region.id}
                                                                        key={region.id}
                                                                    >
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
                                                                country,
                                                                region,
                                                                province
                                                            })
                                                        }}
                                                    >
                                                        {
                                                            countries?.map((country: Country) => {
                                                                return (
                                                                    <option
                                                                        value={country.id}
                                                                        key={country.id}
                                                                    >
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

                                                            console.log(region)

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
                                                                    <option
                                                                        value={region.id}
                                                                        key={region.id}
                                                                    >
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
                                                        onChange={e => {
                                                            setResearch({
                                                                ...research,
                                                                province: research.region?.provinces.find(c => c.id === e.target.value)
                                                            })
                                                        }}
                                                    >
                                                        {
                                                            research.region?.provinces?.map((province: Province) => {
                                                                return (
                                                                    <option
                                                                        value={province.id}
                                                                        key={province.id}
                                                                    >
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