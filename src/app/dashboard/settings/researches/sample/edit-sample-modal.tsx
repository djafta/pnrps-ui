import {useState} from "react";

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
    ModalOverlay,
    UseModalProps,
    useToast
} from "@chakra-ui/react";

import {ResearchSample} from "@/models";
import {useLazyQuery, useMutation} from "@apollo/client";
import {
    FIND_RESEARCH_SAMPLE_BY_CODE_QUERY,
    LIST_RESEARCH_SAMPLES_QUERY,
    UPDATE_RESEARCH_SAMPLE_MUTATION,
} from "@/apollo";

export interface EditSampleModalProps extends UseModalProps {
    readonly sample: ResearchSample
}

export function EditSampleModal({isOpen, onClose, sample}: EditSampleModalProps) {
    const toast = useToast();
    const [sampleData, setSampleData] = useState<ResearchSample>(sample);
    const [isInvalidSampleCode, setInvalidSampleCode] = useState(false);

    const [updateResearchSampleMutation, updateResearchSampleMutationResult] = useMutation(
        UPDATE_RESEARCH_SAMPLE_MUTATION,
        {
            refetchQueries: [LIST_RESEARCH_SAMPLES_QUERY]
        }
    )

    const [findResearchSampleByCodeQuery, findResearchSampleByCodeQueryResult] = useLazyQuery(
        FIND_RESEARCH_SAMPLE_BY_CODE_QUERY,
        {
            fetchPolicy: "no-cache"
        }
    )

    async function handleUpdateSampleClick() {

        try {
            if (sampleData?.code) {

                const {data} = await findResearchSampleByCodeQuery({
                    variables: {
                        code: sampleData?.code
                    }
                })

                console.log(sample, data)

                if (data.findResearchSampleByCode && data.findResearchSampleByCode?.id !== sample.id) {
                    return setInvalidSampleCode(true);
                } else {
                    setInvalidSampleCode(false);
                }
            }

            await updateResearchSampleMutation({
                variables: {
                    input: {
                        name: sampleData?.name,
                        code: sampleData?.code,
                        id: sample?.id
                    }
                }
            })

            toast({
                title: "Amostra Atualizada!",
                description: `Amostra ${sample?.name} atualizada com sucesso.`,
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
                    <Heading size={"sm"}>Editar Amostra de Pesquisa</Heading>
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
                                                    setSampleData({
                                                        ...sampleData,
                                                        name: e.target.value
                                                    })
                                                }}
                                                defaultValue={sample?.name}
                                                name={"name"}
                                                autoFocus={true}
                                                type={"text"}
                                            />
                                        </FormControl>
                                        <FormControl isRequired={true} isInvalid={isInvalidSampleCode}>
                                            <FormLabel>Código</FormLabel>
                                            <Input
                                                onChange={(e) => {
                                                    setSampleData({
                                                        ...sampleData,
                                                        code: e.target.value
                                                    })
                                                }}
                                                defaultValue={sample?.code}
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
                </ModalBody>
                <ModalFooter>
                    <Button
                        isLoading={
                            findResearchSampleByCodeQueryResult.loading
                            || updateResearchSampleMutationResult.loading
                        }
                        type={"submit"}
                        colorScheme={"teal"}
                        className={`float-right`}
                        onClick={handleUpdateSampleClick}
                    >
                        Gravar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
