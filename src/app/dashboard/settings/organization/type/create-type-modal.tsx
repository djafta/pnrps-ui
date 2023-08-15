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
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
    UseModalProps,
    useToast
} from "@chakra-ui/react";

import {useMutation} from "@apollo/client";
import {CREATE_ORGANIZATION_TYPE_MUTATION, LIST_ORGANIZATION_TYPES_QUERY} from "@/apollo";


export function CreateTypeModal({isOpen, onClose}: UseModalProps) {
    const toast = useToast();

    const [createResearchOrganizationTypeMutation, createResearchOrganizationTypeMutationResult] = useMutation(
        CREATE_ORGANIZATION_TYPE_MUTATION,
        {
            refetchQueries: [LIST_ORGANIZATION_TYPES_QUERY]
        }
    )

    async function handleCreateOrganizationTypeFormSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const name = data.get("name") as string;
        const description = data.get("description") as string;

        try {
            const result = await createResearchOrganizationTypeMutation({
                variables: {
                    input: {
                        name,
                        description
                    }
                }
            })

            toast({
                title: "Tipo de Organização Criada!",
                description: `Tipo de Organização ${name} criada com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })

            target.querySelectorAll("input").forEach(input => input.value = "")
            setTimeout(onClose, 1000)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading size={"sm"}>Criar Tipo Organização</Heading>
                </ModalHeader>
                <ModalBody className={"flex flex-col gap-4"}>
                    <Card>
                        <CardBody>
                            <form onSubmit={handleCreateOrganizationTypeFormSubmit}>
                                <div className={"flex flex-col gap-4"}>
                                    <div className={"flex gap-2 flex-col"}>
                                        <FormControl isRequired={true}>
                                            <FormLabel>Nome</FormLabel>
                                            <Input name={"name"} autoFocus={true} type={"text"}/>
                                        </FormControl>
                                        <FormControl isRequired={true}>
                                            <FormLabel>Descrição</FormLabel>
                                            <Textarea name={"description"} minHeight={"4rem"}/>
                                        </FormControl>
                                    </div>

                                    <Button
                                        isLoading={createResearchOrganizationTypeMutationResult.loading}
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
