"use client"

import {ResearcherSettings} from "@/app/dashboard/settings/researchers/researcher-settings";

export default function FinancingSettings() {

    return (
        <div className={"pt-24 flex flex-col gap-10"}>
            <div className={"flex gap-4 flex-col"}>
                <div className={"flex p-2 w-full flex-col gap-6"}>
                    <ResearcherSettings/>
                </div>
            </div>
        </div>
    )
}
