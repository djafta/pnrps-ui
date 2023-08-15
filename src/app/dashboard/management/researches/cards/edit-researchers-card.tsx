import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Input,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Select,
    Skeleton,
    Table,
    Tbody,
    Td,
    Thead,
    Tr,
    useToast
} from "@chakra-ui/react";

import {Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useState} from "react";
import {Collaboration, Research, Researcher, ResearcherRole, ResearchInvitation} from "@/models";
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {AddIcon, CloseIcon} from "@chakra-ui/icons";

import {
    DELETE_RESEARCH_COLLABORATION_MUTATION,
    GET_RESEARCH_INVITATIONS_QUERY,
    GET_RESEARCH_COLLABORATIONS_QUERY,
    LIST_RESEARCHER_ROLES_QUERY,
    LIST_RESEARCHES_BY_NAME,
    CREATE_RESEARCH_INVITATION_MUTATION, DELETE_RESEARCH_INVITATION_MUTATION
} from "@/apollo";
import {useDefault} from "@/hooks/default";

export interface ResearchersCardProps {
    readonly research: Research
    readonly setResearch: Dispatch<SetStateAction<Research>>
}

export function EditResearchersCard({research, setResearch}: ResearchersCardProps) {
    const toast = useToast();
    const [name, setName] = useState<string | undefined>("");

    const [deleteResearchCollaborationMutation, deleteResearchCollaborationMutationResult] = useMutation(
        DELETE_RESEARCH_COLLABORATION_MUTATION,
        {
            refetchQueries: [GET_RESEARCH_COLLABORATIONS_QUERY]
        }
    )
    const [createResearchInvitationMutation, createResearchInvitationMutationResult] = useMutation(
        CREATE_RESEARCH_INVITATION_MUTATION,
        {
            refetchQueries: [GET_RESEARCH_INVITATIONS_QUERY]
        }
    )
    const [deleteResearchInvitationMutation, deleteResearchInvitationMutationResult] = useMutation(
        DELETE_RESEARCH_INVITATION_MUTATION,
        {
            refetchQueries: [GET_RESEARCH_INVITATIONS_QUERY]
        }
    )

    const [listResearchersByNameQuery, {data}] = useLazyQuery(LIST_RESEARCHES_BY_NAME)
    const listResearcherRolesQuery = useQuery(LIST_RESEARCHER_ROLES_QUERY, {
        pollInterval: 1000 * 10 // 10 seconds
    });
    const [getResearchInvitationsQuery, getResearchInvitationsQueryResult] = useLazyQuery(GET_RESEARCH_INVITATIONS_QUERY, {
        pollInterval: 1000 * 10, // 10 seconds
    });
    const [getResearchCollaborationsQuery, getResearchCollaborationsQueryResult] = useLazyQuery(GET_RESEARCH_COLLABORATIONS_QUERY, {
        pollInterval: 1000 * 10, // 10 seconds
    });

    const [roles, setRoles] = useState<ResearcherRole[]>([])
    const [role, setRole] = useState<ResearcherRole | undefined | null>(null)
    const [researcher, setResearcher] = useState<Researcher | null>(null)
    const [suggestionsVisible, setSuggestionsVisible] = useState(false);
    const [invitations, setInvitations] = useState<ResearchInvitation[]>([])
    const [collaborations, setCollaborations] = useState<Collaboration[]>([])
    const {isDefault} = useDefault();

    const handleInviteResearcherSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (researcher && role) {
            await createResearchInvitationMutation({
                variables: {
                    input: {
                        researchId: research.id,
                        researcherRoleId: role.id,
                        userId: researcher.id
                    }
                }
            })
            toast({
                title: "Convite enviado!",
                description: `Um covinte foi enviado para "${researcher.email}"`,
                status: "success",
                isClosable: true,
                position: "top",
                colorScheme: "teal",
            })
            setResearcher(null)
            setName("")
            setSuggestionsVisible(false)
        }
    }, [researcher, role, createResearchInvitationMutation, research, toast])

    useEffect(() => {
        if (listResearcherRolesQuery.data?.listResearcherRoles) {
            setRoles(listResearcherRolesQuery.data.listResearcherRoles)
        }
        if (getResearchInvitationsQueryResult.data?.getResearchInvitations) {
            setInvitations(getResearchInvitationsQueryResult.data.getResearchInvitations)
        }
        if (getResearchCollaborationsQueryResult.data?.getResearchCollaborations) {
            setCollaborations(getResearchCollaborationsQueryResult.data.getResearchCollaborations)
        }
    }, [getResearchCollaborationsQueryResult, getResearchInvitationsQueryResult, listResearcherRolesQuery])

    useEffect(() => {
        if (roles.length) {
            setRole(roles[0])
        }
    }, [roles])

    useEffect(() => {
        if (research.id) {
            getResearchCollaborationsQuery({
                variables: {
                    id: research.id
                }
            })
            getResearchInvitationsQuery({
                variables: {
                    id: research.id
                }
            })
        }

    }, [getResearchCollaborationsQuery, getResearchInvitationsQuery, research])

    const handleNameChange = useCallback(async (e: FormEvent<HTMLInputElement>) => {
        const name = (e.target as HTMLInputElement).value
        setName(name)

        setSuggestionsVisible(!!name);

        await listResearchersByNameQuery({
            variables: {
                name
            }
        })
    }, [listResearchersByNameQuery])

    return (
        <Card>
            <CardHeader>
                <Heading size={"md"}>Investigadores</Heading>
            </CardHeader>
            <CardBody>
                <div className={"flex flex-col gap-4"}>
                    <div className={"flex flex-col gap-4 overflow-y-auto max-h-80"}>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Td>Função</Td>
                                    <Td>Pesquisador</Td>
                                    <Td></Td>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    collaborations?.map((collaboration) => {
                                        return (
                                            <Tr key={collaboration.id}>
                                                <Td>{collaboration.role.name}</Td>
                                                <Td>
                                                    <div className={"flex gap-1 items-center"}>
                                                        <p>
                                                            {collaboration.researcher.firstName} {collaboration.researcher.lastName}
                                                        </p>
                                                        <a
                                                            className={"text-xs py-1 px-2 rounded-3xl bg-teal-700 text-white"}
                                                            href={`mailto:${collaboration.researcher?.email}`}>
                                                            {collaboration.researcher?.email}
                                                        </a>
                                                    </div>
                                                </Td>
                                                <Td className={"flex justify-end px-1"}>
                                                    <IconButton
                                                        onClick={async () => {
                                                            await deleteResearchCollaborationMutation({
                                                                variables: {
                                                                    id: collaboration.id
                                                                }
                                                            })
                                                            toast({
                                                                title: "Investigador removido",
                                                                description: `Invetigador "${collaboration.researcher.firstName}" removido com sucesso.`,
                                                                status: "success",
                                                                isClosable: true,
                                                                position: "top",
                                                                colorScheme: "teal",
                                                            })
                                                        }}
                                                        isDisabled={isDefault(collaboration.role)}
                                                        isLoading={deleteResearchCollaborationMutationResult.loading}
                                                        size={"xs"}
                                                        variant={"unstyled"}
                                                        icon={<CloseIcon/>}
                                                        aria-label={""}
                                                    />
                                                </Td>
                                            </Tr>
                                        )
                                    })
                                }
                            </Tbody>
                        </Table>

                        <Heading size={"sm"}>Convintes</Heading>
                        <Table>
                            <Thead className={`${invitations.length ? "" : "hidden"}`}>
                                <Tr>
                                    <Td>Função</Td>
                                    <Td>Nome</Td>
                                    <Td>Estado</Td>
                                    <Td></Td>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    invitations?.map((invitation) => {
                                        return (
                                            <Tr key={invitation.researcher.id}>
                                                <Td>{invitation.role.name}</Td>
                                                <Td>
                                                    <div className={"flex gap-1 items-center"}>
                                                        <p>
                                                            {invitation.researcher.firstName} {invitation.researcher.lastName}
                                                        </p>
                                                        <a
                                                            className={"text-xs py-1 px-2 rounded-3xl bg-teal-700 text-white"}
                                                            href={`mailto:${invitation.researcher?.email}`}>
                                                            {invitation.researcher?.email}
                                                        </a>
                                                    </div>
                                                </Td>
                                                <Td>{invitation.status}</Td>
                                                <Td className={"flex justify-end px-1"}>
                                                    <IconButton
                                                        onClick={async () => {
                                                            await deleteResearchInvitationMutation({
                                                                variables: {
                                                                    id: invitation.id
                                                                }
                                                            })
                                                            toast({
                                                                title: "Covinte cancelado",
                                                                description: `O covinte para "${invitation.researcher.firstName}" foi cancelado com sucesso.`,
                                                                status: "success",
                                                                isClosable: true,
                                                                position: "top",
                                                                colorScheme: "teal",
                                                            })
                                                        }}
                                                        size={"xs"}
                                                        variant={"unstyled"}
                                                        icon={<CloseIcon/>}
                                                        aria-label={""}
                                                    />
                                                </Td>
                                            </Tr>
                                        )
                                    })
                                }
                            </Tbody>
                        </Table>
                        <div className={"flex gap-2 justify-end"}>
                            <Popover placement={"left-start"}>
                                <PopoverTrigger>
                                    <IconButton colorScheme={"teal"} variant={"outline"}
                                                icon={<AddIcon/>} aria-label={""}/>
                                </PopoverTrigger>
                                <PopoverContent className={"sm:w-[500px] lg:w-[600px]"}>
                                    <PopoverArrow/>
                                    <PopoverCloseButton/>
                                    <PopoverHeader>Convidar Investigador</PopoverHeader>
                                    <PopoverBody>
                                        <form
                                            className={"w-full grid gap-2 grid-rows-3"}
                                            onSubmit={handleInviteResearcherSubmit}
                                            autoComplete={"off"}
                                        >
                                            <FormControl isRequired={true}>
                                                <FormLabel>Nome</FormLabel>
                                                <Input
                                                    onChange={handleNameChange}
                                                    value={name}
                                                    type={"text"}
                                                />
                                                <Box
                                                    className={`w-full mt-[2px] absolute overflow-hidden overflow-y-auto h-40 bg-white shadow 
                                                    z-10 ${suggestionsVisible ? "flex" : "hidden"}`}>
                                                    <div className={"flex flex-col w-full"}>
                                                        {
                                                            data?.listResearchersByName?.filter((r: any) => !invitations.find((invitation => r.id === invitation.researcher.id)))
                                                                .map((researcher: Researcher) => {
                                                                    return (
                                                                        <div
                                                                            onClick={() => {
                                                                                setName(`${researcher.firstName} ${researcher.lastName}`)
                                                                                setResearcher(researcher)
                                                                                setSuggestionsVisible(false);
                                                                            }}
                                                                            className={"p-3 flex items-center gap-2 cursor-pointer hover:bg-slate-200 w-full"}
                                                                            key={researcher.id}
                                                                        >
                                                                            <span>{researcher.firstName} {researcher.lastName}</span>
                                                                            <span
                                                                                className={"rounded-full text-white bg-teal-600 px-2 py-1 text-xs"}>{researcher.email}</span>
                                                                        </div>
                                                                    )
                                                                })
                                                        }
                                                    </div>
                                                </Box>
                                            </FormControl>
                                            <FormControl isRequired={true}>
                                                <FormLabel>Tipo</FormLabel>
                                                <Skeleton isLoaded={!!roles.length}>
                                                    <Select
                                                        onChange={(e) => {
                                                            setRole(roles.find(role => role.id === e.target.value))
                                                        }}
                                                        name={"type"}>
                                                        {
                                                            roles.map((role => {
                                                                return (
                                                                    <option key={role.id}>{role.name}</option>
                                                                )
                                                            }))
                                                        }
                                                    </Select>
                                                </Skeleton>
                                            </FormControl>
                                            <Button
                                                isLoading={createResearchInvitationMutationResult.loading}
                                                type={"submit"}
                                                colorScheme={"teal"}
                                            >Convidar</Button>
                                        </form>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}