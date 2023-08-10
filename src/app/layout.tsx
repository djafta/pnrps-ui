"use client";
import {ReactNode} from "react";

// styles
import './globals.css'

// fonts
import {Inter} from 'next/font/google'

// providers
import {ApolloProvider} from "@apollo/client";
import {AuthProvider} from "@/context/authorization";
import {Providers} from "@/app/providers";

// clients
import {client} from "@/apollo/client";

const inter = Inter({subsets: ['latin']})

export default function RootLayout({children,}: { children: ReactNode }) {

    return (
        <html lang="en">
        <body className={inter.className}>
        <ApolloProvider client={client}>
            <Providers>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </Providers>
        </ApolloProvider>
        </body>
        </html>
    )
}
