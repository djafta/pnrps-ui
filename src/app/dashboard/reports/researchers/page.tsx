"use client"
import React, {FormEvent, useCallback, useEffect, useMemo, useState} from "react";
import {
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormLabel,
    Heading,
    Select,
    Skeleton,
    SkeletonCircle,
    SkeletonText,
} from "@chakra-ui/react";
import {useLazyQuery} from "@apollo/client";
import {GET_RESEARCHERS_BY_YEAR} from "@/apollo";
import ChartModuleMore from 'highcharts/highcharts-more.js';
import HCSoldGauge from 'highcharts/modules/solid-gauge';
import * as Highcharts from 'highcharts'

import {User} from "@/models";

ChartModuleMore(Highcharts);
HCSoldGauge(Highcharts);

export default function Page() {
    const [getResearchersByYearMutation, getResearchersByYearMutationResult] = useLazyQuery(GET_RESEARCHERS_BY_YEAR, {
        pollInterval: 1000 * 10 // 10 seconds
    })
    const researchers = useMemo(() => {
        return (getResearchersByYearMutationResult.data?.getResearchersByYear || []) as User[]
    }, [getResearchersByYearMutationResult])

    const [filter, setFilter] = useState({
        year: new Date().getFullYear(),
        sex: 'M'
    })

    const updateFilter = useCallback((event: FormEvent<any>) => {
        const target = event.target as HTMLInputElement;

        setFilter(prevState => {
            return {
                ...prevState,
                [target.name]: target.value
            }
        })
    }, [])

    useEffect(() => {
        getResearchersByYearMutation({
            variables: {
                year: Number(filter.year)
            }
        })
    }, [getResearchersByYearMutation, filter.year])

    useEffect(() => {
        if (window.document.getElementById("filtered_researchers")) {
            // @ts-ignore
            Highcharts.chart('filtered_researchers', {
                chart: {
                    type: 'solidgauge',
                    height: '100%',
                },

                title: {
                    text: 'Pesquisadores',
                    style: {
                        fontSize: '24px'
                    }
                },

                tooltip: {
                    borderWidth: 0,
                    backgroundColor: 'none',
                    shadow: false,
                    style: {
                        fontSize: '16px'
                    },
                    valueSuffix: '%',
                    pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}</span>',
                    positioner: function (labelWidth) {
                        return {
                            x: (this.chart.chartWidth - labelWidth) / 2,
                            y: (this.chart.plotHeight / 2) + 15
                        };
                    }
                },

                pane: {
                    startAngle: 0,
                    endAngle: 360,
                    background: [{ // Track for Move
                        outerRadius: '112%',
                        innerRadius: '88%',
                        //@ts-ignore
                        backgroundColor: Highcharts.color(Highcharts.getOptions().colors[0])
                            .setOpacity(0.3)
                            .get(),
                        borderWidth: 0
                    }, { // Track for Exercise
                        outerRadius: '87%',
                        innerRadius: '63%',
                        //@ts-ignore
                        backgroundColor: Highcharts.color(Highcharts.getOptions().colors[1])
                            .setOpacity(0.3)
                            .get(),
                        borderWidth: 0
                    }, { // Track for Stand
                        outerRadius: '62%',
                        innerRadius: '38%',
                        //@ts-ignore
                        backgroundColor: Highcharts.color(Highcharts.getOptions().colors[2])
                            .setOpacity(0.3)
                            .get(),
                        borderWidth: 0
                    }]
                },

                yAxis: {
                    min: 0,
                    max: 100,
                    lineWidth: 0,
                    tickPositions: []
                },

                plotOptions: {
                    solidgauge: {
                        dataLabels: {
                            enabled: false
                        },
                        linecap: 'round',
                        stickyTracking: false,
                        rounded: true
                    }
                },

                series: [{
                    name: {M: "Sexo Masculino", F: "Sexo Feminino"}[filter.sex],
                    data: [{
                        //@ts-ignore
                        color: Highcharts.getOptions().colors[0],
                        radius: '112%',
                        innerRadius: '88%',
                        y: Number((researchers.filter((r => r.sex === filter.sex)).length / researchers.length * 100).toPrecision(2))
                    }]
                }, {
                    name: '20-25 Anos',
                    data: [{
                        //@ts-ignore
                        color: Highcharts.getOptions().colors[1],
                        radius: '87%',
                        innerRadius: '63%',
                        y: 65
                    }]
                }, {
                    name: 'Licenciados',
                    data: [{
                        //@ts-ignore
                        color: Highcharts.getOptions().colors[2],
                        radius: '62%',
                        innerRadius: '38%',
                        y: 50
                    }]
                }]
            });
        }

        if (window.document.getElementById("all_researchers")) {
            // Data retrieved from https://gs.statcounter.com/browser-market-share#monthly-202201-202201-bar

// Create the chart
            //@ts-ignore
            Highcharts.chart('all_researchers', {
                chart: {
                    type: 'column'
                },
                title: {
                    align: '',
                    text: ''
                },
                accessibility: {
                    announceNewData: {
                        enabled: true
                    }
                },
                xAxis: {
                    type: 'category',
                },
                yAxis: {
                    visible: false,
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.1f}%'
                        }
                    }
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> de total<br/>'
                },

                series: [
                    {
                        name: 'Browsers',
                        colorByPoint: true,
                        data: [
                            {
                                name: 'Sexo Masculino',
                                y: Number((researchers.filter((r => r.sex === 'M')).length / researchers.length * 100).toPrecision(2)),
                                drilldown: 'Chrome'
                            },
                            {
                                name: 'Sexo Feminino',
                                y: Number((researchers.filter((r => r.sex === 'F')).length / researchers.length * 100).toPrecision(2)),
                                drilldown: 'Safari'
                            },
                            {
                                name: 'Licenciados',
                                y: 4.18,
                                drilldown: 'Firefox'
                            },
                            {
                                name: 'Mestrados',
                                y: 4.12,
                                drilldown: 'Edge'
                            },
                            {
                                name: 'Doutorados',
                                y: 2.33,
                                drilldown: 'Opera'
                            },
                            {
                                name: '20-25 Anos',
                                y: 0.45,
                                drilldown: 'Internet Explorer'
                            },
                            {
                                name: '25-20 Anos',
                                y: 1.582,
                                drilldown: null
                            }
                        ]
                    }
                ],
                drilldown: {
                    breadcrumbs: {
                        position: {
                            align: 'right'
                        }
                    },
                    series: [
                        {
                            name: 'Chrome',
                            id: 'Chrome',
                            data: [
                                [
                                    'v65.0',
                                    0.1
                                ],
                                [
                                    'v64.0',
                                    1.3
                                ],
                                [
                                    'v63.0',
                                    53.02
                                ],
                                [
                                    'v62.0',
                                    1.4
                                ],
                                [
                                    'v61.0',
                                    0.88
                                ],
                                [
                                    'v60.0',
                                    0.56
                                ],
                                [
                                    'v59.0',
                                    0.45
                                ],
                                [
                                    'v58.0',
                                    0.49
                                ],
                                [
                                    'v57.0',
                                    0.32
                                ],
                                [
                                    'v56.0',
                                    0.29
                                ],
                                [
                                    'v55.0',
                                    0.79
                                ],
                                [
                                    'v54.0',
                                    0.18
                                ],
                                [
                                    'v51.0',
                                    0.13
                                ],
                                [
                                    'v49.0',
                                    2.16
                                ],
                                [
                                    'v48.0',
                                    0.13
                                ],
                                [
                                    'v47.0',
                                    0.11
                                ],
                                [
                                    'v43.0',
                                    0.17
                                ],
                                [
                                    'v29.0',
                                    0.26
                                ]
                            ]
                        },
                        {
                            name: 'Firefox',
                            id: 'Firefox',
                            data: [
                                [
                                    'v58.0',
                                    1.02
                                ],
                                [
                                    'v57.0',
                                    7.36
                                ],
                                [
                                    'v56.0',
                                    0.35
                                ],
                                [
                                    'v55.0',
                                    0.11
                                ],
                                [
                                    'v54.0',
                                    0.1
                                ],
                                [
                                    'v52.0',
                                    0.95
                                ],
                                [
                                    'v51.0',
                                    0.15
                                ],
                                [
                                    'v50.0',
                                    0.1
                                ],
                                [
                                    'v48.0',
                                    0.31
                                ],
                                [
                                    'v47.0',
                                    0.12
                                ]
                            ]
                        },
                        {
                            name: 'Internet Explorer',
                            id: 'Internet Explorer',
                            data: [
                                [
                                    'v11.0',
                                    6.2
                                ],
                                [
                                    'v10.0',
                                    0.29
                                ],
                                [
                                    'v9.0',
                                    0.27
                                ],
                                [
                                    'v8.0',
                                    0.47
                                ]
                            ]
                        },
                        {
                            name: 'Safari',
                            id: 'Safari',
                            data: [
                                [
                                    'v11.0',
                                    3.39
                                ],
                                [
                                    'v10.1',
                                    0.96
                                ],
                                [
                                    'v10.0',
                                    0.36
                                ],
                                [
                                    'v9.1',
                                    0.54
                                ],
                                [
                                    'v9.0',
                                    0.13
                                ],
                                [
                                    'v5.1',
                                    0.2
                                ]
                            ]
                        },
                        {
                            name: 'Edge',
                            id: 'Edge',
                            data: [
                                [
                                    'v16',
                                    2.6
                                ],
                                [
                                    'v15',
                                    0.92
                                ],
                                [
                                    'v14',
                                    0.4
                                ],
                                [
                                    'v13',
                                    0.1
                                ]
                            ]
                        },
                        {
                            name: 'Opera',
                            id: 'Opera',
                            data: [
                                [
                                    'v50.0',
                                    0.96
                                ],
                                [
                                    'v49.0',
                                    0.82
                                ],
                                [
                                    'v12.1',
                                    0.14
                                ]
                            ]
                        }
                    ]
                }
            });

        }
    }, [researchers, filter])

    return (
        <>
            <main className={"relative pt-14 flex flex-col gap-10 bg-white lg:ps-16"}>
                <div className={"flex flex-col w-full gap-10"}>
                    <div className={"p-2 gap-4 grid"}>
                        <Card className={"w-full gap-4 p-2"}>
                            <CardHeader className={"flex justify-between"}>
                                <Heading size={"md"}>Filtrar pesquisadores</Heading>
                                <Skeleton isLoaded={true} className={"w-fit"}>
                                    <Select name={"year"} onChange={updateFilter} value={filter.year}>
                                        <option value={2023}>2023</option>
                                        <option value={2024}>2024</option>
                                    </Select>
                                </Skeleton>
                            </CardHeader>
                            <CardBody>
                                <div className={"flex flex-col gap-4 h-full lg:flex-row"}>
                                    <div className={"flex flex-col gap-2 md:flex-row w-full"}>
                                        <FormControl>
                                            <FormLabel>Sexo</FormLabel>
                                            <Select onChange={updateFilter} value={filter.sex} name={"sex"}>
                                                <option value={"M"}>Masculino</option>
                                                <option value={"F"}>Feminino</option>
                                            </Select>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Faixa etária</FormLabel>
                                            <Select name={""}>

                                            </Select>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel>Nível académico</FormLabel>
                                            <Select>

                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div
                                        className={"h-full flex flex-col gap-4 lg:flex-row justify-center items-center w-full overflow-hidden"}>
                                        <SkeletonCircle
                                            isLoaded={!!researchers.length}
                                            className={"w-[300px] h-[300px] md:w-[500px] md:h-[500px]"}>
                                            <div className={"w-[300px] h-[300px] md:w-[500px] md:h-[500px]"}
                                                 id={"filtered_researchers"}/>
                                        </SkeletonCircle>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div className={"flex w-full p-2"}>
                        <Card className={"w-full gap-4 p-2"}>
                            <CardHeader className={"flex w-full justify-between"}>
                                <Heading size={"md"}>Pesquisadores cadastrados</Heading>
                                <Skeleton isLoaded={true} className={"w-fit"}>
                                    <Select name={"year"} onChange={updateFilter} value={filter.year}>
                                        <option value={2023}>2023</option>
                                        <option value={2024}>2024</option>
                                    </Select>
                                </Skeleton>
                            </CardHeader>
                            <CardBody>
                                <div className={"flex flex-col gap-4"}>
                                    <div className={"flex flex-col gap-4 lg:flex-row"}>
                                        <Skeleton isLoaded={!!researchers.length} className={"w-full h-[400px]"}>
                                            <div id={"all_researchers"}/>
                                        </Skeleton>
                                        <div className={"flex flex-col gap-10"}>
                                            <SkeletonText className={"lg:w-80"} noOfLines={6} spacing={10}
                                                          skeletonHeight={3}></SkeletonText>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>

            </main>
        </>
    )
}
