"use client"

import {Document, Image, Page, PDFViewer, Text, View} from "@react-pdf/renderer"
import {Header} from "@/app/printing/[research]/header";
import {useMemo} from "react";
import {Collaboration, Research} from "@/models";
import {useQuery} from "@apollo/client";
import {GET_RESEARCH_RC_QUERY} from "@/apollo";
import {Spinner} from "@chakra-ui/react";
import {styles} from "@/app/printing/[research]/styles";
import Qrcode from "qrcode";
import {useDefault} from "@/hooks/default";

const SPACE = " "
export default function ResearchPrint({params}: { params: { research: string, doc: string } }) {
    const {isDefault} = useDefault()
    const getResearchRCQuery = useQuery(GET_RESEARCH_RC_QUERY, {
        variables: {
            id: params.research
        }
    });

    const research = useMemo(() => {
        return getResearchRCQuery.data?.getResearchRC as Research
    }, [getResearchRCQuery])

    const qrcode = useMemo(async () => {
        return await Qrcode.toDataURL(`${window.location.origin}/${research?.id}`);
    }, [research])

    if (research) {
        const {researcher} = research.collaborations.find(({role}) => isDefault(role)) as Collaboration

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
                                <View style={styles.fontBold}>
                                    <Text>Exmo Sr(a)
                                        <Text style={styles.fontNormal}>
                                            {SPACE} {researcher.firstName} {researcher.lastName}
                                        </Text>
                                    </Text>
                                </View>

                                <View style={{
                                    ...styles.mt10
                                }}>
                                    <View style={styles.fontBold}>
                                        <Text>Assunto: <Text
                                            style={styles.fontNormal}>Confirmação do Registo de Pesquisa em saúde na
                                            PNRPS</Text></Text>
                                        <Text>Código: <Text style={styles.fontNormal}>{research.code}</Text></Text>
                                    </View>
                                    <View style={{
                                        ...styles.fontNormal,
                                        ...styles.mt10
                                    }}>
                                        <Text style={styles.textJustify}>
                                            A pesquisa intitulada <Text
                                            style={styles.fontBold}>{SPACE + research.title + SPACE}</Text>
                                            com o código de aprovação <Text
                                            style={styles.fontBold}>{SPACE + research.approval?.code + SPACE}</Text>
                                            foi registada na Plataforma Nacional de Registo da Investigação em Saúde
                                            com o código <Text
                                            style={styles.fontBold}>{SPACE + research.code}</Text>.

                                            A informação sobre o estudo deve
                                            ser actualizada periodicamente na Plataforma conforme o decurso das
                                            actividades.
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.mt30}>
                                    <Text>Atenciosamente,</Text>
                                </View>
                                <View style={{
                                    ...styles.mt30,
                                    ...styles.textCenter,
                                    ...styles.fontBold
                                }}>
                                    <Text>O Director Geral</Text>
                                    <Text style={styles.fontNormal}>Assinatura</Text>
                                    <Text>Ilesh V. Jani, MD PhD</Text>
                                    <Text style={styles.fontNormal}>(Investigador Coordenador)</Text>
                                    <Text>Maputo aos {new Date().toLocaleDateString()}</Text>
                                </View>
                                <Image style={{
                                    width: 150,
                                    height: 150,
                                    margin: "0 auto 10 auto",
                                    ...styles.mt10,
                                }} src={qrcode}/>
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
