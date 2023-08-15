"use client"
import {useQuery} from "@apollo/client";
import Highcharts from "highcharts"
import React, {useEffect, useState} from "react";
import {Box, Card, Skeleton, SkeletonCircle, SkeletonText, Text, useDisclosure} from "@chakra-ui/react";
import {GET_RESEARCH_STATISTIC, GET_USER_STATISTIC} from "@/apollo";
import {useAuth} from "@/hooks/auth";
import Image from "next/image";

interface Research {

}

interface ResearchStatistic {
    total: number
    monthly: number[]
    approved: boolean
    nonApproved: boolean
}

export default function Dashboard() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const getResearchStatisticQuery = useQuery(GET_RESEARCH_STATISTIC, {
        pollInterval: 1000 * 10
    })
    const getUserStatisticQuery = useQuery(GET_USER_STATISTIC, {
        pollInterval: 1000 * 10
    })
    const [researchStatistic, setResearchStatistic] = useState<ResearchStatistic | null>(null)
    const [userStatistic, setUserStatistic] = useState<any>(null)
    const {isAuthorized} = useAuth();

    useEffect(() => {
        if (getResearchStatisticQuery.data?.getResearchStatistics) {
            setResearchStatistic(getResearchStatisticQuery.data.getResearchStatistics)
        }

        if (getUserStatisticQuery.data?.getUserStatistics) {
            setUserStatistic(getUserStatisticQuery.data.getUserStatistics)
        }
    }, [getResearchStatisticQuery, getUserStatisticQuery])

    useEffect(() => {
        try {
            (async () => {
                if (window.document.getElementById("monthly")) {
                    // @ts-ignore
                    Highcharts.chart('monthly', {
                        chart: {
                            zoomType: 'x'
                        },
                        title: {
                            text: 'Pesquisas mensais',
                            align: 'left'
                        },
                        subtitle: {
                            text: document.ontouchstart === undefined ?
                                'Click e araste na area do gráfico para zoom' : 'Pinch the chart to zoom in',
                            align: 'left'
                        },
                        xAxis: {
                            type: 'datetime'
                        },
                        yAxis: {
                            title: {
                                text: 'Pesquisas'
                            }
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
                                        //@ts-ignore
                                        [0, Highcharts.getOptions().colors[0]],
                                        //@ts-ignore
                                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                    ]
                                },
                                marker: {
                                    radius: 2
                                },
                                lineWidth: 1,
                                states: {
                                    hover: {
                                        lineWidth: 1
                                    }
                                },
                                threshold: null
                            }
                        },

                        series: [{
                            type: 'area',
                            name: 'Pesquisas',
                            data: researchStatistic?.monthly
                        }]
                    });
                }

                if (window.document.getElementById("statuses")) {
                    // @ts-ignore
                    Highcharts.chart('statuses', {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: '',
                            align: 'center'
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        accessibility: {
                            point: {
                                valueSuffix: '%'
                            }
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                borderRadius: 5,
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
                                    distance: -50,
                                    filter: {
                                        property: 'percentage',
                                        operator: '>',
                                        value: 4
                                    }
                                }
                            }
                        },
                        series: [{
                            name: 'Cerca de',
                            data: [
                                {
                                    name: "Aprovadas",
                                    y: researchStatistic?.approved,
                                    // @ts-ignore
                                    color: Highcharts.getOptions().colors[0]
                                },
                                {
                                    name: "Não Aprovadas",
                                    y: researchStatistic?.nonApproved,
                                    // @ts-ignore
                                    color: Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba').toString()
                                }
                            ]
                        }]
                    });
                }

            })();
        } catch (e) {
        }
    }, [researchStatistic])

    function handleResearchRowClick(research: Research | undefined) {
        onOpen()
    }

    function ResearchStatusesCards() {
        return (
            <>
                <Card className={"p-4 flex gap-4"}>
                    <div className={"flex gap-2 items-center"}>
                        <SkeletonCircle isLoaded={!!researchStatistic} width={"100px"} height={"100px"}>
                            <Box className={"bg-blue-400 flex items-center justify-center"} rounded={"full"}
                                 width={"100px"}
                                 height={"100px"}>
                                <Text className={"text-white text-xl"}>
                                    {researchStatistic?.approved}
                                </Text>
                            </Box>
                        </SkeletonCircle>
                        <Text className={"text-gray-700 font-bold text-2xl"}>
                            Pesquisas Aprovadas
                        </Text>
                    </div>
                    <SkeletonText isLoaded={!!researchStatistic} noOfLines={3} skeletonHeight={4}>
                        <Box className={"flex items-center"}>
                            <Text className={"text-gray-500 text-md"}>Total de pesquisas aprovadas</Text>
                        </Box>
                    </SkeletonText>
                </Card>
                <Card className={"p-4 flex gap-4"}>
                    <div className={"flex gap-2 items-center"}>
                        <SkeletonCircle isLoaded={!!researchStatistic} width={"100px"} height={"100px"}>
                            <Box className={"bg-blue-400 flex items-center justify-center"} rounded={"full"}
                                 width={"100px"}
                                 height={"100px"}>
                                <Text className={"text-white text-xl"}>
                                    {researchStatistic?.nonApproved}
                                </Text>
                            </Box>
                        </SkeletonCircle>
                        <Text className={"text-gray-700 font-bold text-2xl"}>
                            Pesquisas por Aprovar
                        </Text>
                    </div>
                    <SkeletonText isLoaded={!!researchStatistic} noOfLines={3} skeletonHeight={4}>
                        <Box className={"flex items-center"}>
                            <Text className={"text-gray-500 text-md"}>Total de pesquisas em processo de aprovação</Text>
                        </Box>
                    </SkeletonText>
                </Card>
            </>
        )
    }

    return (
        isAuthorized("create:research:self", "read:research:list") ?
            <main className={"pt-24 flex flex-col gap-10 lg:ps-16 bg-slate-200"}>
                <div className={"p-2 grid grid-rows-3 gap-6 lg:grid-rows-none lg:grid-cols-3"}>
                    <Card className={"p-4 flex gap-4"}>
                        <div className={"flex gap-2 items-center"}>
                            <SkeletonCircle isLoaded={!!researchStatistic} width={"100px"} height={"100px"}>
                                <Box className={"bg-blue-400 flex items-center justify-center"} rounded={"full"}
                                     width={"100px"}
                                     height={"100px"}>
                                    <Text className={"text-white text-xl"}>
                                        {researchStatistic?.total}
                                    </Text>
                                </Box>
                            </SkeletonCircle>
                            <Text className={"text-gray-700 font-bold text-2xl"}>
                                Pesquisas
                            </Text>
                        </div>
                        <SkeletonText isLoaded={!!researchStatistic} noOfLines={3} skeletonHeight={4}>
                            <Box className={"flex items-center"}>
                                <Text className={"text-gray-500 text-md"}>Total de pesquisas existentes</Text>
                            </Box>
                        </SkeletonText>
                    </Card>
                    {
                        isAuthorized("read:user:list") ?
                            <>
                                <Card className={"p-4 flex gap-4"}>
                                    <div className={"flex gap-2 items-center"}>
                                        <SkeletonCircle isLoaded={!!userStatistic} width={"100px"} height={"100px"}>
                                            <Box className={"bg-blue-400 flex items-center justify-center"}
                                                 rounded={"full"}
                                                 width={"100px"}
                                                 height={"100px"}>
                                                <Text className={"text-white text-xl"}>
                                                    {userStatistic?.total}
                                                </Text>
                                            </Box>
                                        </SkeletonCircle>
                                        <Text className={"text-gray-700 font-bold text-2xl"}>
                                            Utilizadores
                                        </Text>
                                    </div>
                                    <SkeletonText isLoaded={!!researchStatistic} noOfLines={3} skeletonHeight={4}>
                                        <Box className={"flex items-center"}>
                                            <Text className={"text-gray-500 text-md"}>Total de Utilizadores
                                                existentes</Text>
                                        </Box>
                                    </SkeletonText>
                                </Card>
                                <Card className={"p-4 flex gap-4"}>
                                    <div className={"flex gap-2 items-center"}>
                                        <SkeletonCircle isLoaded={!!userStatistic} width={"100px"} height={"100px"}>
                                            <Box className={"bg-blue-400 flex items-center justify-center"}
                                                 rounded={"full"}
                                                 width={"100px"}
                                                 height={"100px"}>
                                                <Text className={"text-white text-xl"}>
                                                    {userStatistic?.researchers}
                                                </Text>
                                            </Box>
                                        </SkeletonCircle>
                                        <Text className={"text-gray-700 font-bold text-2xl"}>
                                            Investigadores
                                        </Text>
                                    </div>
                                    <SkeletonText isLoaded={!!userStatistic} noOfLines={3} skeletonHeight={4}>
                                        <Box className={"flex items-center"}>
                                            <Text className={"text-gray-500 text-md"}>Total de utilizadores
                                                pesquisadores</Text>
                                        </Box>
                                    </SkeletonText>
                                </Card>
                            </>
                            :
                            <ResearchStatusesCards/>
                    }
                </div>
                <div className={"p-2"}>
                    <Card className={"p-2 overflow-hidden"}>
                        <div className={"flex flex-col gap-56 lg:flex-row lg:gap-6"}>
                            <Skeleton isLoaded={!!researchStatistic} className={"w-full lg:h-[400px]"} width={"100%"}
                                      height={"300px"}>
                                <div id={"monthly"}>

                                </div>
                            </Skeleton>
                            <Skeleton isLoaded={!!researchStatistic} className={"w-full lg:w-[48.5%] lg:h-[400px]"}
                                      height={`${!researchStatistic ? "300px" : "auto"}`}>
                                <div id={"statuses"}>

                                </div>
                            </Skeleton>
                        </div>
                    </Card>
                </div>
                <div className={"p-2 grid grid-rows-3 gap-6 lg:grid-rows-none lg:grid-cols-3"}>
                    {
                        isAuthorized("read:user:list") &&
                        <>
                            <Card className={"p-4 flex gap-4"}>
                                <div className={"flex gap-2 items-center"}>
                                    <SkeletonCircle isLoaded={!!userStatistic} width={"100px"} height={"100px"}>
                                        <Box className={"bg-blue-400 flex items-center justify-center"} rounded={"full"}
                                             width={"100px"}
                                             height={"100px"}>
                                            <Text className={"text-white text-xl"}>
                                                {userStatistic?.verified}
                                            </Text>
                                        </Box>
                                    </SkeletonCircle>
                                    <Text className={"text-gray-700 font-bold text-2xl"}>
                                        Utilizadores Ativos
                                    </Text>
                                </div>
                                <SkeletonText isLoaded={!!userStatistic} noOfLines={3} skeletonHeight={4}>
                                    <Box className={"flex items-center"}>
                                        <Text className={"text-gray-500 text-md"}>Total de utilizadores que verificaram
                                            suas
                                            contas
                                            de e-mail. Incluindo os bloqueados</Text>
                                    </Box>
                                </SkeletonText>
                            </Card>
                            <Card className={"p-4 flex gap-4"}>
                                <div className={"flex gap-2 items-center"}>
                                    <SkeletonCircle isLoaded={!!userStatistic} width={"100px"} height={"100px"}>
                                        <Box className={"bg-blue-400 flex items-center justify-center"} rounded={"full"}
                                             width={"100px"}
                                             height={"100px"}>
                                            <Text className={"text-white text-xl"}>
                                                {userStatistic?.total - userStatistic?.verified}
                                            </Text>
                                        </Box>
                                    </SkeletonCircle>
                                    <Text className={"text-gray-700 font-bold text-2xl"}>
                                        Utilizadores Inativos
                                    </Text>
                                </div>
                                <SkeletonText isLoaded={!!userStatistic} noOfLines={3} skeletonHeight={4}>
                                    <Box className={"flex flex-col"}>
                                        <Text className={"text-gray-500 text-md"}>
                                            Total de utilizadores que não verificaram suas contas de e-mail. Sem acção
                                            no
                                            sistema.
                                        </Text>
                                    </Box>
                                </SkeletonText>
                            </Card>
                            <Card className={"p-4 flex gap-4"}>
                                <div className={"flex gap-2 items-center"}>
                                    <SkeletonCircle isLoaded={!!userStatistic} width={"100px"} height={"100px"}>
                                        <Box className={"bg-blue-400 flex items-center justify-center"} rounded={"full"}
                                             width={"100px"}
                                             height={"100px"}>
                                            <Text className={"text-white text-xl"}>
                                                {userStatistic?.blocked}
                                            </Text>
                                        </Box>
                                    </SkeletonCircle>
                                    <Text className={"text-gray-700 font-bold text-2xl"}>
                                        Utilizadores Bloqueados
                                    </Text>
                                </div>
                                <SkeletonText isLoaded={!!userStatistic} noOfLines={3} skeletonHeight={4}>
                                    <Box className={"flex flex-col"}>
                                        <Text className={"text-gray-500 text-md"}>
                                            Total de utilizadores banidos no sistema
                                        </Text>
                                    </Box>
                                </SkeletonText>
                            </Card>
                            <ResearchStatusesCards/>
                        </>
                    }
                </div>
            </main> :
            <main className={"w-full min-h-[90vh] flex items-center justify-center"}>
            </main>
    )
}
