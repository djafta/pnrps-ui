"use client"

import {Document, Page, PDFViewer, Text, View} from "@react-pdf/renderer"
import {Header} from "@/app/printing/[research]/header";
import {useEffect, useState} from "react";
import {Research} from "@/models";
import {useQuery} from "@apollo/client";
import {GET_RESEARCH_REPORT_QUERY} from "@/apollo";
import {Spinner} from "@chakra-ui/react";
import {styles} from "@/app/printing/[research]/styles";

export default function ResearchPrint({params}: { params: { research: string, doc: string } }) {
    const [research, setResearch] = useState<Research | null>(null)
    const getResearchReportQuery = useQuery(GET_RESEARCH_REPORT_QUERY, {
        variables: {
            id: params.research
        }
    });

    useEffect(() => {
        if (getResearchReportQuery.data?.getResearchReport) {
            setResearch(getResearchReportQuery.data.getResearchReport)
        }
    }, [getResearchReportQuery])

    if (global.window && research) {
        return (
            <div className={"fixed w-full h-full flex"} suppressHydrationWarning>
                <PDFViewer width={"100%"} height={"100%"}>
                    <Document>
                        <Page
                            size={"A4"}
                            style={{
                                padding: "25mm 20mm",
                                position: "relative",
                            }}
                        >
                            <Header/>
                            <View style={{
                                ...styles.body,
                                ...styles.mt50
                            }}>
                                <View style={styles.fontBold}>
                                    <Text>Exmo Sr(a)</Text>
                                    <Text>Instituição</Text>
                                </View>

                                <View style={{
                                    ...styles.flex,
                                    ...styles.flexRow,
                                    ...styles.justifyBetween,
                                    ...styles.mt10
                                }}>
                                    <View style={styles.fontBold}>
                                        <Text>Título da Pesquisa: <Text
                                            style={styles.fontNormal}>{research.title}</Text></Text>
                                        <Text>Código: <Text style={styles.fontNormal}>{research.code}</Text></Text>
                                    </View>
                                    <View style={styles.fontBold}>
                                        <Text>Data de Início: <Text
                                            style={styles.fontNormal}>{research.startDate && new Date(research.startDate).toISOString().split("T")[0]}</Text></Text>
                                        <Text>Data de Fim: <Text
                                            style={styles.fontNormal}>{research.endDate && new Date(research.endDate).toISOString().split("T")[0]}</Text></Text>
                                    </View>
                                </View>

                                <View style={{
                                    ...styles.fontBold
                                }}>
                                    <Text>Ponto de situação: <Text style={styles.fontNormal}>Informação
                                        indisponível</Text></Text>
                                    <Text>Faixa etária: <Text style={styles.fontNormal}>Informação
                                        indisponível</Text></Text>
                                    <Text>Área de abrangência: <Text style={styles.fontNormal}>{
                                        research.province ? "Provincial" : research.region ? "Regional" : "Multicêntrica"
                                    }</Text></Text>
                                    <Text>Classificação do tipo de pesquisa: <Text
                                        style={styles.fontNormal}>{research.classification?.name}</Text></Text>
                                    <Text>Área da pesquisa: <Text
                                        style={styles.fontNormal}>{research.field?.name}</Text></Text>
                                </View>
                            </View>
                        </Page>
                    </Document>
                </PDFViewer>
            </div>
        )
    }

    return (
        <div className={"fixed w-full h-full flex"}>
            <Spinner className={"m-auto"}/>
        </div>
    )
}
