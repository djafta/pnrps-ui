import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Checkbox,
    Code,
    FormControl, FormErrorMessage,
    FormHelperText,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    ModalProps, Tooltip, useToast,
} from "@chakra-ui/react";
import React, {FormEvent, useCallback, useEffect, useState} from "react";
import {User} from "@/models";
import {useMutation, useQuery} from "@apollo/client";
import {CREATE_USER_MUTATION, FIND_USER_BY_EMAIL_QUERY, LIST_USERS_QUERY} from "@/apollo";
import messages from "@/locales/messages.pt.json";

export function CreateUserModal({isOpen, onClose}: Omit<ModalProps, "children">) {
    const toast = useToast();
    const [invalidEmailError, setInvalidEmailError] = useState(true);
    const [isInvalid, setInvalid] = useState({
        email: false,
        firstName: false,
        lastName: false
    });

    const [user, setUser] = useState<User>({
        features: [] as string[]
    } as User)

    const [createUserMutation, createUserMutationResult] = useMutation(CREATE_USER_MUTATION, {
        refetchQueries: [LIST_USERS_QUERY],
    })

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

    async function handleAddUserClick() {
        if (validate()) {
            try {
                await createUserMutation({
                    variables: {
                        input: user
                    }
                })
                toast({
                    title: "Conta criada!",
                    description: "O utilizador receberá um e-mail de verificação na sua caixa de entrada.",
                    status: "success",
                    position: "top",
                    colorScheme: "blackAlpha",
                })
                setUser({
                    features: [] as string[]
                } as User)
                onClose()
            } catch (e) {
                console.log(e)
                setInvalidEmailError(true)
            }
        }
    }

    function validate() {
        const email = !user.email?.match(".@.")
        const firstName = !user.firstName?.length
        const lastName = !user.lastName?.length

        setInvalid({
            email,
            firstName,
            lastName
        })

        return !(email && firstName && lastName)
    }

    const setFeatures = useCallback((fn?: (data: string[]) => string[] | undefined) => {
        if (user && fn) {
            setUser({
                ...user,
                features: Array.from(new Set(fn(user.features) || []))
            })
        }
    }, [user])

    const hasFeatures = useCallback((...list: string[]) => {
        for (let feature of list) {
            if (!user?.features.includes(feature)) return false;
        }

        return true;
    }, [user])

    useEffect(() => {

        if (invalidEmailError) {
            setTimeout(() => setInvalidEmailError(false), 5 * 1000);
        }

    }, [invalidEmailError])

    return (
        <Modal size={"6xl"} isOpen={isOpen} onClose={onClose} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading fontWeight={"400"} size={"md"}>Criar Utilizador</Heading>
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
                                    <FormControl isRequired={true} isInvalid={isInvalid.firstName}>
                                        <FormLabel>Primeiro Nome</FormLabel>
                                        <Input
                                            onChange={(e) => {
                                                if (user) {
                                                    setUser({
                                                        ...user,
                                                        firstName: e.target.value
                                                    })
                                                    if (isInvalid.firstName) validate();
                                                }
                                            }}
                                            defaultValue={user?.firstName}
                                        />
                                        <FormErrorMessage>Primeiro nome é obrigatório</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isRequired={true} isInvalid={isInvalid.lastName}>
                                        <FormLabel>Último Nome</FormLabel>
                                        <Input
                                            onChange={(e) => {
                                                if (user) {
                                                    setUser({
                                                        ...user,
                                                        lastName: e.target.value
                                                    })
                                                    if (isInvalid.lastName) validate();
                                                }
                                            }}
                                            defaultValue={user?.lastName}
                                        />
                                        <FormErrorMessage>Último nome é obrigatório</FormErrorMessage>
                                    </FormControl>
                                    <Tooltip
                                        bg={"red.100"}
                                        label={"O endereço de email foi usado em outra conta"}
                                        padding={"1rem"}
                                        isOpen={invalidEmailError}
                                        hasArrow={true}
                                        textColor={"blackAlpha.600"}
                                    >
                                        <FormControl isRequired={true} isInvalid={invalidEmailError || isInvalid.email}>
                                            <FormLabel>Email</FormLabel>
                                            <Input
                                                onChange={(e) => {
                                                    if (user) {
                                                        setUser({
                                                            ...user,
                                                            email: e.target.value
                                                        })
                                                        if (isInvalid.email) validate();
                                                    }
                                                }}
                                                defaultValue={user?.email}
                                            />
                                            <FormErrorMessage>
                                                {
                                                    !invalidEmailError && "Endereço de email obrigatório"
                                                }
                                            </FormErrorMessage>
                                        </FormControl>
                                    </Tooltip>
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
                                                setFeatures(features => user?.features.filter((feature) => {
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
                                                    setFeatures(features => user?.features.filter((feature) => {
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
                                                setFeatures(features => user?.features.filter((feature) => {
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
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        isLoading={createUserMutationResult.loading}
                        onClick={handleAddUserClick}
                        colorScheme={"teal"}>Criar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
