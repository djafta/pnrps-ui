import {useEffect, useState} from "react";

import {
    Button,
    Card,
    CardBody,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, Select, Textarea,
    UseModalProps,
    useToast
} from "@chakra-ui/react";

import {Organization, OrganizationType} from "@/models";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {
    FIND_ORGANIZATION_BY_CODE_QUERY, LIST_ORGANIZATION_TYPES_QUERY,
    LIST_ORGANIZATIONS_QUERY,
    UPDATE_ORGANIZATION_MUTATION,
} from "@/apollo";

export interface EditBodyModalProps extends UseModalProps {
    readonly body?: Organization
}

export function EditBodyModal({isOpen, onClose, body: organization}: EditBodyModalProps) {
    const toast = useToast();
    const [scopeData, setBodyData] = useState(organization);
    const [isInvalidBodyCode, setInvalidBodyCode] = useState(false);
    const [organizationTypes, setOrganizationTypes] = useState<OrganizationType[]>([]);
    const listOrganizationTypesQuery = useQuery(LIST_ORGANIZATION_TYPES_QUERY);

    const [updateBodyMutation, updateBodyMutationResult] = useMutation(
        UPDATE_ORGANIZATION_MUTATION,
        {
            refetchQueries: [LIST_ORGANIZATIONS_QUERY]
        }
    )

    const [findBodyByCodeQuery, findBodyByCodeQueryResult] = useLazyQuery(
        FIND_ORGANIZATION_BY_CODE_QUERY,
        {
            fetchPolicy: "no-cache"
        }
    )

    async function handleUpdateBodyClick() {

        console.log(scopeData)
        try {
            if (scopeData?.code) {

                const {data} = await findBodyByCodeQuery({
                    variables: {
                        code: scopeData?.code
                    }
                })

                if (data.findBodyByCode && data.findBodyByCode?.id !== organization?.id) {
                    return setInvalidBodyCode(true);
                } else {
                    setInvalidBodyCode(false);
                }
            }

            await updateBodyMutation({
                variables: {
                    input: {
                        name: scopeData?.name,
                        code: scopeData?.code,
                        description: scopeData?.description,
                        id: organization?.id
                    }
                }
            })

            toast({
                title: "Organização Atualizada!",
                description: `Organização ${organization?.name} atualizada com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        setBodyData(organization)
    }, [organization, isOpen])

    useEffect(() => {
        if (listOrganizationTypesQuery.data?.listOrganizationTypes) {
            setOrganizationTypes(listOrganizationTypesQuery.data.listOrganizationTypes)
        }
    }, [listOrganizationTypesQuery])

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading size={"sm"}>Editar Organização</Heading>
                    <ModalCloseButton/>
                </ModalHeader>
                <ModalBody className={"flex flex-col gap-4"}>
                    <Card>
                        <CardBody>
                            <form>
                                <div className={"flex flex-col gap-4"}>
                                    <div className={"flex gap-2 flex-col"}>
                                        <FormControl isRequired={true}>
                                            <FormLabel>Nome</FormLabel>
                                            <Input
                                                onChange={(e) => {
                                                    if (scopeData) {
                                                        setBodyData({
                                                            ...scopeData,
                                                            name: e.target.value
                                                        })
                                                    }
                                                }}
                                                defaultValue={organization?.name}
                                                name={"name"}
                                                autoFocus={true}
                                                type={"text"}
                                            />
                                        </FormControl>
                                        <div className={"flex flex-col md:flex-row gap-2"}>
                                            <FormControl isRequired={true} isInvalid={isInvalidBodyCode}>
                                                <FormLabel>Código</FormLabel>
                                                <Input
                                                    onChange={(e) => {
                                                        if (scopeData) {
                                                            setBodyData({
                                                                ...scopeData,
                                                                code: e.target.value
                                                            })
                                                        }
                                                    }}
                                                    defaultValue={organization?.code}
                                                    name={"code"}
                                                    type={"text"}
                                                />
                                                <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                            </FormControl>
                                            <FormControl isRequired={true}>
                                                <FormLabel>Tipo</FormLabel>
                                                <Select defaultValue={organization?.type.id} name={"type"}>
                                                    {
                                                        organizationTypes.map(type => {
                                                            return (
                                                                <option
                                                                    key={type.id}
                                                                    value={type.id}>
                                                                    {type.name}
                                                                </option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <FormControl isRequired={true} isInvalid={isInvalidBodyCode}>
                                            <FormLabel>Descrição</FormLabel>
                                            <Textarea
                                                onChange={(e) => {
                                                    if (scopeData) {
                                                        setBodyData({
                                                            ...scopeData,
                                                            description: e.target.value
                                                        })
                                                    }
                                                }}
                                                name={"description"}
                                                defaultValue={organization?.description}
                                                minHeight={"4rem"}/>
                                        </FormControl>
                                    </div>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </ModalBody>
                <ModalFooter>
                    <Button
                        isLoading={
                            findBodyByCodeQueryResult.loading
                            || updateBodyMutationResult.loading
                        }
                        type={"submit"}
                        colorScheme={"teal"}
                        className={`float-right`}
                        onClick={handleUpdateBodyClick}
                    >
                        Gravar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
