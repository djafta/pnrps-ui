"use client"

import {useCallback, useEffect, useState} from "react";
import {ResearchInvitation} from "@/models";
import {useMutation, useQuery} from "@apollo/client";
import {ACCEPT_RESEARCH_INVITATION, FIND_RESEARCH_INVITATION_BY_ID} from "@/apollo";
import {Button, Card, CardBody, Spinner} from "@chakra-ui/react";
import Image from "next/image";
import {useRouter} from "next/navigation";

export default function ResearchPrint({params}: { params: { invitation: string } }) {
    const [invitation, setInvitation] = useState<ResearchInvitation | null>(null)
    const getResearchInvitationQuery = useQuery(FIND_RESEARCH_INVITATION_BY_ID, {
        variables: {
            id: params.invitation
        }
    });
    const [acceptResearchInvitationMutation, acceptResearchInvitationMutationResult] = useMutation(ACCEPT_RESEARCH_INVITATION)
    const router = useRouter()

    useEffect(() => {

        if (getResearchInvitationQuery.data?.findInvitationById) {
            setInvitation(getResearchInvitationQuery.data.findInvitationById)
        }

    }, [getResearchInvitationQuery])

    const handleAcceptButtonClick = useCallback(async () => {
        await acceptResearchInvitationMutation({
            variables: {
                id: invitation?.id
            }
        })
        router.push(`/dashboard/management/researches/${invitation?.research?.id}`)
    }, [acceptResearchInvitationMutation, invitation, router])

    if (global.window && invitation) {
        if (invitation.status === "PENDING") {
            return (
                <div className={"fixed w-full h-full flex items-center justify-center"} suppressHydrationWarning>
                    <Card className={"shadow-2xl"}>
                        <CardBody>
                            <div className={"flex flex-col gap-10 items-end"}>
                                <Image className={"m-auto rounded-full shadow-xl"} width={100} height={100}
                                       src={"/ins-logo.png"} alt={"INS"}/>
                                <div>
                                    <h2 className={"text-2xl"}>Foi convidado para a pesquisa
                                        <span className={"font-bold"}> {invitation.research?.title}</span>
                                    </h2>
                                    <h3 className={"text-center mt-5"}>Convidado por
                                        <span> {invitation.research?.owner?.firstName} {invitation.research?.owner?.lastName}</span>
                                    </h3>
                                </div>
                                <Button
                                    isLoading={acceptResearchInvitationMutationResult.loading}
                                    onClick={handleAcceptButtonClick}
                                    colorScheme={"teal"}>Juntar-se a pesquisa</Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )
        } else if (invitation.status === "ACCEPTED") {
            router.push(`/dashboard/management/researches/${invitation?.research?.id}`)
        }
    }

    return (
        <div className={"fixed w-full h-full flex"}>
            <Spinner className={"m-auto"}/>
        </div>
    )
}
