import {FormEvent} from "react";

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
    ModalOverlay,
    Textarea,
    UseModalProps,
    useToast
} from "@chakra-ui/react";

import {useMutation} from "@apollo/client";
import {CREATE_FINANCING_TYPE_MUTATION, LIST_FINANCING_TYPES_QUERY} from "@/apollo";


export function CreateFinancingTypeModal({isOpen, onClose}: UseModalProps) {
    const toast = useToast();
    const [createFinancingTypeMutation, createFinancingTypeMutationResult] = useMutation(
        CREATE_FINANCING_TYPE_MUTATION,
        {
            refetchQueries: [LIST_FINANCING_TYPES_QUERY]
        }
    )

    async function handleCreateFinancingTypeFormSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const name = data.get("name") as string;
        const description = data.get("description") as string;

        try {
            const result = await createFinancingTypeMutation({
                variables: {
                    input: {
                        name,
                        description
                    }
                }
            })

            toast({
                title: "Tipo de financiamento adicionado",
                description: `Tipo de financiamento ${name} adicionado com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })

            target.querySelector("input")!.value = ""
            target.querySelector("textarea")!.value = ""
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading size={"sm"}>Adicionar Tipo de Financiamento</Heading>
                    <ModalCloseButton/>
                </ModalHeader>
                <ModalBody className={"flex flex-col gap-4"}>
                    <Card>
                        <CardBody>
                            <form onSubmit={handleCreateFinancingTypeFormSubmit}>
                                <div className={"flex flex-col gap-4"}>
                                    <div className={"flex gap-2 flex-col"}>
                                        <FormControl isRequired={true}>
                                            <FormLabel>Nome</FormLabel>
                                            <Input name={"name"} autoFocus={true} type={"text"}/>
                                        </FormControl>
                                        <FormControl isRequired={true}>
                                            <FormLabel>Descriçao</FormLabel>
                                            <Textarea name={"description"}/>
                                        </FormControl>
                                    </div>

                                    <Button
                                        isLoading={createFinancingTypeMutationResult.loading}
                                        type={"submit"}
                                        colorScheme={"teal"}
                                    >
                                        Adicionar
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
