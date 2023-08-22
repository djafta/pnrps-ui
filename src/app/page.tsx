"use client"

import React, {useEffect, useMemo} from "react";
import {BiDownload} from "react-icons/bi";
import {PublicHeader} from "@/components/header/public";

import {
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
    Skeleton,
    SkeletonText,
    Switch,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tooltip,
    Tr,
    useDisclosure
} from "@chakra-ui/react";
import {Research} from "@/models";
import {useAuth} from "@/hooks/auth";
import {useRouter} from "next/navigation";
import {useQuery} from "@apollo/client";
import {LIST_RESEARCHES_QUERY} from "@/apollo";

export default function Home() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {user} = useAuth();
    const router = useRouter();

    const listResearchesQuery = useQuery(LIST_RESEARCHES_QUERY, {
        pollInterval: 1000 * 30 // 30 seconds
    })

    const researches = useMemo(() => {
        return (listResearchesQuery.data?.listResearches || []) as Research[]
    }, [listResearchesQuery])

    useEffect(() => {
        if (user) {
            router.push("/dashboard")
        }
    }, [user, router])

    function handleResearchRowClick(research: Research | undefined) {
        onOpen()
    }

    return (
        <>
            <PublicHeader/>
            <main className={"pt-24 flex flex-col gap-10"}>
                <div className={"p-2 grid grid-rows-3 gap-6 lg:grid-cols-3 lg:grid-rows-none"}>
                    <Card className={"p-4"}>
                        <SkeletonText height={"100px"} spacing={4} skeletonHeight={4} width={"200px"} noOfLines={2}>
                        </SkeletonText>
                    </Card>
                    <Card className={"p-4"}>
                        <SkeletonText height={"100px"} spacing={4} skeletonHeight={4} width={"200px"} noOfLines={2}>

                        </SkeletonText>
                    </Card>
                    <Card className={"p-4"}>
                        <SkeletonText height={"100px"} spacing={4} skeletonHeight={4} width={"200px"} noOfLines={2}>

                        </SkeletonText>
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
                <div className={"p-2"}>
                    <Modal isOpen={isOpen} onClose={onClose} size={"4xl"} isCentered={true}>
                        <ModalOverlay/>
                        <ModalContent>
                            <ModalHeader>Detalhes da pesquisa</ModalHeader>
                            <ModalCloseButton/>
                            <ModalBody>
                                <div className={"grid grid-cols-2 gap-6"}>
                                    <SkeletonText noOfLines={1} skeletonHeight={5}></SkeletonText>
                                    <SkeletonText noOfLines={1} skeletonHeight={5}></SkeletonText>
                                    <SkeletonText noOfLines={1} skeletonHeight={5}></SkeletonText>
                                    <SkeletonText noOfLines={1} skeletonHeight={5}></SkeletonText>
                                    <SkeletonText noOfLines={1} skeletonHeight={5}></SkeletonText>
                                    <SkeletonText noOfLines={1} skeletonHeight={5}></SkeletonText>
                                    <SkeletonText noOfLines={1} skeletonHeight={5}></SkeletonText>
                                    <SkeletonText noOfLines={1} skeletonHeight={5}></SkeletonText>
                                    <SkeletonText noOfLines={1} skeletonHeight={5}></SkeletonText>
                                    <SkeletonText noOfLines={1} skeletonHeight={5}></SkeletonText>
                                    <SkeletonText noOfLines={1} skeletonHeight={5}></SkeletonText>
                                    <SkeletonText noOfLines={1} skeletonHeight={5}></SkeletonText>
                                    <SkeletonText noOfLines={1} skeletonHeight={5}></SkeletonText>
                                    <SkeletonText noOfLines={1} skeletonHeight={5}></SkeletonText>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Skeleton>
                                    <Button colorScheme={"teal"} variant={"outline"} mr={3} rightIcon={<BiDownload/>}>
                                        Baixar
                                    </Button>
                                </Skeleton>
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
