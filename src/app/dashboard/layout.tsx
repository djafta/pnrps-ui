"use client";
import {Providers} from "@/app/providers";
import {PrivateHeader} from "@/components/header/private";
import React, {useEffect} from "react";
import {useAuth} from "@/hooks/auth";
import {useRouter} from "next/navigation";
import {Spinner} from "@chakra-ui/react";

export default function RootLayout({children,}: { children: React.ReactNode }) {
    const {user, loading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/?mode=signin", {
                query: {mode: 'signin'},
            });
        }
    }, [router, user, loading])

    if (user) {
        return (
            <>
                <PrivateHeader/>
                {children}
                <footer className={"w-full bottom-20 py-6"}>
                    <div className={"flex flex-col items-center"}>
                        <p>
                            © Copyright <a className={"text-blue-500"} href={""}>INS</a>. Todos direitos reservados
                        </p>
                        <p>
                            Desenvolvido pela <a className={"text-blue-500"} href={""}>Quidgest</a>
                        </p>
                    </div>
                </footer>
            </>
        )
    } else {
        return (
            <div className={"fixed w-full h-full left-0 top-0 flex items-center justify-center"}>
                <Spinner/>
            </div>
        )
    }
}
