"use client"

import {
    Card,
    CardBody,
    CardHeader,
    Heading,
    Skeleton,
} from "@chakra-ui/react";

import {AiOutlineSearch} from "react-icons/ai";

import {ClassificationSettings} from "@/app/dashboard/settings/researches/classification/classification-settings";
import {SampleSettings} from "@/app/dashboard/settings/researches/sample/sample-settings";
import {FieldSettings} from "@/app/dashboard/settings/researches/field/field-settings";
import {ScopeSettings} from "@/app/dashboard/settings/researches/scope/scope-settings";
import {DocumentSettings} from "@/app/dashboard/settings/researches/document/document-settings";

export default function ResearchSettings() {

    return (
        <div className={"pt-24 flex flex-col gap-10"}>
            <div className={"flex gap-4 flex-col"}>
                <div className={"flex p-2 w-full flex-col gap-6"}>
                    <FieldSettings/>
                    <ClassificationSettings/>
                    <SampleSettings/>
                    <ScopeSettings/>
                    <DocumentSettings/>
                </div>
                <div className={"flex p-2 w-full flex-col gap-4"}>
                </div>
            </div>
        </div>
    )
}
