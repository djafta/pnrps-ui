import {FormEvent, useEffect, useState} from "react";
import {BiUser} from "react-icons/bi";
import messages from "@/locales/messages.pt.json";
import Image from "next/image";

import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    Flex,
    FormControl,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Switch,
    Tooltip,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";

import {useRouter, useSearchParams} from "next/navigation";

import {useMutation} from "@apollo/client";
import {AUTH_WITH_EMAIL_MUTATION, CREATE_USER_SELF_MUTATION} from "@/apollo";

export function PublicHeader() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [action, setAction] = useState<"signing-in" | "signing-up" | null>("signing-in");

    const params = useSearchParams()

    useEffect(() => {
        const mode = params.get("mode")
        if (mode === "signin") {
            setAction("signing-in")
            onOpen()
        }
    }, [onOpen, params])

    function handleItemClick(action: "signing-in" | "signing-up") {
        setAction(action);
        onOpen();
    }

    return (
        <header className={"fixed w-full p-2 flex justify-between z-[1000] bg-white shadow-md"}>
            <div className={"w-full flex"}>
                <Image width={40} height={40} src={"/icon-header.png"} alt={"INS logo"}/>
            </div>
            <Flex justifyContent={"flex-end"}>
                <Menu>
                    <MenuButton rounded={"full"} as={IconButton} aria-label={"Options"} icon={<BiUser/>}
                                variant={"outline"}/>
                    <MenuList>
                        <MenuItem onClick={() => handleItemClick("signing-in")}>
                            {messages.public.header.menu.items[0]}
                        </MenuItem>
                        <MenuItem onClick={() => handleItemClick("signing-up")}>
                            {messages.public.header.menu.items[1]}
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
            <Drawer onClose={onClose} isOpen={isOpen} size={"full"}>
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerCloseButton zIndex={100}/>
                    <DrawerBody className={"flex flex-col w-full h-full justify-center p-0"}>
                        {action == "signing-in" ? <Signin/> : <Signup/>}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </header>
    )
}

