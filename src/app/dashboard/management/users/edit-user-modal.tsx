import {
    Button, Card, CardBody, CardHeader,
    Checkbox, Code, FormControl, FormHelperText, FormLabel,
    Heading, Input,
    Modal,
    ModalBody, ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    ModalProps, Table, Tbody, Td, Tr, useToast
} from "@chakra-ui/react";
import {User} from "@/models";
import React, {useCallback, useEffect, useState} from "react";
import {useMutation} from "@apollo/client";
import {LIST_USERS_QUERY, UPDATE_USER_MUTATION} from "@/apollo";

export interface EditUserModalProps extends Omit<ModalProps, "children"> {
    readonly user?: User
}

export function EditUserModal({isOpen, onClose, user}: EditUserModalProps) {
    const toast = useToast();
    const [userData, setUserData] = useState<User | undefined>(user)
    const [isChanged, setChanged] = useState(false)
    const [updateUserMutation, updateUserMutationResult] = useMutation(UPDATE_USER_MUTATION, {
        refetchQueries: [LIST_USERS_QUERY]
    });

    const handleUpdateUser = useCallback(async () => {
        await updateUserMutation({
            variables: {
                input: {
                    id: userData?.id,
                    features: userData?.features,
                    firstName: userData?.firstName,
                    lastName: userData?.lastName,
                    email: userData?.email
                }
            }
        })

        toast({
            title: "Utilizador Atualizado!",
            description: `Utilizador ${userData?.firstName} ${userData?.lastName} atualizado com sucesso.`,
            status: "success",
            isClosable: true,
            position: "top",
            colorScheme: "teal",
        })
    }, [toast, updateUserMutation, userData])

    const setFeatures = useCallback((fn?: (data: string[]) => string[] | undefined) => {
        if (userData && fn) {
            setUserData({
                ...userData,
                features: Array.from(new Set(fn(userData.features) || []))
            })
        }
    }, [userData])

    useEffect(() => {
        if (isOpen) {
            setUserData(user)
        } else {
            setUserData(undefined)
        }
    }, [isOpen, user])

    const hasFeatures = useCallback((...list: string[]) => {
        for (let feature of list) {
            if (!userData?.features.includes(feature)) return false;
        }

        return true;
    }, [userData])
    const userFeatures = [
        "create:user",
        "edit:user",
        "read:user",
        "delete:user"
    ]
    const researchFeatures = [
        "create:research:self",
        "edit:research:self",
        "read:research:self",
        "delete:research:self",
        "read:research:list",
    ]
    const managerFeatures = [
        "create:manager",
        "edit:manager",
        "delete:manager",
    ]

    const settingsFeatures = [
        "create:research_settings",
        "edit:research_settings",
        "read:research_settings",
        "delete:research_settings",

        "create:geographic_data",
        "edit:geographic_data",
        "read:geographic_data",
        "delete:geographic_data",

        "create:organization",
        "edit:organization",
        "read:organization",
        "delete:organization",

        "create:financing_type",
        "edit:financing_type",
        "read:financing_type",
        "delete:financing_type",

        "read:researcher_settings",
        "delete:researcher_settings",
        "create:researcher_settings",
        "edit:researcher_settings",

        "create:financier",
        "edit:financier",
        "read:financier",
        "delete:financier"
    ]

    return (
        <Modal size={"6xl"} isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading fontWeight={"400"} size={"md"}>Editar Utilizador</Heading>
                    <ModalCloseButton/>
                </ModalHeader>
                <ModalBody>
                    <div className={"flex flex-col gap-8 overflow-y-auto p-1"}>
                        <Card className={"flex flex-col"}>
                            <CardHeader>
                                <h3 className={"text-lg"}>Informações Pessoais</h3>
                            </CardHeader>
                            <CardBody>
                                <div className={"flex gap-4 flex-col lg:flex-row"}>
                                    <FormControl>
                                        <FormLabel>Primeiro Nome</FormLabel>
                                        <Input
                                            onChange={(e) => {
                                                if (userData) {
                                                    setUserData({
                                                        ...userData,
                                                        firstName: e.target.value
                                                    })
                                                }
                                            }}
                                            defaultValue={userData?.firstName}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Último Nome</FormLabel>
                                        <Input
                                            onChange={(e) => {
                                                if (userData) {
                                                    setUserData({
                                                        ...userData,
                                                        lastName: e.target.value
                                                    })
                                                }
                                            }}
                                            defaultValue={userData?.lastName}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            onChange={(e) => {
                                                if (userData) {
                                                    setUserData({
                                                        ...userData,
                                                        email: e.target.value
                                                    })
                                                }
                                            }}
                                            defaultValue={userData?.email}
                                        />
                                    </FormControl>
                                </div>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>
                                <h3 className={"text-lg"}>Permissões de pesquisas</h3>
                            </CardHeader>
                            <CardBody>
                                <div className={"flex flex-col gap-2"}>
                                    <Checkbox
                                        isChecked={
                                            hasFeatures(...researchFeatures)
                                        }
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFeatures(features => [...features, ...researchFeatures])
                                            } else {
                                                setFeatures(features => features.filter(feature => !researchFeatures.includes(feature)))
                                            }
                                        }}
                                    >manusear:pesquisas:pessoais</Checkbox>
                                    <div className={"flex flex-col gap-5 ps-6 text-xs"}>
                                        <FormControl>
                                            <Checkbox
                                                isChecked={hasFeatures("create:research:self")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFeatures(features => [...features, "create:research:self"])
                                                    } else {
                                                        setFeatures(features => features.filter(value => value !== "create:research:self"))
                                                    }
                                                }}
                                                letterSpacing={0}>criar:pesquisas:pessoais</Checkbox>
                                            <FormHelperText padding={"0.5rem 1rem"} lineHeight={"1.5rem"}>
                                                Permite que o usuário crie pesquisas no sistema.
                                                Para garantir o total benefício desta permissão, atribua também as
                                                permições de
                                                <Code lineHeight={"1.2rem"}
                                                      rounded={"1rem"}>listar:utilizadores</Code> e
                                                <Code lineHeight={"1.2rem"}
                                                      rounded={"1rem"}>listar:pesquisas:pessoais</Code>
                                            </FormHelperText>
                                        </FormControl>
                                        <FormControl>
                                            <Checkbox
                                                isChecked={hasFeatures("edit:research:self")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFeatures(features => [...features, "edit:research:self"])
                                                    } else {
                                                        setFeatures(features => features.filter(value => value !== "edit:research:self"))
                                                    }
                                                }}
                                                letterSpacing={0}>editar:pesquisas:pessoais</Checkbox>
                                            <FormHelperText padding={"0.5rem 1rem"} lineHeight={"1.5rem"}>
                                                Permite que o usuário edite as pesquisas dele no sistema.
                                                Para garantir o total benefício desta permissão, atribua também as
                                                permições de
                                                <Code lineHeight={"1.2rem"}
                                                      rounded={"1rem"}>listar:pesquisas:pessoais</Code>
                                                e <Code lineHeight={"1.2rem"}
                                                        rounded={"1rem"}>visualizar-pesquisas-pessoais</Code>
                                            </FormHelperText>
                                        </FormControl>
                                        <FormControl>
                                            <Checkbox
                                                isChecked={hasFeatures("read:research:self")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFeatures(features => [...features, "read:research:self"])
                                                    } else {
                                                        setFeatures(features => features.filter(value => value !== "read:research:self"))
                                                    }
                                                }}
                                                letterSpacing={0}>visualizar:pesquisas:pessoais</Checkbox>
                                            <FormHelperText padding={"0.5rem 1rem"} lineHeight={"1.5rem"}>
                                                Permite que o usuário visualize pesquisas dele no sistema.
                                            </FormHelperText>
                                        </FormControl>
                                        <FormControl>
                                            <Checkbox
                                                isChecked={hasFeatures("read:research:list")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFeatures(features => [...features, "read:research:list"])
                                                    } else {
                                                        setFeatures(features => features.filter(value => value !== "read:research:list"))
                                                    }
                                                }}
                                                letterSpacing={0}>visualizar:pesquisas</Checkbox>
                                            <FormHelperText padding={"0.5rem 1rem"} lineHeight={"1.5rem"}>
                                                Permite que o usuário visualize pesquisas no sistema.
                                            </FormHelperText>
                                        </FormControl>
                                        <FormControl>
                                            <Checkbox
                                                isChecked={hasFeatures("delete:research:self")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFeatures(features => [...features, "delete:research:self"])
                                                    } else {
                                                        setFeatures(features => features.filter(value => value !== "delete:research:self"))
                                                    }
                                                }}
                                                letterSpacing={0}>apagar:pesquisas:pessoais</Checkbox>
                                            <FormHelperText padding={"0.5rem 1rem"} lineHeight={"1.5rem"}>
                                                Permite que o usuário apague as pesquisas dele no sistema.
                                                Para garantir o total benefício desta permissão, atribua também as
                                                permições de
                                                <Code lineHeight={"1.2rem"}
                                                      rounded={"1rem"}>listar:pesquisas:pessoais</Code> e
                                                <Code lineHeight={"1.2rem"}
                                                      rounded={"1rem"}>visualizar:pesquisas:pessoais</Code>
                                            </FormHelperText>
                                        </FormControl>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>
                                <h3 className={"text-lg"}>Permissões de utilizadores</h3>
                            </CardHeader>
                            <CardBody>
                                <div className={"flex flex-col gap-2"}>
                                    <Checkbox
                                        isChecked={
                                            hasFeatures(...userFeatures)
                                        }
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFeatures(features => [...features, ...userFeatures])
                                            } else {
                                                setFeatures(features => features.filter((feature) => {
                                                    return !userFeatures.includes(feature)
                                                }))
                                            }
                                        }}
                                    >gerir:utilizadores</Checkbox>
                                    <div className={"flex flex-col gap-5 ps-6 text-xs"}>
                                        <FormControl>
                                            <Checkbox
                                                isChecked={hasFeatures("create:user")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFeatures(features => [...features, "create:user"])
                                                    } else {
                                                        setFeatures(features => features.filter(value => value !== "create:user"))
                                                    }
                                                }}
                                                letterSpacing={0}>criar:utilizador</Checkbox>
                                            <FormHelperText padding={"0.5rem 1rem"} lineHeight={"1.5rem"}>
                                                Permite que o usuário crie pesquisas no sistema.
                                                Para garantir o total benefício desta permissão, atribua também as
                                                permições de
                                                <Code lineHeight={"1.2rem"}
                                                      rounded={"1rem"}>listar:utilizadores</Code> e
                                                <Code lineHeight={"1.2rem"}
                                                      rounded={"1rem"}>listar:pesquisas:pessoais</Code>
                                            </FormHelperText>
                                        </FormControl>
                                        <FormControl>
                                            <Checkbox
                                                isChecked={hasFeatures("edit:user")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFeatures(features => [...features, "edit:user"])
                                                    } else {
                                                        setFeatures(features => features.filter(value => value !== "edit:user"))
                                                    }
                                                }}
                                                letterSpacing={0}>editar:utilizador</Checkbox>
                                            <FormHelperText padding={"0.5rem 1rem"} lineHeight={"1.5rem"}>
                                                Permite que o usuário edite as contas de utilizadores no sistema.
                                                Para garantir o total benefício desta permissão, atribua também as
                                                permições de
                                                <Code lineHeight={"1.2rem"} rounded={"1rem"}>listar:utilizadores</Code>
                                                e <Code lineHeight={"1.2rem"}
                                                        rounded={"1rem"}>visualizar:utilizador</Code>
                                            </FormHelperText>
                                        </FormControl>
                                        <FormControl>
                                            <Checkbox
                                                isChecked={hasFeatures("read:user")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFeatures(features => [...features, "read:user"])
                                                    } else {
                                                        setFeatures(features => features.filter(value => value !== "read:user"))
                                                    }
                                                }}
                                                letterSpacing={0}>visualizar:utilizador</Checkbox>
                                            <FormHelperText padding={"0.5rem 1rem"} lineHeight={"1.5rem"}>
                                                Permite que o usuário visualize utilizadores no sistema.
                                            </FormHelperText>
                                        </FormControl>
                                        <FormControl>
                                            <Checkbox
                                                isChecked={hasFeatures("delete:user")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFeatures(features => [...features, "delete:user"])
                                                    } else {
                                                        setFeatures(features => features.filter(value => value !== "delete:user"))
                                                    }
                                                }}
                                                letterSpacing={0}>apagar:utilizador</Checkbox>
                                            <FormHelperText padding={"0.5rem 1rem"} lineHeight={"1.5rem"}>
                                                Permite que o usuário apague contas de utilizadores no sistema.
                                                Para garantir o total benefício desta permissão, atribua também as
                                                permições de
                                                <Code lineHeight={"1.2rem"}
                                                      rounded={"1rem"}>listar:utilizadores</Code> e
                                                <Code lineHeight={"1.2rem"}
                                                      rounded={"1rem"}>visualizar:utilizador</Code>
                                            </FormHelperText>
                                        </FormControl>
                                    </div>
                                    <div className={"flex my-3"}>
                                        <Checkbox
                                            isChecked={
                                                hasFeatures("read:researcher:list")
                                            }
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFeatures(features => [...features, "read:researcher:list"])
                                                } else {
                                                    setFeatures(features => features.filter((feature) => {
                                                        return !features.includes("read:researcher:list")
                                                    }))
                                                }
                                            }}
                                        >listar:pesquisadores</Checkbox>
                                    </div>
                                </div>

                                <div className={"flex flex-col gap-2"}>
                                    <Checkbox
                                        isChecked={
                                            hasFeatures(...managerFeatures)
                                        }
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFeatures(features => [...features, ...managerFeatures])
                                            } else {
                                                setFeatures(features => features.filter((feature) => {
                                                    return !managerFeatures.includes(feature)
                                                }))
                                            }
                                        }}
                                    >gerir:gestores</Checkbox>
                                    <div className={"flex flex-col gap-5 ps-6 text-xs"}>
                                        <FormControl>
                                            <Checkbox
                                                isChecked={hasFeatures("create:manager")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFeatures(features => [...features, "create:manager"])
                                                    } else {
                                                        setFeatures(features => features.filter(value => value !== "create:manager"))
                                                    }
                                                }}
                                                letterSpacing={0}>criar:gestores</Checkbox>
                                            <FormHelperText padding={"0.5rem 1rem"} lineHeight={"1.5rem"}>
                                                Permite que o usuário crie gestores no sistema.
                                                Para garantir o total benefício desta permissão, atribua também as
                                                permições de
                                                <Code lineHeight={"1.2rem"} rounded={"1rem"}>listar:gestores</Code> e
                                                <Code lineHeight={"1.2rem"}
                                                      rounded={"1rem"}>editar:gestor</Code>
                                            </FormHelperText>
                                        </FormControl>
                                        <FormControl>
                                            <Checkbox
                                                isChecked={hasFeatures("edit:manager")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFeatures(features => [...features, "edit:manager"])
                                                    } else {
                                                        setFeatures(features => features.filter(value => value !== "edit:manager"))
                                                    }
                                                }}
                                                letterSpacing={0}>editar:gestores</Checkbox>
                                            <FormHelperText padding={"0.5rem 1rem"} lineHeight={"1.5rem"}>
                                                Permite que o usuário edite gestores no sistema.
                                                Para garantir o total benefício desta permissão, atribua também as
                                                permições de
                                                <Code lineHeight={"1.2rem"} rounded={"1rem"}>listar:gestores</Code> e
                                                <Code lineHeight={"1.2rem"}
                                                      rounded={"1rem"}>editar:gestor</Code>
                                            </FormHelperText>
                                        </FormControl>
                                        <FormControl>
                                            <Checkbox
                                                isChecked={hasFeatures("delete:manager")}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFeatures(features => [...features, "delete:manager"])
                                                    } else {
                                                        setFeatures(features => features.filter(value => value !== "delete:manager"))
                                                    }
                                                }}
                                                letterSpacing={0}>apagar:gestores</Checkbox>
                                            <FormHelperText padding={"0.5rem 1rem"} lineHeight={"1.5rem"}>
                                                Permite que o usuário apague gestores no sistema.
                                                Para garantir o total benefício desta permissão, atribua também as
                                                permições de
                                                <Code lineHeight={"1.2rem"} rounded={"1rem"}>listar:gestores</Code>
                                            </FormHelperText>
                                        </FormControl>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>
                                <h3 className={"text-lg"}>Permissões de configurações</h3>
                            </CardHeader>
                            <CardBody>
                                <div className={"flex flex-col gap-2"}>
                                    <Checkbox
                                        isChecked={
                                            hasFeatures(...settingsFeatures)
                                        }
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFeatures(features => [...features, ...settingsFeatures])
                                            } else {
                                                setFeatures(features => features.filter((feature) => {
                                                    return !settingsFeatures.includes(feature)
                                                }))
                                            }
                                        }}
                                    >gerir:configurações</Checkbox>
                                    <div className={"flex flex-col gap-5 ps-6 text-xs"}>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        <Card colorScheme={"red"}>
                            <CardHeader>
                                <h3>Zona Perigosa</h3>
                            </CardHeader>
                            <CardBody padding={0}>
                                <Table width={"full"}>
                                    <Tbody>
                                        <Tr>
                                            <Td>
                                                Alterar o tipo de conta para Estudante, Pesquisador ou Estagiário
                                            </Td>
                                            <Td>
                                                <Button width={"full"} colorScheme={"red"} variant={"outline"}>
                                                    Alterar tipo de conta
                                                </Button>
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>
                                                Apaga a conta incluindo todos os dados associados a ela.
                                                Esta ação é irreversível.
                                            </Td>
                                            <Td>
                                                <Button width={"full"} colorScheme={"red"} variant={"outline"}>
                                                    Apagar conta
                                                </Button>
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>
                                                Impede que a conta seja usada.
                                            </Td>
                                            <Td>
                                                <Button width={"full"} colorScheme={"red"} variant={"outline"}>
                                                    Bloquear conta
                                                </Button>
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={handleUpdateUser}
                        isLoading={updateUserMutationResult.loading}
                        colorScheme={"teal"}
                    >Salvar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
