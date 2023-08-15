import {useAuth} from "@/hooks/auth";
import {AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, IconButton} from "@chakra-ui/react";
import Link from "next/link";
import {IoSettingsOutline} from "react-icons/io5";
import {AiOutlineSearch} from "react-icons/ai";
import {CiMap} from "react-icons/ci";
import {SlOrganization} from "react-icons/sl";
import React from "react";

export interface SettingsProps {
    readonly expanded: boolean
}

export function Settings({expanded}: SettingsProps) {
    const {isAuthorized} = useAuth();

    if (isAuthorized(
        "read:research_settings",
        "delete:research_settings",
        "create:research_settings",
        "edit:research_settings",
        "read:geographic_data",
        "delete:geographic_data",
        "create:geographic_data",
        "edit:geographic_data",
        "read:organization",
        "delete:organization",
        "create:organization",
        "edit:organization",
        "read:financing_type",
        "delete:financing_type",
        "create:financing_type",
        "edit:financing_type"
    )) {
        return (
            <AccordionItem>
                <div className={"relative flex overflow-hidden items-center w-full hover:bg-slate-200"}>
                    <Link href={"/dashboard/settings"}
                          className={"flex items-center py-2 w-full gap-6 hover:bg-slate-200 whitespace-nowrap"}
                    >
                        <IconButton className={"flex min-w-[64px] justify-center"}
                                    aria-label={"Options"}
                                    icon={<IoSettingsOutline/>}
                                    variant={"unstyled"}/>
                        <span className={"flex items-center justify-between w-full pe-2"}>
                                        Definições
                                    </span>
                    </Link>
                    <AccordionButton className={"w-fit h-fit rounded-full me-2"}>
                        <AccordionIcon/>
                    </AccordionButton>
                </div>
                <AccordionPanel
                    className={`${expanded ? "block" : "hidden"} p-0 bg-slate-400 text-white`}>
                    {
                        isAuthorized("read:research_settings", "delete:research_settings", "create:research_settings", "edit:research_settings") ?
                            <Link href={"/dashboard/settings/researches"}
                                  className={"flex items-center py-2 ps-6 gap-6 hover:bg-slate-200 overflow-hidden whitespace-nowrap"}>
                                <IconButton className={"flex min-w-[64px] justify-center"}
                                            aria-label={"Options"}
                                            icon={<AiOutlineSearch/>}
                                            variant={"unstyled"}
                                />
                                Pesquisas
                            </Link>
                            : null
                    }
                    {
                        isAuthorized("read:geographic_data", "delete:geographic_data", "create:geographic_data", "edit:geographic_data") ?
                            <Link href={"/dashboard/settings/geographic"}
                                  className={"flex items-center py-2 ps-6 gap-6 hover:bg-slate-200 overflow-hidden whitespace-nowrap"}>
                                <IconButton className={"flex min-w-[64px] justify-center"}
                                            aria-label={"Options"}
                                            icon={<CiMap/>} variant={"unstyled"}/>
                                Geográficas
                            </Link>
                            : null
                    }
                    {
                        isAuthorized("read:organization", "delete:organization", "create:organization", "edit:organization") ?
                            <Link href={"/dashboard/settings/organization"}
                                  className={"flex items-center py-2 ps-6 gap-6 hover:bg-slate-200 overflow-hidden whitespace-nowrap"}>
                                <IconButton className={"flex min-w-[64px] justify-center"}
                                            aria-label={"Options"}
                                            icon={<SlOrganization/>} variant={"unstyled"}/>
                                Organizações
                            </Link>
                            : null
                    }
                    {
                        isAuthorized("read:financing_type", "delete:financing_type", "create:financing_type", "edit:financing_type") ?
                            <Link href={"/dashboard/settings/financing"}
                                  className={"flex items-center py-2 ps-6 gap-6 hover:bg-slate-200 overflow-hidden whitespace-nowrap"}>
                                <IconButton className={"flex min-w-[64px] justify-center"}
                                            aria-label={"Options"}
                                            icon={<FinancingIcon/>} variant={"unstyled"}/>
                                Finanças
                            </Link>
                            : null
                    }
                    {
                        isAuthorized("read:researcher_settings", "delete:researcher_settings", "create:researcher_settings", "edit:researcher_settings") ?
                            <Link href={"/dashboard/settings/researchers"}
                                  className={"flex items-center py-2 ps-6 gap-6 hover:bg-slate-200 overflow-hidden whitespace-nowrap"}>
                                <IconButton className={"flex min-w-[64px] justify-center"}
                                            aria-label={"Options"}
                                            icon={<ResearchersIcon/>} variant={"unstyled"}/>
                                Investigadores
                            </Link>
                            : null
                    }
                </AccordionPanel>
            </AccordionItem>
        )
    }

    return null
}

