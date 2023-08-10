"use client";

import './globals.css'
import {Inter} from 'next/font/google'
import {AuthProvider} from "@/context/authorization";
import {ApolloProvider} from "@apollo/client";
import {Providers} from "@/app/providers";
import {client} from "@/apollo/client";

const inter = Inter({subsets: ['latin']})

export default function RootLayout({children,}: { children: React.ReactNode }) {

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
