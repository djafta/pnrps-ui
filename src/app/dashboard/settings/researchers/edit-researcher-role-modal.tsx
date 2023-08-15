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

import {ResearcherRole} from "@/models";
import {useMutation} from "@apollo/client";
import {LIST_RESEARCHER_ROLES_QUERY, UPDATE_RESEARCHER_ROLE_MUTATION} from "@/apollo";

export interface EditResearcherRoleModalProps extends UseModalProps {
    readonly role: ResearcherRole
}

export function EditResearcherRoleModal({isOpen, onClose, role}: EditResearcherRoleModalProps) {
    const toast = useToast();
    const [researcherRoleData, setResearcherRoleData] = useState<ResearcherRole>(role);

    const [updateResearcherRoleMutation, updateResearcherRoleMutationResult] = useMutation(
        UPDATE_RESEARCHER_ROLE_MUTATION,
        {
            refetchQueries: [LIST_RESEARCHER_ROLES_QUERY]
        }
    )

    async function handleUpdateResearcherRoleClick() {

        try {
            await updateResearcherRoleMutation({
                variables: {
                    input: {
                        id: researcherRoleData.id,
                        name: researcherRoleData.name,
                        description: researcherRoleData.description
                    }
                }
            })
            toast({
                title: "Papel de Investigador Atualizado!",
                description: `Papel de Investigador ${role?.name} atualizado com sucesso.`,
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
                    <Heading size={"sm"}>Editar Papel de Investigador</Heading>
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
                                                    setResearcherRoleData({
                                                        ...researcherRoleData,
                                                        name: e.target.value
                                                    })
                                                }}
                                                defaultValue={role?.name}
                                                name={"name"}
                                                autoFocus={true}
                                                type={"text"}
                                            />
                                        </FormControl>
                                        <FormControl isRequired={true}>
                                            <FormLabel>Descriçaão</FormLabel>
                                            <Textarea
                                                onChange={(e) => {
                                                    setResearcherRoleData({
                                                        ...researcherRoleData,
                                                        description: e.target.value
                                                    })
                                                }}
                                                defaultValue={role?.description}
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
                        isLoading={updateResearcherRoleMutationResult.loading}
                        type={"submit"}
                        colorScheme={"teal"}
                        className={`float-right`}
                        onClick={handleUpdateResearcherRoleClick}
                    >
                        Gravar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
