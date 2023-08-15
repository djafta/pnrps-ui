"use client"

import {FinanciersSettings} from "@/app/dashboard/settings/financing/financiers-settings";
import {FinancingTypesSettings} from "@/app/dashboard/settings/financing/financing-types-settings";

export default function FinancingSettings() {

    return (
        <div className={"pt-24 flex flex-col gap-10"}>
            <div className={"flex gap-4 flex-col"}>
                <div className={"flex p-2 w-full flex-col gap-6"}>
                    <FinanciersSettings/>
                    <FinancingTypesSettings/>
                </div>
            </div>
        </div>
    )
}
