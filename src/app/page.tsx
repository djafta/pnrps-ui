"use client"

import React, {useEffect, useMemo, useState} from "react";
import {PublicHeader} from "@/components/header/public";

import {
    Box,
    Button,
    Card,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Skeleton, SkeletonCircle,
    SkeletonText,
    Switch,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td, Text,
    Th,
    Thead,
    Tooltip,
    Tr,
    useDisclosure
} from "@chakra-ui/react";
import {Research} from "@/models";
import {useLazyQuery, useQuery} from "@apollo/client";
import {GET_RESEARCH_STATISTIC, GET_USER_STATISTIC, HAS_APPROVAL_QUERY, LIST_RESEARCHES_QUERY} from "@/apollo";
import {ViewResearchDataCard} from "@/app/researches/cards/view-research-data-card";
import {ViewResearchGeographicDataCard} from "@/app/researches/cards/view-research-geographic-data-card";
import {ViewResearchersCard} from "@/app/researches/cards/view-researchers-card";
import {ViewFinancingCard} from "@/app/researches/cards/view-financing-card";
import {ViewResearchApprovalCard} from "@/app/researches/cards/view-research-approval-card";
import {ViewResearchFilesCard} from "@/app/researches/cards/view-research-files-card";
import {EditResearchAgreementsCard} from "@/app/dashboard/management/researches/cards/edit-research-agreements-card";
import Link from "next/link";
import {AiOutlineFilePdf} from "react-icons/ai";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/auth";
import Highcharts from "highcharts";

