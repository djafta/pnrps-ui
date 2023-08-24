import {
    Accordion, Button,
    Flex,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList
} from "@chakra-ui/react";

import messages from "@/locales/messages.pt.json";
import React, {useEffect, useState, MouseEvent, useCallback} from "react";

import {BiUser} from "react-icons/bi";

import {HamburgerIcon} from "@chakra-ui/icons";
import Link from "next/link";

import {Home} from "@/components/header/private/home";
import {Management} from "@/components/header/private/management";
import {Report} from "@/components/header/private/report";
import {Settings} from "@/components/header/private/settings";
import {Profile} from "@/components/header/private/profile";
import {useAuth} from "@/hooks/auth";
import {useMutation} from "@apollo/client";
import {SWITCH_TO_ADMIN, SWITCH_TO_RESEARCHER} from "@/apollo";
import {useRouter} from "next/navigation";

export function PrivateHeader() {
    const [expanded, setExpanded] = useState(false);
    const [switchToAdminMutation, switchToAdminMutationResult] = useMutation(SWITCH_TO_ADMIN);
    const [switchToResearcherMutation, switchToResearcherMutationResult] = useMutation(SWITCH_TO_RESEARCHER);
    const {isAuthorized} = useAuth();
    const router = useRouter();

    const switchToAdmin = useCallback(async () => {
        await switchToAdminMutation();
        router.push("/dashboard")
    }, [switchToAdminMutation, router])

    const switchToResearcher = useCallback(async () => {
        await switchToResearcherMutation();
        router.push("/dashboard")
    }, [switchToResearcherMutation, router])

    useEffect(() => {
        window.onclick = (e) => {
            setExpanded(false);
        }
    }, [setExpanded])

    function handleDockTogglerClick(e: MouseEvent) {
        e.stopPropagation();
        setExpanded(!expanded);
    }

    function handleDockClick(e: MouseEvent) {
        e.stopPropagation();
    }

    function handleMouseEnter() {
        setExpanded(true);
    }

    function handleMouseLeave() {
        setExpanded(false);
    }

    return (
        <>
            <header className={"fixed p-2 w-full flex justify-between z-[1000] bg-white shadow-md"}>
                <div className={""}>
                    <IconButton className={"flex justify-center"} onClick={handleDockTogglerClick} width={"full"}
                                rounded={"lg"}
                                colorScheme={"gray"} variant={"outline"} icon={<HamburgerIcon/>}
                                aria-label={"Toggle"}/>
                </div>
                <Flex justifyContent={"flex-end"}>
                    <Menu>
                        <MenuButton rounded={"full"} as={IconButton} aria-label={"Options"} icon={<BiUser/>}
                                    variant={"outline"}/>
                        <MenuList>
                            <MenuItem>
                                <Link className={"w-full h-full"} href={"/dashboard/profile"}>
                                    {messages.private.header.menu.items[0]}
                                </Link>
                            </MenuItem>

                            <MenuItem>
                                <Link className={"w-full h-full"} href={"/auth?mode=signout"}>
                                    {messages.private.header.menu.items[1]}
                                </Link>
                            </MenuItem>
                            <div className={"border-t flex flex-col gap-2 p-2"}>
                                {
                                    isAuthorized("switch:account") ?
                                        isAuthorized("create:research:self") ? (
                                            <Button
                                                onClick={switchToAdmin}
                                                isLoading={switchToAdminMutationResult.loading}
                                                className={"rounded-3xl"}
                                                colorScheme={"teal"}>Switch to Admin</Button>
                                        ) : (
                                            <Button
                                                onClick={switchToResearcher}
                                                isLoading={switchToResearcherMutationResult.loading}
                                                className={"rounded-3xl"}
                                                colorScheme={"teal"}>Switch to Researcher</Button>
                                        )
                                        : null
                                }
                            </div>
                        </MenuList>
                    </Menu>
                </Flex>
            </header>
            <div
                onClick={handleDockClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                id={"dock"}
                className={`${expanded ? "left-0" : "left-[-110%] lg:left-0 lg:max-w-[64px]"} max-w-[320px] fixed left-0 top-[70px] w-full h-[calc(100%-80px)] z-[1000] bg-white rounded-lg shadow-[0_0_10px_rgba(20,184,166,0.5)] flex justify-start border-e-red-500 transition-all overflow-hidden duration-500`}>
                <div className={"overflow-y-auto max-h-full w-full"}>
                    <div className={"flex flex-col min-w-[64px] w-full justify-start"}>
                        <Home/>
                        <Accordion allowMultiple={true}>
                            <Management expanded={expanded}/>
                            <Report expanded={expanded}/>
                            <Settings expanded={expanded}/>
                        </Accordion>
                        <Profile/>
                    </div>
                </div>
            </div>
        </>
    )
}
