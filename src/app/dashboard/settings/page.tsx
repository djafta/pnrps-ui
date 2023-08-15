"use client"


import {Card, Skeleton, SkeletonCircle, SkeletonText} from "@chakra-ui/react";
import {MdCallMade} from "react-icons/md";

import {useQuery} from "@apollo/client";
import {
    GET_FINANCIER_STATISTIC,
    GET_ORGANIZATION_STATISTIC,
    GET_RESEARCH_STATISTIC,
    LIST_COUNTRIES_QUERY
} from "@/apollo";
import {useEffect, useState} from "react";
import Highcharts from "highcharts"

export default function Settings() {
    const {data: countriesResult, loading: isCountriesLoading} = useQuery(LIST_COUNTRIES_QUERY, {
        pollInterval: 1000 * 10
    });
    const getResearchStatisticQuery = useQuery(GET_RESEARCH_STATISTIC, {
        pollInterval: 1000 * 10
    })
    const getFinancierStatisticQuery = useQuery(GET_FINANCIER_STATISTIC, {
        pollInterval: 1000 * 10
    })
    const getOrganizationStatisticQuery = useQuery(GET_ORGANIZATION_STATISTIC, {
        pollInterval: 1000 * 10
    })
    const [researchStatistic, setResearchStatistic] = useState(null)
    const [financierStatistic, setFinancierStatistic] = useState(null)
    const [organizationStatistic, setOrganizationStatistic] = useState(null)

    useEffect(() => {
        if (getResearchStatisticQuery.data?.getResearchStatistics) {
            setResearchStatistic(getResearchStatisticQuery.data.getResearchStatistics)
        }

        if (getFinancierStatisticQuery.data?.getFinancierStatistics) {
            setFinancierStatistic(getFinancierStatisticQuery.data.getFinancierStatistics)
        }

        if (getOrganizationStatisticQuery.data?.getOrganizationStatistics) {
            setOrganizationStatistic(getOrganizationStatisticQuery.data.getOrganizationStatistics)
        }
    }, [getFinancierStatisticQuery, getResearchStatisticQuery, getOrganizationStatisticQuery])

    useEffect(() => {
        // Data retrieved from https://fas.org/issues/nuclear-weapons/status-world-nuclear-forces/
        // @ts-ignore-all
        Highcharts.chart("financiers", {
            chart: {
                type: 'area'
            },
            accessibility: {
                description: ''
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            yAxis: {
                visible: false,
            },

            xAxis: {
                visible: false,
                type: 'datetime'
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            series: [{
                name: 'Financiadores',
                data: financierStatistic?.monthly
            }]
        });

        Highcharts.chart('countries', {
            title: {
                text: '',
            },
            subtitle: {},
            xAxis: {
                visible: false,
                categories: ['Moçambique', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            },
            yAxis: {
                visible: false,
            },
            plotOptions: {
                column: {
                    pointPadding: 0, // Adjust the point padding value as needed
                    groupPadding: 0, // Adjust the group padding value as needed
                    pointWidth: 15 // Adjust the point width value as needed
                }
            },
            series: [{
                type: 'column',
                name: 'Pesquisas',
                borderRadius: 4,
                data: [5412, 4977, 4730, 4437, 3947, 3707, 4143, 3609],
                showInLegend: false
            }]
        });

        // @ts-ignore
        Highcharts.chart('organizations', {
            chart: {
                type: 'spline',
                inverted: true
            },
            title: {
                text: '',
                align: 'left'
            },
            subtitle: {
                text: '',
                align: 'left'
            },
            xAxis: {
                reversed: true,
                maxPadding: 0.05,
                showLastLabel: true,
                visible: false,
                type: 'datetime'
            },
            yAxis: {
                lineWidth: 2,
                visible: false
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                spline: {
                    marker: {
                        enable: false
                    }
                }
            },
            series: [{
                name: 'Organizações',
                data: organizationStatistic?.monthly
            }]
        });

    }, [financierStatistic, isCountriesLoading, researchStatistic, organizationStatistic])

    return (
        <main className={"pt-24 flex flex-col gap-10"}>
            <div className={"p-2 grid grid-rows-3 gap-6 lg:grid-rows-none lg:grid-cols-3"}>
                <Card className={"p-4 flex flex-col gap-2"}>
                    <Skeleton isLoaded={!isCountriesLoading}>
                        <h2 className={"text-gray-500 text-lg"}>Paises</h2>
                    </Skeleton>
                    <div className={"flex h-full justify-between gap-5"}>
                        <div className={"flex flex-col gap-2 justify-between"}>
                            <div className={"flex gap-1 items-center text-teal-500 h-full"}>
                                <SkeletonText isLoaded={!isCountriesLoading} noOfLines={1} skeletonHeight={"1.5rem"}>
                                    <p className={"flex gap-2 items-center"}><MdCallMade/> +2.3%</p>
                                </SkeletonText>
                            </div>
                            <SkeletonText isLoaded={!isCountriesLoading} noOfLines={1} skeletonHeight={"1.5rem"}>
                                <p className={"font-bold text-4xl"}>{countriesResult?.listCountries?.length}</p>
                            </SkeletonText>
                        </div>
                        <Skeleton isLoaded={!isCountriesLoading} width={"100%"} height={"10rem"}>
                            <div className={"flex justify-end w-full h-full"}>
                                <div className={"flex-1 max-w-full min-h-[10rem]"} id={"countries"}>

                                </div>
                            </div>
                        </Skeleton>
                    </div>
                </Card>
                <Card className={"p-4 flex flex-col gap-2"}>
                    <Skeleton isLoaded={!!financierStatistic}>
                        <h2 className={"text-gray-500 text-lg"}>Financiadores</h2>
                    </Skeleton>
                    <div className={"flex h-full justify-between gap-5"}>
                        <div className={"flex flex-col gap-2 justify-between"}>
                            <div className={"flex gap-1 items-center text-teal-500 h-full"}>
                                <SkeletonText isLoaded={!!financierStatistic} noOfLines={1} skeletonHeight={"1.5rem"}>
                                    <p className={"flex gap-2 items-center"}><MdCallMade/> +2.3%</p>
                                </SkeletonText>
                            </div>
                            <SkeletonText isLoaded={!!financierStatistic} noOfLines={1} skeletonHeight={"1.5rem"}>
                                <p className={"font-bold text-4xl"}>{financierStatistic?.total}</p>
                            </SkeletonText>
                        </div>
                        <Skeleton isLoaded={!!financierStatistic} width={"100%"} height={"10rem"}>
                            <div className={"flex justify-end w-full h-full"}>
                                <div className={"flex-1 max-w-full min-h-[10rem]"} id={"financiers"}>

                                </div>
                            </div>
                        </Skeleton>
                    </div>
                </Card>
                <Card className={"p-4 flex flex-col gap-2"}>
                    <Skeleton isLoaded={!isCountriesLoading}>
                        <h2 className={"text-gray-500 text-lg"}>Organizações</h2>
                    </Skeleton>
                    <div className={"flex h-full justify-between gap-5"}>
                        <div className={"flex flex-col gap-2 justify-between"}>
                            <div className={"flex gap-1 items-center text-teal-500 h-full"}>
                                <SkeletonText isLoaded={!!organizationStatistic} noOfLines={1}
                                              skeletonHeight={"1.5rem"}>
                                    <p className={"flex gap-2 items-center"}><MdCallMade/> +2.3%</p>
                                </SkeletonText>
                            </div>
                            <SkeletonText isLoaded={!!organizationStatistic} noOfLines={1} skeletonHeight={"1.5rem"}>
                                <p className={"font-bold text-4xl"}>{organizationStatistic?.total}</p>
                            </SkeletonText>
                        </div>
                        <Skeleton isLoaded={!!organizationStatistic} width={"100%"} height={"10rem"}>
                            <div className={"flex justify-end w-full h-full"}>
                                <div className={"flex-1 max-w-full min-h-[10rem]"} id={"organizations"}>

                                </div>
                            </div>
                        </Skeleton>
                    </div>
                </Card>
            </div>
            <div className={"p-2"}>
                <Card className={"p-2"}>
                    <div className={"flex flex-col gap-6 lg:flex-row"}>
                        <Skeleton className={"w-full lg:h-[400px]"} width={"100%"} height={"300px"}>

                        </Skeleton>
                        <Skeleton className={"w-full lg:w-[48.5%] lg:h-[400px]"} height={"300px"}>

                        </Skeleton>
                    </div>
                </Card>
            </div>
            <div className={"p-2 grid grid-rows-3 gap-6 lg:grid-rows-none lg:grid-cols-3"}>
                <Card className={"p-4 flex gap-4"}>
                    <SkeletonCircle width={"100px"} height={"100px"}></SkeletonCircle>
                    <SkeletonText noOfLines={3} skeletonHeight={4}></SkeletonText>
                </Card>
                <Card className={"p-4 flex gap-4"}>
                    <SkeletonCircle width={"100px"} height={"100px"}></SkeletonCircle>
                    <SkeletonText noOfLines={3} skeletonHeight={4}></SkeletonText>
                </Card>
                <Card className={"p-4 flex gap-4"}>
                    <SkeletonCircle width={"100px"} height={"100px"}></SkeletonCircle>
                    <SkeletonText noOfLines={3} skeletonHeight={4}></SkeletonText>
                </Card>
                <Card className={"p-4 flex gap-4"}>
                    <SkeletonCircle width={"100px"} height={"100px"}></SkeletonCircle>
                    <SkeletonText noOfLines={3} skeletonHeight={4}></SkeletonText>
                </Card>
                <Card className={"p-4 flex gap-4"}>
                    <SkeletonCircle width={"100px"} height={"100px"}></SkeletonCircle>
                    <SkeletonText noOfLines={3} skeletonHeight={4}></SkeletonText>
                </Card>
            </div>
        </main>
    )
}
