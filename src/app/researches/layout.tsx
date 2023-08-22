"use client";
import React, {ReactNode} from "react";


// clients
import {PublicHeader} from "@/components/header";

export default function RootLayout({children,}: { children: ReactNode }) {

    return (
        <>
            <PublicHeader/>
            {children}
        </>
    )
}
