"use client"

import {Document, Page, PDFViewer, Text, View} from "@react-pdf/renderer"
import {Header} from "@/app/printing/[research]/header";
import {useMemo} from "react";
import {Research} from "@/models";
import {useQuery} from "@apollo/client";
import {GET_RESEARCH_RC_QUERY} from "@/apollo";
import {Spinner} from "@chakra-ui/react";
import {styles} from "@/app/printing/[research]/styles";

const SPACE = " "
export default function ResearchPrint({params}: { params: { research: string, doc: string } }) {
    const getResearchRCQuery = useQuery(GET_RESEARCH_RC_QUERY, {
        variables: {
            id: params.research
        }
    });
    const research = useMemo(() => {
        return getResearchRCQuery.data?.getResearchRC as Research
    }, [getResearchRCQuery])

    if (global.window && research) {
        return (
            <div className={"fixed w-full h-full flex"}>
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
                                <View style={{
                                    ...styles.header
                                }}>
                                    <Text>
                                        AUTORIZAÇÃO PARA TRANSFERÊNCIA DE AMOSTRAS BIOLÓGICAS
                                    </Text>
                                </View>

                                <View style={{
                                    ...styles.mt10
                                }}>
                                    <Text>
                                        É autorizada a transferência de amostras biológicas, referente ao
                                        projecto/protocolo
                                        intitulado &quot;<Text>{research.title}</Text>&quot; com
                                        registro <Text>{research.approval.code} </Text>
                                        nas quantidades abaixo descritas:
                                    </Text>
                                </View>
                                <View>
                                    <Text style={{
                                        ...styles.textCenter,
                                        ...styles.mt50
                                    }}>
                                        A Direcção-Geral
                                    </Text>

                                    <Text
                                        style={{
                                            ...styles.mt30,
                                            ...styles.textCenter
                                        }}
                                    >
                                        _________________________________
                                    </Text>
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
