import {FormEvent, useEffect, useState} from "react";

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
    ModalBody, ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, Select,
    Textarea,
    UseModalProps,
    useToast
} from "@chakra-ui/react";

import {Organization, OrganizationType} from "@/models";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {
    CREATE_ORGANIZATION_MUTATION,
    FIND_ORGANIZATION_BY_CODE_QUERY, LIST_ORGANIZATION_TYPES_QUERY,
    LIST_ORGANIZATIONS_QUERY
} from "@/apollo";


export function CreateBodyModal({isOpen, onClose}: UseModalProps) {
    const toast = useToast();
    const [isInvalidOrganizationCode, setInvalidOrganizationCode] = useState(false);
    const [organizationTypes, setOrganizationTypes] = useState<OrganizationType[]>([]);
    const [createResearchOrganizationMutation, createResearchOrganizationMutationResult] = useMutation(
        CREATE_ORGANIZATION_MUTATION,
        {
            refetchQueries: [LIST_ORGANIZATIONS_QUERY]
        }
    )

    const [findResearchOrganizationByCodeQuery, findResearchOrganizationByCodeQueryResult] = useLazyQuery(
        FIND_ORGANIZATION_BY_CODE_QUERY,
        {
            fetchPolicy: "no-cache"
        }
    )

    const listOrganizationTypesQuery = useQuery(LIST_ORGANIZATION_TYPES_QUERY);

    async function handleCreateOrganizationFormSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const name = data.get("name") as string;
        const code = data.get("code") as string;
        const typeId = data.get("type") as string;
        const description = data.get("description") as string;

        const type = organizationTypes.find(value => value.id === typeId)
        try {
            const {data} = await findResearchOrganizationByCodeQuery({
                variables: {
                    code
                }
            })

            if (data.findResearchOrganizationByCode) {
                return setInvalidOrganizationCode(true);
            } else {
                setInvalidOrganizationCode(false);
            }

            const result = await createResearchOrganizationMutation({
                variables: {
                    input: {
                        name,
                        code,
                        type: type?.id,
                        description
                    }
                }
            })

            toast({
                title: "Organização Criada!",
                description: `Organização ${name} criada com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })

            setTimeout(onClose, 1000)
        } catch (e) {
            console.log(e)
        }
    }

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
                    <Heading size={"sm"}>Criar Organização</Heading>
                    <ModalCloseButton/>
                </ModalHeader>
                <ModalBody className={"flex flex-col gap-4"}>
                    <Card>
                        <CardBody>
                            <form onSubmit={handleCreateOrganizationFormSubmit}>
                                <div className={"flex flex-col gap-4"}>
                                    <div className={"flex gap-2 flex-col"}>
                                        <FormControl isRequired={true}>
                                            <FormLabel>Nome</FormLabel>
                                            <Input name={"name"} autoFocus={true} type={"text"}/>
                                        </FormControl>
                                        <div className={"flex flex-col md:flex-row gap-2"}>
                                            <FormControl isRequired={true} isInvalid={isInvalidOrganizationCode}>
                                                <FormLabel>Código</FormLabel>
                                                <Input name={"code"} type={"text"}/>
                                                <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                            </FormControl>
                                            <FormControl isRequired={true}>
                                                <FormLabel>Tipo</FormLabel>
                                                <Select name={"type"}>
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
                                        <FormControl isRequired={true} isInvalid={isInvalidOrganizationCode}>
                                            <FormLabel>Descrição</FormLabel>
                                            <Textarea name={"description"} minHeight={"4rem"}/>
                                        </FormControl>
                                    </div>

                                    <Button
                                        isLoading={
                                            findResearchOrganizationByCodeQueryResult.loading
                                            || createResearchOrganizationMutationResult.loading
                                        }
                                        type={"submit"}
                                        colorScheme={"teal"}
                                    >
                                        Criar
                                    </Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </ModalBody>
                <ModalFooter>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
