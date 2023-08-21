"use client"
import {
    Button,
    Card, CardBody, CardFooter, CardHeader, FormControl, FormLabel, Input, Radio, Skeleton, useToast,
} from "@chakra-ui/react";
import {useAuth} from "@/hooks/auth";
import {AiOutlineUser} from "react-icons/ai";
import {FormEvent, useCallback, useState} from "react";
import {User} from "@/models";
import {useMutation} from "@apollo/client";
import {GET_USER_SELF_QUERY, UPDATE_USER_MUTATION} from "@/apollo";

export default function Profile() {
    const [updateUserMutation, updateUserMutationResult] = useMutation(UPDATE_USER_MUTATION, {
        refetchQueries: [GET_USER_SELF_QUERY]
    });

    const toast = useToast();
    const {user} = useAuth();
    const [data, setData] = useState<User>(user as User);

    const updateUserData = useCallback(async () => {

        await updateUserMutation({
            variables: {
                input: {
                    id: data?.id,
                    features: data?.features,
                    firstName: data?.firstName,
                    lastName: data?.lastName,
                    email: data?.email,
                    birthDate: data?.birthDate && new Date(data?.birthDate),
                    sex: data?.sex,
                }
            }
        })

        toast({
            title: "Atualizado com sucesso",
            description: `Seus dados foram atualizados com sucesso`,
            status: "success",
            isClosable: true,
            position: "bottom-right",
            colorScheme: "teal",
        })
    }, [updateUserMutation, data, toast])

    const handleUserDataChange = useCallback((e: FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;

        setData(prevState => {
            return {
                ...prevState,
                [target.name]: target.value
            }
        })
    }, [])

    return (
        <div className={"lg:ps-16"}>
            <div className={"flex flex-col gap-8 overflow-y-auto p-1 pt-16"}>
                <Card className={"flex flex-col"}>
                    <CardHeader>
                        <h3 className={"text-lg"}>Informações Pessoais</h3>
                    </CardHeader>
                    <CardBody className={"flex flex-col gap-6"}>
                        <div className={"flex gap-6 flex-col w-full items-center justify-center lg:flex-row"}>
                            <div className={"block"}>
                                <Skeleton isLoaded={!!user} className={"rounded-full"}>
                                    <div className={"rounded-full w-80 h-80 bg-gray-400 flex p-6"}>
                                        <AiOutlineUser className={"w-full h-full m-auto fill-white"}/>
                                    </div>
                                </Skeleton>
                            </div>
                            <div className={"w-full lg:max-w-[calc(100%-350px)]"}>
                                <div className={"flex gap-4 flex-col lg:flex-row"}>
                                    <FormControl>
                                        <FormLabel>Primeiro Nome</FormLabel>
                                        <Input onChange={handleUserDataChange} name={"firstName"}
                                               defaultValue={user?.firstName}/>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Último Nome</FormLabel>
                                        <Input onChange={handleUserDataChange} name={"lastName"}
                                               defaultValue={user?.lastName}/>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Email</FormLabel>
                                        <Input isReadOnly={true} defaultValue={user?.email}/>
                                    </FormControl>
                                </div>
                                <div className={"flex gap-4 flex-col lg:flex-row w-full mt-5"}>
                                    <FormControl>
                                        <FormLabel>Sexo</FormLabel>
                                        <div className={"flex gap-6"}>
                                            <Radio isChecked={data?.sex === "M"} onChange={handleUserDataChange}
                                                   value={"M"}
                                                   name={"sex"}>Masculino</Radio>
                                            <Radio isChecked={data?.sex === "F"} onChange={handleUserDataChange}
                                                   value={"F"}
                                                   name={"sex"}>Femenino</Radio>
                                        </div>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Data de Nascimento</FormLabel>
                                        <Input
                                            defaultValue={data.birthDate && new Date(data?.birthDate).toISOString().split("T")[0]}
                                            onChange={handleUserDataChange} name={"birthDate"} type={"date"}/>
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                    <CardFooter>
                        <div className={"flex w-full"}>
                            <Button
                                onClick={updateUserData}
                                isLoading={updateUserMutationResult.loading} className={"w-full lg:w-fit"}
                                colorScheme={"teal"}>Atualizar</Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
