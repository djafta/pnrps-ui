"use client"
import React from "react";
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

export default function Page() {
    return (
        <>
            <main className={"relative pt-14 flex flex-col gap-10 bg-white lg:ps-16"}>
                <div className={"flex flex-col w-full gap-10"}>
                    <div className={"p-2 gap-4 grid"}>
                        <Card className={"w-full gap-4 p-2"}>
                            <CardHeader className={"flex justify-between"}>
                                <Heading size={"md"}>Filtrar pesquisadores</Heading>
                                <Skeleton isLoaded={true} className={"w-fit"}>
                                    <Select>
                                        <option>2023</option>
                                        <option>2024</option>
                                    </Select>
                                </Skeleton>
                            </CardHeader>
                            <CardBody>
                                <div className={"flex flex-col gap-4 h-full lg:flex-row"}>
                                    <div className={"flex flex-col gap-2 md:flex-row w-full"}>
                                        <FormControl>
                                            <FormLabel>Sexo</FormLabel>
                                            <Select name={"sex"}>
                                                <option value={"M"}>Masculino</option>
                                                <option value={"F"}>Femenino</option>
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
                                        className={"h-full flex flex-col gap-4 lg:flex-row justify-center items-center w-full"}>
                                        <SkeletonCircle isLoaded={false} className={"w-[300px] h-[300px]"}>

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
                                    <Select>
                                        <option>2023</option>
                                        <option>2024</option>
                                    </Select>
                                </Skeleton>
                            </CardHeader>
                            <CardBody>
                                <div className={"flex flex-col gap-4"}>
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
                </div>

            </main>
        </>
    )
}
