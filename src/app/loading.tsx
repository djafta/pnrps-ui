"use client"
import {Spinner} from "@chakra-ui/react";
import {Suspense} from "react";

export default async function Loading() {
    return (
        <div className={"fixed w-full h-full flex items-center justify-center"}>
            <Suspense>
                <Spinner/>
            </Suspense>
        </div>
    )
}
