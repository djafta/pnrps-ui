"use client";

import {Spinner} from "@chakra-ui/react";
import {useCallback, useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useMutation} from "@apollo/client";
import {CONFIRM_ACCOUNT_MUTATION, CONFIRM_SIGNIN_MUTATION} from "@/apollo";

export default function Page() {
    const [isInvalidToken, setInvalidToken] = useState(false);
    const router = useRouter()
    const params = useSearchParams()
    const [confirmAccountMutation] = useMutation(CONFIRM_ACCOUNT_MUTATION)
    const [confirmSigninMutation] = useMutation(CONFIRM_SIGNIN_MUTATION)

    const confirmAccount = useCallback(async (token: string) => {
        try {

            window.localStorage.setItem("authorization", token)

            const {data} = await confirmAccountMutation({
                variables: {
                    token
                }
            })

            if (data?.confirmAccount) {
                window.localStorage.setItem("authorization", data.confirmAccount)
                window.parent.postMessage("/dashboard")
            } else {
                setInvalidToken(true)
            }
        } catch (e) {
            window.parent.postMessage("/?mode=signin")
        }
    }, [confirmAccountMutation])

    const confirmSignin = useCallback(async (token: string) => {

        try {
            window.localStorage.setItem("authorization", token)

            const {data} = await confirmSigninMutation({
                variables: {
                    token
                }
            })

            if (data?.confirmSignin) {
                window.localStorage.setItem("authorization", data.confirmSignin)
                window.parent.postMessage("dashboard")
            } else {
                setInvalidToken(true)
            }
        } catch (e) {
            window.parent.postMessage("/?mode=signin")
        }
    }, [confirmSigninMutation])

    useEffect(() => {
        const mode = params.get("mode")
        const token = params.get("token")

        if (!token) {
            setInvalidToken(true)
        } else {
            switch (mode) {
                case "confirm":
                    confirmAccount(token)
                    break
                case "signin":
                    confirmSignin(token)
                    break
                case "signout":
                    try {
                        window.localStorage.removeItem("authorization")
                        window.parent.postMessage("/")
                    } catch (e) {
                        window.parent.postMessage("/?mode=signin")
                    }
                    break
            }
        }
    }, [params, confirmAccount, confirmSignin, router])

    return (
        <main className={"fixed w-full h-full left-0 top-0 flex items-center justify-center"}>
            {
                isInvalidToken ?
                    <p>Link inválido</p>
                    : <Spinner/>
            }
        </main>
    )
}
