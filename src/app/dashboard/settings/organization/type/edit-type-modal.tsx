import {useEffect, useState} from "react";

import {
    Button,
    Card,
    CardBody,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, Textarea,
    UseModalProps,
    useToast
} from "@chakra-ui/react";

import {OrganizationType} from "@/models";
import {useMutation} from "@apollo/client";
import {
    LIST_ORGANIZATION_TYPES_QUERY,
    UPDATE_ORGANIZATION_TYPE_MUTATION,
} from "@/apollo";

export interface EditTypeModalProps extends UseModalProps {
    readonly type?: OrganizationType
}

export function EditTypeModal({isOpen, onClose, type: organizationType}: EditTypeModalProps) {
    const toast = useToast();
    const [scopeData, setBodyData] = useState(organizationType);
    const [isInvalidBodyCode, setInvalidBodyCode] = useState(false);

    const [updateTypeMutation, updateTypeMutationResult] = useMutation(
        UPDATE_ORGANIZATION_TYPE_MUTATION,
        {
            refetchQueries: [LIST_ORGANIZATION_TYPES_QUERY]
        }
    )

    async function handleUpdateTypeClick() {

        console.log(scopeData)
        try {

            await updateTypeMutation({
                variables: {
                    input: {
                        name: scopeData?.name,
                        description: scopeData?.description,
                        id: organizationType?.id
                    }
                }
            })

            toast({
                title: "Tipo de Organização Atualizada!",
                description: `Toipo de Organização ${organizationType?.name} atualizada com sucesso.`,
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
        setBodyData(organizationType)
    }, [organizationType, isOpen])

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading size={"sm"}>Editar Tipo Organização</Heading>
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
                                                defaultValue={organizationType?.name}
                                                name={"name"}
                                                autoFocus={true}
                                                type={"text"}
                                            />
                                        </FormControl>
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
                                                defaultValue={organizationType?.description}
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
                        isLoading={updateTypeMutationResult.loading}
                        type={"submit"}
                        colorScheme={"teal"}
                        className={`float-right`}
                        onClick={handleUpdateTypeClick}
                    >
                        Gravar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