function Signin() {
    const toast = useToast();
    const [authWithEmailMutation, authWithEmailMutationResult] = useMutation(AUTH_WITH_EMAIL_MUTATION);
    const [emailNotFoundErrorVisible, setEmailNotFoundErrorVisible] = useState(false);

    async function handleLoginFormSubmit(e: FormEvent) {
        e.preventDefault();
        const data = new FormData(e.target as HTMLFormElement);
        const email = String(data.get("email")).toLowerCase();

        try {
            await authWithEmailMutation({
                variables: {
                    email
                }
            })
            toast({
                title: "Pedido recebido!",
                description: "Seu pedido de autenticação foi recebido. Porfavor verifique a sua caixa de entrada para prosseguir.",
                status: "success",
                position: "top",
                colorScheme: "blackAlpha",
            })
        } catch (e) {
            setEmailNotFoundErrorVisible(true)
        }
    }

    useEffect(() => {

        if (emailNotFoundErrorVisible) {
            setTimeout(() => setEmailNotFoundErrorVisible(false), 5 * 1000);
        }

    }, [emailNotFoundErrorVisible])

    return (
        <div
            className={"w-full h-full flex lg:justify-end justify-center bg-[url('/background.png')] bg-cover bg-no-repeat lg:bg-none"}>
            <div
                className={"bg-white h-full flex-1 hidden lg:flex bg-[url('/background.png')] bg-cover"}>
            </div>
            <div
                className={"h-full flex-col justify-between flex-1 max-w-lg flex pt-10 shadow-2xl m-auto bg-white rounded-3xl max-h-[500px] lg:max-h-none"}>
                <div className={"p-4 font-bold text-3xl text-teal-600 hidden lg:flex"}>
                    <h1>{messages.public.header.signin.title}</h1>
                </div>
                <div className={"flex items-center h-full"}>
                    <div className={"w-full"}>
                        <div className={"w-full flex justify-center"}>
                            <Image width={100} height={100} src={"/icon-header.png"} alt={"INS logo"}/>
                        </div>
                        <form onSubmit={handleLoginFormSubmit}>
                            <div>
                                <div className={"p-4 flex flex-col gap-10"}>
                                    <div className={"flex flex-col gap-8"}>
                                        <Tooltip
                                            bg={"red.100"}
                                            label={messages.public.header.signin.form.notfound}
                                            padding={"1rem"}
                                            isOpen={emailNotFoundErrorVisible}
                                            hasArrow={true}
                                            textColor={"blackAlpha.600"}
                                        >
                                            <FormControl isRequired={true}>
                                                <Input
                                                    placeholder={messages.public.header.signin.form.email.placeholder}
                                                    type={"email"}
                                                    name={"email"}
                                                    autoFocus={true}
                                                />
                                            </FormControl>
                                        </Tooltip>
                                        <Switch
                                            colorScheme={"teal"}
                                            className={"flex items-center"}
                                            name={"remember"}
                                        >{messages.public.header.signin.form.remember}</Switch>
                                    </div>
                                    <Button
                                        isLoading={authWithEmailMutationResult.loading}
                                        variant={"outline"}
                                        colorScheme={"teal"}
                                        type={"submit"}
                                        loadingText={messages.public.header.signin.form.submitting}
                                    >{messages.public.header.signin.form.submit}</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}


function Signup() {
    const toast = useToast();
    const [invalidEmailError, setInvalidEmailError] = useState(false);
    const [createUserSelfMutation, createUserSelfMutationResult] = useMutation(CREATE_USER_SELF_MUTATION)

    async function handleSignupFormSubmit(e: FormEvent) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const email = String(data.get("email")).toLowerCase();
        const firstName = data.get("firstName");
        const lastName = data.get("lastName");

        try {
            await createUserSelfMutation({
                variables: {
                    input: {
                        firstName,
                        lastName,
                        email
                    }
                }
            })

            target.querySelectorAll("input").forEach(input => input.value = "")

            toast({
                title: "Conta criada!",
                description: "Sua conta foi criada. Porfavor verifique a sua caixa de entrada para prosseguir.",
                status: "success",
                position: "top",
                colorScheme: "blackAlpha",
            })
        } catch (e) {
            setInvalidEmailError(true)
        }
    }

    useEffect(() => {
        window.localStorage.removeItem("authorization")

        if (invalidEmailError) {
            setTimeout(() => setInvalidEmailError(false), 5 * 1000);
        }

    }, [invalidEmailError])


    return (
        <div
            className={"w-full h-full flex lg:justify-end justify-center bg-[url('/background.png')] bg-cover bg-no-repeat lg:bg-none"}>
            <div
                className={"bg-white h-full flex-1 hidden lg:flex bg-[url('/background.png')] bg-cover"}>
            </div>
            <div
                className={"h-full flex-col justify-between flex-1 max-w-lg flex pt-10 shadow-2xl m-auto bg-white rounded-3xl max-h-[500px] lg:max-h-none"}>
                <div className={"p-4 font-bold text-3xl text-teal-600 hidden lg:flex"}>
                    <h1>{messages.public.header.signup.title}</h1>
                </div>
                <div className={"flex items-center h-full"}>
                    <div className={"w-full"}>
                        <div className={"w-full flex justify-center"}>
                            <Image width={100} height={100} src={"/icon-header.png"} alt={"INS logo"}/>
                        </div>
                        <form onSubmit={handleSignupFormSubmit}>
                            <div>
                                <div className={"p-4 flex flex-col gap-10"}>
                                    <Tooltip
                                        bg={"red.100"}
                                        label={messages.public.header.signup.form.invalid}
                                        padding={"1rem"}
                                        isOpen={invalidEmailError}
                                        hasArrow={true}
                                        textColor={"blackAlpha.600"}
                                    >
                                        <div className={"flex flex-col gap-8"}>
                                            <div className={"flex gap-4"}>
                                                <FormControl isRequired={true}>
                                                    <Input
                                                        placeholder={messages.public.header.signup.form.firstname.placeholder}
                                                        type={"text"}
                                                        name={"firstName"}
                                                    />
                                                </FormControl>
                                                <FormControl isRequired={true}>
                                                    <Input
                                                        placeholder={messages.public.header.signup.form.lastname.placeholder}
                                                        type={"text"}
                                                        name={"lastName"}
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormControl isRequired={true}>
                                                <Input
                                                    placeholder={messages.public.header.signup.form.email.placeholder}
                                                    type={"email"}
                                                    name={"email"}
                                                />
                                            </FormControl>
                                        </div>
                                    </Tooltip>
                                    <Button
                                        isLoading={createUserSelfMutationResult.loading}
                                        variant={"outline"}
                                        colorScheme={"teal"}
                                        type={"submit"}
                                        loadingText={messages.public.header.signup.form.submitting}
                                    >
                                        {messages.public.header.signup.form.submit}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}