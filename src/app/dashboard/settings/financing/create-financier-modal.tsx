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
import {CREATE_FINANCIER_MUTATION, LIST_FINANCIERS_QUERY} from "@/apollo";


export function CreateFinancierModal({isOpen, onClose}: UseModalProps) {
    const toast = useToast();
    const [createFinancierMutation, createFinancierMutationResult] = useMutation(
        CREATE_FINANCIER_MUTATION,
        {
            refetchQueries: [LIST_FINANCIERS_QUERY]
        }
    )

    async function handleCreateFinancierFormSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const name = data.get("name") as string;
        const description = data.get("description") as string;

        try {
            const result = await createFinancierMutation({
                variables: {
                    input: {
                        name,
                        description
                    }
                }
            })

            toast({
                title: "Financiador adicionado",
                description: `Financiador ${name} adicionado com sucesso.`,
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
                    <Heading size={"sm"}>Adicionar Financiador</Heading>
                    <ModalCloseButton/>
                </ModalHeader>
                <ModalBody className={"flex flex-col gap-4"}>
                    <Card>
                        <CardBody>
                            <form onSubmit={handleCreateFinancierFormSubmit}>
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
                                        isLoading={createFinancierMutationResult.loading}
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