export default function Home() {
    const router = useRouter()
    const {user} = useAuth()
    const listResearchesQuery = useQuery(LIST_RESEARCHES_QUERY, {
        pollInterval: 1000 * 30 // 30 seconds
    })

    const [getResearchApproval] = useLazyQuery(HAS_APPROVAL_QUERY)
    const [hasApproval, setHasApproval] = useState(false);

    const [research, setResearch] = useState<Research>({} as Research);

    const researches = useMemo(() => {
        return (listResearchesQuery.data?.listResearches || []) as Research[]
    }, [listResearchesQuery])

    const disclosure = useDisclosure();

    const getResearchStatisticQuery = useQuery(GET_RESEARCH_STATISTIC, {
        pollInterval: 1000 * 10
    })
    const researchStatistic = useMemo(() => {
        return getResearchStatisticQuery.data?.getResearchStatistics
    }, [getResearchStatisticQuery])


    useEffect(() => {
        if (disclosure.isOpen && research) {
            getResearchApproval({
                variables: {
                    id: research?.id
                }
            }).then(({data}) => {
                setHasApproval(!!data?.getResearchApproval)
            })
        }
    }, [research, disclosure.isOpen, getResearchApproval])

    function handleResearchRowClick(research: Research | undefined) {
        if (research) {
            setResearch(research)
            disclosure.onOpen()
        }
    }

    useEffect(() => {
        if (user) {
            router.push("/dashboard")
        }

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
    }, [router, user, researchStatistic])

    useEffect(() => {
        setResearch(research => researches.find((r) => research?.id === r.id) as Research)
    }, [researches])

    return (
        <>
            <PublicHeader/>
            <main className={"pt-24 flex flex-col gap-10"}>
                <div className={"p-2 grid grid-rows-3 gap-6 lg:grid-cols-3 lg:grid-rows-none"}>
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
                                <Text className={"text-gray-500 text-md"}>Total de pesquisas em processo de
                                    aprovação</Text>
                            </Box>
                        </SkeletonText>
                    </Card>
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
                <div className={"p-2"}>
                    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}
                           size={"6xl"} scrollBehavior={"inside"}>
                        <ModalOverlay/>
                        <ModalContent>
                            <ModalHeader>
                                <ModalCloseButton className={"z-40"}/>
                            </ModalHeader>
                            <ModalBody>
                                <div className={"flex flex-col gap-6"}>
                                    <ViewResearchDataCard research={research} setResearch={setResearch}/>
                                    <ViewResearchGeographicDataCard research={research} setResearch={setResearch}/>
                                    <ViewResearchersCard research={research} setResearch={setResearch}/>
                                    <ViewFinancingCard research={research} setResearch={setResearch}/>
                                    <ViewResearchApprovalCard research={research} setResearch={setResearch}/>
                                    <ViewResearchFilesCard research={research} setResearch={setResearch}/>
                                    <EditResearchAgreementsCard research={research}/>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <div className={"w-full flex gap-2 md:flex-row md:justify-end"}>
                                    <Link href={`/printing/${research?.id}/report`} target={"_blank"}>
                                        <Button colorScheme={"teal"} variant={"outline"}
                                                rightIcon={<AiOutlineFilePdf/>}>
                                            Imprimir Relatório
                                        </Button>
                                    </Link>
                                    <Button
                                        isDisabled={!hasApproval}
                                        title={!hasApproval ? "Esta pesquisa ainda não foi aprovada" : "Imprimir Acordo de Transferência de Material"}
                                        colorScheme={"teal"} variant={"outline"} rightIcon={<AiOutlineFilePdf/>}>
                                        <Link href={hasApproval ? `/printing/${research?.id}/mta` : "#"}
                                              target={hasApproval ? "_blank" : undefined}>
                                            Imprimir MTA
                                        </Link>
                                    </Button>
                                    <Button
                                        isDisabled={!hasApproval}
                                        title={!hasApproval ? "Esta pesquisa ainda não foi aprovada" : "Imprimir Confirmação de registro"}
                                        colorScheme={"teal"} variant={"outline"} rightIcon={<AiOutlineFilePdf/>}>
                                        <Link
                                            href={hasApproval ? `/printing/${research?.id}/cr` : "#"}
                                            target={hasApproval ? "_blank" : undefined}>
                                            Imprimir CR
                                        </Link>
                                    </Button>
                                </div>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    <Card>
                        <div className={"p-2"}>
                            <FormControl className={"flex flex-col md:flex-row gap-4"}>
                                <div>
                                    <Input type={"search"}/>
                                </div>
                                <div className={"flex gap-4 flex-col md:flex-row"}>
                                    <Tooltip closeOnClick={true} hasArrow={true}
                                             label={"Mostrar pesquisas somente validadas"}>
                                        <Switch className={"flex items-center"}>Pesquisas Validadas</Switch>
                                    </Tooltip>
                                    <Tooltip closeOnClick={true} hasArrow={true}
                                             label={"Mostrar pesquisas somente autorizadas"}>
                                        <Switch className={"flex items-center"}>Pesquisas Autorizadas</Switch>
                                    </Tooltip>
                                </div>
                            </FormControl>
                            <div>

                            </div>
                        </div>
                        <Card>
                            <TableContainer>
                                <Table variant={"simple"} colorScheme={"teal"}>
                                    <TableCaption>Pesquisas</TableCaption>
                                    <Thead>
                                        <Tr>
                                            <Th>Acronimo</Th>
                                            <Th>Titulo</Th>
                                            <Th>Tipo</Th>
                                            <Th>Area</Th>
                                            <Th>Pesquisador</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {researches.map((research) => {
                                            return (
                                                <Tr key={research.id} onClick={() => handleResearchRowClick(research)}
                                                    className={"hover:bg-teal-500 hover:text-white cursor-pointer transition-colors"}>
                                                    <Td>{research.acronym}</Td>
                                                    <Td>{research.title}</Td>
                                                    <Td>{research.subtype?.name}</Td>
                                                    <Td>{research.subfield?.name}</Td>
                                                    <Td>{research.owner?.firstName} {research.owner?.lastName}</Td>
                                                </Tr>
                                            )
                                        })}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Card>
                    </Card>
                </div>
            </main>
            <footer className={"py-5"}>
                <div className={"flex flex-col items-center"}>
                    <p>
                        © Copyright <a className={"text-blue-500"} href={""}>INS</a>. Todos direitos reservados
                    </p>
                    <p>
                        Desenvolvido pela <a className={"text-blue-500"} href={""}>Quidgest</a>
                    </p>
                </div>
            </footer>
        </>
    )
}
