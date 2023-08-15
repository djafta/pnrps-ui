import {FormEvent, useState} from "react";

import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Button,
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    IconButton,
    Input,
    Modal,
    ModalBody, ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    UseModalProps,
    useToast
} from "@chakra-ui/react";

import {ResearchClassification} from "@/models";
import {useLazyQuery, useMutation} from "@apollo/client";
import {
    CREATE_RESEARCH_TYPE_MUTATION,
    FIND_RESEARCH_CLASSIFICATION_BY_CODE,
    FIND_RESEARCH_TYPE_BY_CODE_QUERY,
    LIST_RESEARCH_CLASSIFICATIONS_QUERY,
    UPDATE_RESEARCH_CLASSIFICATION_MUTATION,
} from "@/apollo";
import {TypeItem} from "@/app/dashboard/settings/researches/classification/type-item";

export interface EditClassificationModalProps extends UseModalProps {
    readonly classification?: ResearchClassification
}

export function EditClassificationModal({isOpen, onClose, classification}: EditClassificationModalProps) {
    const toast = useToast();
    const [classificationData, setClassificationData] = useState<ResearchClassification>(classification as ResearchClassification);
    const [isInvalidTypeCode, setInvalidTypeCode] = useState(false);
    const [isInvalidClassificationCode, setInvalidClassificationCode] = useState(false);

    const [updateResearchClassificationMutation, updateResearchClassificationMutationResult] = useMutation(
        UPDATE_RESEARCH_CLASSIFICATION_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_CLASSIFICATIONS_QUERY]
        }
    )

    const [createResearchTypeMutation, createResearchTypeMutationResult] = useMutation(
        CREATE_RESEARCH_TYPE_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_CLASSIFICATIONS_QUERY]
        }
    )

    const [findResearchClassificationByCodeQuery, findResearchClassificationByCodeQueryResult] = useLazyQuery(
        FIND_RESEARCH_CLASSIFICATION_BY_CODE,
        {
            fetchPolicy: "no-cache"
        }
    )

    const [findResearchTypeByCodeQuery, findResearchTypeByCodeQueryResult] = useLazyQuery(
        FIND_RESEARCH_TYPE_BY_CODE_QUERY,
        {
            fetchPolicy: "no-cache"
        }
    )

    async function handleUpdateClassificationClick() {

        try {
            if (classificationData?.code) {

                const {data} = await findResearchClassificationByCodeQuery({
                    variables: {
                        code: classificationData?.code
                    }
                })

                if (data.findResearchClassificationByCode && data.findResearchClassificationByCode?.id !== classification?.id) {
                    return setInvalidClassificationCode(true);
                } else {
                    setInvalidClassificationCode(false);
                }
            }

            await updateResearchClassificationMutation({
                variables: {
                    input: {
                        name: classificationData?.name,
                        code: classificationData?.code,
                        id: classification?.id
                    }
                }
            })

            toast({
                title: "Classificação Atualizada!",
                description: `Classificação ${classification?.name} atualizada com sucesso.`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })
        } catch (e) {
            console.log(e)
        }
    }

    async function handleCreateTypeFormSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const name = data.get("name") as string;
        const code = data.get("code") as string;

        if (classification) {

            try {
                const {data} = await findResearchTypeByCodeQuery({
                    variables: {
                        code
                    }
                })

                if (data.findResearchTypeByCode) {
                    return setInvalidTypeCode(true);
                } else {
                    setInvalidTypeCode(false);
                }

                await createResearchTypeMutation({
                    variables: {
                        input: {
                            name,
                            code,
                            researchClassificationId: classification?.id
                        }
                    }
                })

                toast({
                    title: "Tipo Criado!",
                    description: `Tipo ${name} criado com sucesso.`,
                    status: "success",
                    isClosable: true,
                    position: "top",
                    colorScheme: "teal",
                })

                // Clear all form inputs after mutation
                target.querySelectorAll("input").forEach(input => input.value = "");

            } catch (e) {
                console.log(e)
            }
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"3xl"} scrollBehavior={"inside"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading size={"sm"}>Editar Classificação de Pesquisa</Heading>
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
                                                    setClassificationData({
                                                        ...classificationData,
                                                        name: e.target.value
                                                    })
                                                }}
                                                defaultValue={classification?.name}
                                                name={"name"}
                                                autoFocus={true}
                                                type={"text"}
                                            />
                                        </FormControl>
                                        <FormControl isRequired={true} isInvalid={isInvalidClassificationCode}>
                                            <FormLabel>Código</FormLabel>
                                            <Input
                                                onChange={(e) => {
                                                    setClassificationData({
                                                        ...classificationData,
                                                        code: e.target.value
                                                    })
                                                }}
                                                defaultValue={classification?.code}
                                                name={"code"}
                                                type={"text"}
                                            />
                                            <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                        </FormControl>
                                    </div>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                    <Card className={`${classification ? "flex" : "hidden"}`}>
                        <CardHeader>
                            <p>Tipos</p>
                        </CardHeader>
                        <CardBody>
                            <Accordion allowMultiple={true}>
                                {classification?.types?.map((type) => {
                                    return (
                                        <TypeItem key={type.id} type={type}/>
                                    )
                                })}
                            </Accordion>
                        </CardBody>
                    </Card>
                    <Card className={`${classification ? "flex" : "hidden"}`}>
                        <CardBody>
                            <Accordion allowToggle>
                                <AccordionItem border={"none"}>
                                    <AccordionButton className={"flex justify-between rounded-xl p-3"}>
                                        Adicionar Tipo
                                        <AccordionIcon/>
                                    </AccordionButton>
                                    <AccordionPanel>
                                        <form onSubmit={handleCreateTypeFormSubmit}>
                                            <div className={"flex flex-col gap-4"}>
                                                <div className={"flex gap-2 flex-col"}>
                                                    <FormControl isRequired={true}>
                                                        <FormLabel>Nome</FormLabel>
                                                        <Input name={"name"} autoFocus={true} type={"text"}/>
                                                    </FormControl>
                                                    <FormControl isRequired={true} isInvalid={isInvalidTypeCode}>
                                                        <FormLabel>Código</FormLabel>
                                                        <Input name={"code"} type={"text"}/>
                                                        <FormErrorMessage>O código já foi usado</FormErrorMessage>
                                                    </FormControl>
                                                </div>
                                                <Button
                                                    isLoading={
                                                        createResearchTypeMutationResult.loading
                                                        || findResearchTypeByCodeQueryResult.loading
                                                    }
                                                    type={"submit"}
                                                    colorScheme={"teal"}
                                                >
                                                    Adicionar
                                                </Button>
                                            </div>
                                        </form>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        </CardBody>
                    </Card>
                </ModalBody>
                <ModalFooter>
                    <Button
                        isLoading={
                            findResearchClassificationByCodeQueryResult.loading
                            || updateResearchClassificationMutationResult.loading
                        }
                        type={"submit"}
                        colorScheme={"teal"}
                        className={`float-right`}
                        onClick={handleUpdateClassificationClick}
                    >
                        Gravar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