function FinancingIcon() {

    return (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" aria-hidden="true"
             focusable="false" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" stroke="#fff" strokeWidth="1"
                  d="M16,16 C16,14.8954305 12.8659932,14 9,14 C5.13400675,14 2,14.8954305 2,16 C2,17.1045695 5.13400675,18 9,18 C12.8659932,18 16,17.1045695 16,16 Z M2,16 L2,20.9367547 C2,22.0762536 5.13400675,23 9,23 C12.8659932,23 16,22.0762537 16,20.9367548 L16,16 M9,5 C4.581722,5 1,5.8954305 1,7 C1,8.1045695 4.581722,9 9,9 M1,7 L1,12.0000002 C1,13.0128881 4.581722,14 9,14 M23,4 C23,2.8954305 19.9004329,2 16.0769231,2 C12.2534133,2 9.15384615,2.8954305 9.15384615,4 C9.15384615,5.1045695 12.2534133,6 16.0769231,6 C19.9004329,6 23,5.1045695 23,4 Z M16,16 C19.8235098,16 23.0000002,15.0128879 23.0000002,14 L23,4 M9.15384615,3.99999999 L9.15384615,14.1660042 M8.99999999,9.00000001 C8.99999999,10.0128879 12.2534135,11 16.0769233,11 C19.9004331,11 23.0000004,10.0128879 23.0000004,9.00000001"></path>
        </svg>
    )
}

