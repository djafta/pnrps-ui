"use client";


export default function RootLayout({children,}: { children: React.ReactNode }) {

    return (
        <main className={"gradient-1 min-h-screen"}>
            <div className={"lg:ps-16"}>
                {children}
            </div>
        </main>
    )
}
