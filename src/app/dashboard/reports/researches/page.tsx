"use client"
import React from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Heading,
    Select,
    Skeleton, SkeletonCircle,
    SkeletonText,
} from "@chakra-ui/react";

interface Research {

}

export default function Page() {
    return (
        <>
            <main className={"relative pt-14 flex flex-col gap-10 bg-white lg:ps-16"}>
                <div className={"flex flex-col w-full gap-10"}>
                    <div className={"flex w-full p-2"}>
                        <Card className={"w-full gap-4 p-2"}>
                            <CardHeader>
                                <Heading size={"md"}>Pesquisas por Áreas Prioritária</Heading>
                            </CardHeader>
                            <CardBody>
                                <div className={"flex flex-col gap-4"}>
                                    <SkeletonText width={"100px"} noOfLines={1}
                                                  skeletonHeight={4}></SkeletonText>
                                    <div className={"flex flex-col gap-4 lg:flex-row"}>
                                        <Skeleton isLoaded={false} className={"w-full h-[400px]"}>

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
                    <div className={"flex w-full p-2"}>
                        <Card className={"w-full gap-4 p-2"}>
                            <CardHeader>
                                <Heading size={"md"}>Pesquisas por regiao geografica</Heading>
                            </CardHeader>
                            <CardBody>
                                <div className={"w-full"}>
                                    <div className={"grid gap-4"}>
                                        <div
                                            className={"grid grid-rows-2 gap-4 md:grid-cols-2 md:grid-rows-none"}>
                                            <div className={"flex w-full"}>
                                                <Select>

                                                </Select>
                                            </div>
                                            <div className={"flex w-full"}>
                                                <Select>

                                                </Select>
                                            </div>
                                        </div>
                                        <div className={"flex flex-col gap-4 lg:flex-row"}>
                                            <Skeleton isLoaded={false} className={"w-full h-[400px]"}>

                                            </Skeleton>
                                            <Skeleton isLoaded={false} className={"lg:w-[49%] h-[400px]"}>

                                            </Skeleton>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div className={"p-2 gap-4 grid grid-rows-2 lg:grid-cols-2 lg:grid-rows-none"}>
                        <Card className={"w-full gap-4 p-2"}>
                            <CardHeader>
                                <Heading size={"md"}>Pesquisas por confirmação de registo</Heading>
                            </CardHeader>
                            <CardBody>
                                <div className={"flex flex-col gap-4 h-full"}>
                                    <SkeletonText width={"100px"} noOfLines={1}
                                                  skeletonHeight={4}></SkeletonText>
                                    <div className={"h-full flex flex-col gap-4 lg:flex-row justify-center items-center"}>
                                        <SkeletonCircle isLoaded={false} className={"w-[200px] h-[200px]"}>

                                        </SkeletonCircle>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        <Card className={"w-full gap-4 p-2"}>
                            <CardHeader>
                                <Heading size={"md"}>Pesquisas por abrangencia de estudo</Heading>
                            </CardHeader>
                            <CardBody>
                                <div className={"flex flex-col gap-4"}>
                                    <SkeletonText width={"100px"} noOfLines={1}
                                                  skeletonHeight={4}></SkeletonText>
                                    <div className={"flex flex-col gap-4 lg:flex-row"}>
                                        <Skeleton isLoaded={false} className={"w-full h-[400px]"}>

                                        </Skeleton>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div className={"p-2 gap-4 grid grid-rows-2 lg:grid-cols-2 lg:grid-rows-none"}>
                        <Card className={"w-full gap-4 p-2"}>
                            <CardHeader>
                                <Heading size={"md"}>Pesquisas por aprovação ética</Heading>
                            </CardHeader>
                            <CardBody>
                                <div className={"flex flex-col gap-4 h-full"}>
                                    <SkeletonText width={"100px"} noOfLines={1}
                                                  skeletonHeight={4}></SkeletonText>
                                    <div className={"h-full flex flex-col gap-4 lg:flex-row justify-center items-center"}>
                                        <SkeletonCircle isLoaded={false} className={"w-[200px] h-[200px]"}>

                                        </SkeletonCircle>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        <Card className={"w-full gap-4 p-2"}>
                            <CardHeader>
                                <Heading size={"md"}>Pesquisas por tipo de financimento</Heading>
                            </CardHeader>
                            <CardBody>
                                <div className={"flex flex-col gap-4 h-full"}>
                                    <SkeletonText width={"100px"} noOfLines={1}
                                                  skeletonHeight={4}></SkeletonText>
                                    <div className={"h-full flex flex-col gap-4 lg:flex-row justify-center items-center"}>
                                        <SkeletonCircle isLoaded={false} className={"w-[200px] h-[200px]"}>

                                        </SkeletonCircle>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <div className={"p-2 gap-4 grid grid-rows-3 lg:grid-cols-3 lg:grid-rows-none"}>
                        <Card className={"w-full gap-4 p-2"}>
                            <CardHeader>
                                <Heading size={"md"}>Pesquisas por ambiente de implementação</Heading>
                            </CardHeader>
                            <CardBody>
                                <div className={"flex flex-col gap-4 h-full"}>
                                    <SkeletonText width={"100px"} noOfLines={1}
                                                  skeletonHeight={4}></SkeletonText>
                                    <div className={"h-full flex flex-col gap-4 lg:flex-row justify-center items-center"}>
                                        <SkeletonCircle isLoaded={false} className={"w-[200px] h-[200px]"}>

                                        </SkeletonCircle>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        <Card className={"w-full gap-4 p-2"}>
                            <CardHeader>
                                <Heading size={"md"}>Pesquisas por estágio</Heading>
                            </CardHeader>
                            <CardBody>
                                <div className={"flex flex-col gap-4 h-full"}>
                                    <SkeletonText width={"100px"} noOfLines={1}
                                                  skeletonHeight={4}></SkeletonText>
                                    <div className={"h-full flex flex-col gap-4 lg:flex-row justify-center items-center"}>
                                        <SkeletonCircle isLoaded={false} className={"w-[200px] h-[200px]"}>

                                        </SkeletonCircle>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        <Card className={"w-full gap-4 p-2"}>
                            <CardHeader>
                                <Heading size={"md"}>Pesquisas por âmbito da pesquisa</Heading>
                            </CardHeader>
                            <CardBody>
                                <div className={"flex flex-col gap-4 h-full"}>
                                    <SkeletonText width={"100px"} noOfLines={1}
                                                  skeletonHeight={4}></SkeletonText>
                                    <div className={"h-full flex flex-col gap-4 lg:flex-row justify-center items-center"}>
                                        <SkeletonCircle isLoaded={false} className={"w-[200px] h-[200px]"}>

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
