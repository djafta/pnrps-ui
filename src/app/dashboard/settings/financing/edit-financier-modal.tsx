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

import {Financier} from "@/models";
import {useMutation} from "@apollo/client";
import {LIST_FINANCIERS_QUERY, UPDATE_FINANCIER_MUTATION} from "@/apollo";

export interface EditFinancierModalProps extends UseModalProps {
    readonly financier: Financier
}

export function EditFinancierModal({isOpen, onClose, financier}: EditFinancierModalProps) {
    const toast = useToast();
    const [financierData, setFinancierData] = useState<Financier>(financier);

    const [updateFinancierMutation, updateFinancierMutationResult] = useMutation(
        UPDATE_FINANCIER_MUTATION,
        {
            refetchQueries: [LIST_FINANCIERS_QUERY]
        }
    )

    async function handleUpdateFinancierClick() {

        try {
            await updateFinancierMutation({
                variables: {
                    input: {
                        id: financierData.id,
                        name: financierData.name,
                        description: financierData.description
                    }
                }
            })
            toast({
                title: "Financiador Atualizado!",
                description: `Financiador ${financier.name} atualizado com sucesso.`,
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
                    <Heading size={"sm"}>Editar Financiador</Heading>
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
                                                    setFinancierData({
                                                        ...financierData,
                                                        name: e.target.value
                                                    })
                                                }}
                                                defaultValue={financier.name}
                                                name={"name"}
                                                autoFocus={true}
                                                type={"text"}
                                            />
                                        </FormControl>
                                        <FormControl isRequired={true}>
                                            <FormLabel>Descriçaão</FormLabel>
                                            <Textarea
                                                onChange={(e) => {
                                                    setFinancierData({
                                                        ...financierData,
                                                        description: e.target.value
                                                    })
                                                }}
                                                defaultValue={financier.description}
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
                        isLoading={updateFinancierMutationResult.loading}
                        type={"submit"}
                        colorScheme={"teal"}
                        className={`float-right`}
                        onClick={handleUpdateFinancierClick}
                    >
                        Gravar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
