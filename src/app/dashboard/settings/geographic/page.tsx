"use client"

import {CountrySettings} from "@/app/dashboard/settings/geographic/country/country-settings";

export default function GeographicSettings() {
    return (
        <main className={"pt-24 flex flex-col gap-10"}>
            <div className={"flex gap-4 flex-col"}>
                <div className={"flex p-2 w-full flex-col lg:flex-row gap-4"}>
                    <CountrySettings/>
                </div>
            </div>
        </main>
    )
}
