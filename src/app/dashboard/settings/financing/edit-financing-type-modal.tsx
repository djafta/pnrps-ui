import {useState} from "react";

import {
    Button,
    Card,
    CardBody,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalBody, ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay, Textarea,
    UseModalProps,
    useToast
} from "@chakra-ui/react";

import {FinancingType} from "@/models";
import {useMutation} from "@apollo/client";
import {LIST_FINANCING_TYPES_QUERY, UPDATE_FINANCING_TYPE_MUTATION} from "@/apollo";

export interface EditFinancingTypeModalProps extends UseModalProps {
    readonly financingType: FinancingType
}

export function EditFinancingTypeModal({isOpen, onClose, financingType}: EditFinancingTypeModalProps) {
    const toast = useToast();
    const [financingTypeData, setFinancingTypeData] = useState<FinancingType>(financingType);

    const [updateFinancingTypeMutation, updateFinancingTypeMutationResult] = useMutation(
        UPDATE_FINANCING_TYPE_MUTATION,
        {
            refetchQueries: [LIST_FINANCING_TYPES_QUERY]
        }
    )

    async function handleUpdateFinancingTypeClick() {

        try {
            await updateFinancingTypeMutation({
                variables: {
                    input: {
                        id: financingTypeData.id,
                        name: financingTypeData.name,
                        description: financingTypeData.description
                    }
                }
            })
            toast({
                title: "Tipo de Financiamento Atualizado!",
                description: `Tipo de Financiamento ${financingType.name} atualizado com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading size={"sm"}>Editar Tipo de Financiamento</Heading>
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
                                                    setFinancingTypeData({
                                                        ...financingTypeData,
                                                        name: e.target.value
                                                    })
                                                }}
                                                defaultValue={financingType.name}
                                                name={"name"}
                                                autoFocus={true}
                                                type={"text"}
                                            />
                                        </FormControl>
                                        <FormControl isRequired={true}>
                                            <FormLabel>Descriçaão</FormLabel>
                                            <Textarea
                                                onChange={(e) => {
                                                    setFinancingTypeData({
                                                        ...financingTypeData,
                                                        description: e.target.value
                                                    })
                                                }}
                                                defaultValue={financingType.description}
                                                name={"description"}
                                            />
                                        </FormControl>
                                    </div>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </ModalBody>
                <ModalFooter>
                    <Button
                        isLoading={updateFinancingTypeMutationResult.loading}
                        type={"submit"}
                        colorScheme={"teal"}
                        className={`float-right`}
                        onClick={handleUpdateFinancingTypeClick}
                    >
                        Gravar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
