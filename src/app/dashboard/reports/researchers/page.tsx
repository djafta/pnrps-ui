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
//@ts-ignore
import ChartModuleMore from 'highcharts/highcharts-more.js';
//@ts-ignore
import HCSoldGauge from 'highcharts/modules/solid-gauge';
import Highcharts from 'highcharts'

import {User} from "@/models";

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

    ChartModuleMore(Highcharts);
    HCSoldGauge(Highcharts);

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
            const series: any = [
                {
                    data: [
                        {
                            name: "Masculino",
                            y: researchers.filter(r => r.sex === 'M').length
                        }
                    ]
                },
                {
                    data: [
                        {
                            name: "Feminino",
                            y: researchers.filter(r => r.sex === 'F').length
                        }
                    ]
                }
            ]

            // @ts-ignore
            Highcharts.chart('filtered_researchers', {
                chart: {
                    type: 'column',
                    inverted: true,
                    polar: true
                },
                title: {
                    text: '',
                    align: 'left'
                },
                pane: {
                    size: '85%',
                    innerSize: '20%',
                    endAngle: 270
                },
                xAxis: {
                    tickInterval: 1,
                    labels: {
                        align: 'right',
                        useHTML: true,
                        allowOverlap: true,
                        step: 1,
                        y: 3,
                        style: {
                            fontSize: '13px'
                        }
                    },
                    lineWidth: 0,
                    categories: [
                        'Sexo <span class="f16"><span id="flag" class="flag no">' +
                        '</span></span>',
                        'Faixa etária <span class="f16"><span id="flag" class="flag us">' +
                        '</span></span>',
                        'Nível acdémico <span class="f16"><span id="flag" class="flag de">' +
                        '</span></span>',
                    ]
                },
                yAxis: {
                    crosshair: {
                        enabled: true,
                        color: '#333'
                    },
                    lineWidth: 0,
                    tickInterval: researchers.length,
                    reversedStacks: false,
                    endOnTick: true,
                    showLastLabel: true
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        borderWidth: 0,
                        pointPadding: 0,
                        groupPadding: 0.15
                    },
                },
                tooltip: {
                    pointFormat: '<p>Cerca de: <b>{point.percentage:.1f}%</b></p>'
                },
                legend: {
                    enabled: false
                },
                series,
            });
        }

        if (window.document.getElementById("all_researchers")) {
            // Data retrieved from https://gs.statcounter.com/browser-market-share#monthly-202201-202201-bar

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
                            format: '{point.y}'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> de total<br/>'
                },
                series: [
                    {
                        name: 'Pesquisadores',
                        colorByPoint: true,
                        data: [
                            {
                                name: 'Sexo Masculino',
                                y: Number(researchers.filter((r => r.sex === 'M')).length),
                                drilldown: 'Chrome'
                            },
                            {
                                name: 'Sexo Feminino',
                                y: Number(researchers.filter((r => r.sex === 'F')).length),
                                drilldown: 'Safari'
                            }
                        ]
                    }
                ],
            });

        }
    }, [researchers])

    return (
        <>
            <main className={"relative pt-14 flex flex-col gap-10 bg-white lg:ps-16"}>
                <div className={"flex flex-col w-full gap-10"}>
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
                                    <div className={"flex flex-col gap-4 justify-center items-center lg:flex-row"}>
                                        <Skeleton isLoaded={!!researchers.length} className={"w-full h-[500px]"}>
                                            <div id={"all_researchers"}/>
                                        </Skeleton>
                                        <SkeletonCircle
                                            isLoaded={!!researchers.length}
                                            className={"w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]"}>
                                            <div className={"w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]"}
                                                 id={"filtered_researchers"}/>
                                        </SkeletonCircle>
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
