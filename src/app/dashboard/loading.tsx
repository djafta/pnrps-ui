"use client"
import {Spinner} from "@chakra-ui/react";
import {Suspense} from "react";

export default function Loading() {
    return (
        <div className={"fixed w-full h-full flex items-center justify-center bg-white"}>
            <Suspense>
                <Spinner/>
            </Suspense>
        </div>
    )
}
