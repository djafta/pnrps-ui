"use client"

import {BodySettings} from "@/app/dashboard/settings/organization/body/body-settings";
import {TypeSettings} from "@/app/dashboard/settings/organization/type/type-settings";

export default function OrganizationSettings() {
    return (
        <main className={"pt-24 flex flex-col gap-10"}>
            <div className={"flex gap-4 flex-col"}>
                <div className={"flex p-2 w-full flex-col gap-4"}>
                    <BodySettings/>
                    <TypeSettings/>
                </div>
            </div>
        </main>
    )
}