function ResearchersIcon() {

    return (
        <svg fill="#fff" height="1em" width="1em" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 475.851 475.851" xmlSpace="preserve">
            <g>
                <g>
                    <g>
                        <path d="M151.549,145.274c0,23.39,9.145,50.385,24.462,72.214c17.389,24.78,39.376,38.427,61.911,38.427
				c22.534,0,44.521-13.647,61.91-38.428c15.317-21.828,24.462-48.824,24.462-72.213c0-47.626-38.746-86.372-86.372-86.372
				C190.296,58.902,151.549,97.648,151.549,145.274z M237.922,73.902c39.354,0,71.372,32.018,71.372,71.372
				c0,20.118-8.33,44.487-21.74,63.598c-14.29,20.364-32.38,32.043-49.632,32.043c-17.252,0-35.342-11.679-49.632-32.043
				c-13.41-19.11-21.741-43.479-21.741-63.598C166.549,105.919,198.567,73.902,237.922,73.902z"/>
                        <path d="M302.372,239.167c-2.862-1.363-6.273-0.778-8.52,1.461c-16.775,16.728-36.117,25.569-55.935,25.569
				c-19.821,0-39.158-8.841-55.923-25.567c-2.246-2.241-5.659-2.826-8.521-1.463c-25.254,12.022-46.628,30.829-61.811,54.388
				c-15.596,24.2-23.84,52.277-23.84,81.195v0.121c0,2.116,0.894,4.134,2.461,5.556c40.492,36.722,92.922,56.945,147.633,56.945
				s107.141-20.224,147.632-56.945c1.568-1.422,2.462-3.439,2.462-5.556v-0.121c0-28.918-8.242-56.995-23.834-81.194
				C348.997,269.995,327.625,251.188,302.372,239.167z M237.918,422.372c-49.861,0-97.685-18.023-135.057-50.827
				c0.583-24.896,7.956-48.986,21.411-69.865c12.741-19.77,30.322-35.823,51.058-46.676c18.746,17.157,40.285,26.193,62.588,26.193
				c22.3,0,43.842-9.035,62.598-26.193c20.734,10.853,38.313,26.906,51.053,46.676c13.452,20.877,20.823,44.968,21.406,69.865
				C335.602,404.349,287.778,422.372,237.918,422.372z"/>
                        <path d="M455.077,243.89c-13.23-20.532-31.856-36.923-53.864-47.399c-2.862-1.363-6.275-0.778-8.52,1.461
				c-14.312,14.271-30.79,21.815-47.654,21.815c-9.142,0-18.184-2.205-26.873-6.553c-3.706-1.853-8.209-0.353-10.063,3.351
				c-1.854,3.705-0.354,8.21,3.351,10.063c10.793,5.401,22.093,8.139,33.586,8.139c19.335,0,38.004-7.737,54.288-22.437
				c17.504,9.298,32.348,22.934,43.141,39.685c11.445,17.763,17.756,38.243,18.338,59.416
				c-18.524,16.158-40.553,28.449-63.91,35.634c-3.959,1.218-6.182,5.415-4.964,9.374c0.992,3.225,3.96,5.297,7.166,5.297
				c0.73,0,1.474-0.107,2.208-0.333c26.509-8.154,51.435-22.362,72.082-41.088c1.568-1.422,2.462-3.439,2.462-5.556v-0.105
				C475.85,289.45,468.666,264.98,455.077,243.89z"/>
                        <path d="M130.493,210.473c7.93,0,15.841-1.934,23.516-5.748c3.709-1.843,5.222-6.345,3.379-10.054
				c-1.843-3.71-6.345-5.222-10.054-3.379c-5.582,2.774-11.248,4.18-16.841,4.18c-14.541,0-29.836-9.914-41.964-27.2
				c-11.449-16.318-18.562-37.112-18.562-54.266c0-33.375,27.152-60.527,60.526-60.527c15.752,0,30.67,6.022,42.006,16.958
				c2.98,2.875,7.729,2.792,10.604-0.19c2.876-2.981,2.791-7.729-0.19-10.604c-14.146-13.647-32.763-21.163-52.42-21.163
				c-41.646,0-75.526,33.881-75.526,75.527c0,20.38,7.957,43.887,21.283,62.881C91.445,198.545,110.709,210.473,130.493,210.473z"/>
                        <path d="M61.034,340.143c-16.753-7.222-32.209-16.972-45.989-29.004c0.582-21.112,6.875-41.53,18.291-59.243
				c10.761-16.698,25.561-30.294,43.01-39.566c16.239,14.662,34.856,22.376,54.139,22.376c11.587,0,22.969-2.785,33.829-8.277
				c3.696-1.87,5.177-6.381,3.308-10.078c-1.869-3.697-6.381-5.177-10.078-3.308c-8.742,4.421-17.846,6.663-27.059,6.663
				c-16.811,0-33.238-7.522-47.504-21.754c-2.246-2.24-5.658-2.825-8.521-1.462c-21.954,10.451-40.534,26.8-53.733,47.28
				C7.167,264.811,0,289.221,0,314.362v0.103c0,2.116,0.894,4.134,2.461,5.556c15.629,14.174,33.338,25.579,52.634,33.897
				c0.968,0.417,1.975,0.615,2.966,0.615c2.904,0,5.668-1.697,6.891-4.533C66.591,346.196,64.837,341.783,61.034,340.143z"/>
                        <path d="M69.854,351.003c-2.671,6.443,4.532,12.832,10.617,9.387c3.238-1.834,4.683-5.937,3.227-9.385
				C81.291,344.86,72.32,345.053,69.854,351.003z"/>
                        <path d="M83.698,351.005C83.888,351.455,83.518,350.545,83.698,351.005L83.698,351.005z"/>
                        <path d="M303.345,70.438c11.336-10.936,26.254-16.958,42.006-16.958c33.374,0,60.526,27.152,60.526,60.527
				c0,17.154-7.112,37.947-18.563,54.266c-12.128,17.286-27.424,27.2-41.964,27.2c-5.593,0-11.259-1.406-16.841-4.18
				c-3.711-1.844-8.212-0.331-10.055,3.379c-1.843,3.709-0.33,8.21,3.379,10.054c7.675,3.814,15.587,5.748,23.517,5.748
				c19.783,0,39.048-11.927,54.243-33.585c13.327-18.994,21.283-42.501,21.283-62.881c0-41.646-33.881-75.527-75.526-75.527
				c-19.657,0-38.273,7.516-52.42,21.163c-2.981,2.875-3.066,7.624-0.19,10.604C295.614,73.229,300.363,73.314,303.345,70.438z"/>
                    </g>
                </g>
            </g>
        </svg>
    )
}