"use client"

import {
    Card,
    CardBody,
    CardHeader,
    Checkbox,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Input,
    Skeleton,
    Tooltip, useDisclosure,
} from "@chakra-ui/react";

import {AiOutlineSearch} from "react-icons/ai";
import {AddIcon, DeleteIcon} from "@chakra-ui/icons";
import {useEffect, useState} from "react";
import {User} from "@/models";
import {useQuery} from "@apollo/client";
import {LIST_USERS_QUERY} from "@/apollo";
import {EditUserModal} from "@/app/dashboard/management/users/edit-user-modal";
import {CreateUserModal} from "@/app/dashboard/management/users/create-user-modal";

export default function UsersManagement() {
    const editUserModalDisclosure = useDisclosure();
    const createUserModalDisclosure = useDisclosure();
    const [users, setUsers] = useState<User[]>([]);

    const listUsersQuery = useQuery(LIST_USERS_QUERY, {
        fetchPolicy: "no-cache",
        pollInterval: 1000 * 10 // 10 seconds
    })

    const [selects, setSelects] = useState<User[]>([]);
    const [search, setSearch] = useState("");

    const [isUserDeleteLoading, setUserDeleteLoading] = useState(false);
    const filteredList: User[] = users.filter(({firstName, lastName}) => {
        return String(`${firstName} ${lastName}`).toLowerCase().includes(search.toLowerCase())
    });


    function handleUsersDeleteClick() {
        setUserDeleteLoading(true)

        setTimeout(() => {
            setUserDeleteLoading(false)
        }, 3000)
    }

    useEffect(() => {
        if (listUsersQuery.data?.listUsers) {
            setUsers(listUsersQuery.data.listUsers)
        }

    }, [listUsersQuery])

    return (
        <main className={"w-full min-h-[90vh] pt-24 flex flex-col gap-10 gradient-1 lg:ps-16"}>
            <EditUserModal
                id={selects[0]?.id}
                isOpen={editUserModalDisclosure.isOpen}
                onClose={editUserModalDisclosure.onClose}
            />
            <CreateUserModal
                isOpen={createUserModalDisclosure.isOpen}
                onClose={createUserModalDisclosure.onClose}
            />
            <div className={"flex gap-4 flex-col"}>
                <div className={"flex p-2 w-full flex-col lg:flex-row gap-4"}>
                    <Card width={"full"} overflow={"hidden"}>
                        <CardHeader className={"bg-bar text-white px-2 py-1"}>
                            <div className={"flex justify-between items-center"}>
                                <div className={"flex flex-col gap-2"}>
                                    <Heading className={"font-medium flex-grow"} size={"sm"}>Utilizadores</Heading>
                                    <FormControl className={"ps-3"}>
                                        <Checkbox isChecked={users.length != 0 && selects.length === users.length}
                                                  onChange={(e) => {
                                                      if (e.target.checked) setSelects(users);
                                                      else setSelects([]);
                                                  }}/>
                                    </FormControl>
                                </div>
                                <FormControl
                                    className={"flex max-w-[20rem] items-center my-auto rounded-lg bg-transparent focus-within:bg-white overflow-hidden transition-colors"}>
                                    <Input variant={"unstyled"} onChange={(e) => {
                                    }}
                                           className={"p-2 min-w-0 text-gray-500 appearance-none outline-none bg-transparent"}
                                           type={"text"}/>
                                    <Tooltip placement={"auto-end"} label={"Clique para procurar áreas de pesquisa"}>
                                        <FormLabel className={"h-full"}>
                                            <AiOutlineSearch className={"text-lg mt-2 fill-gray-400"}/>
                                        </FormLabel>
                                    </Tooltip>
                                </FormControl>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className={"w-full flex"}>
                                <div className={"flex w-full gap-4 flex-col"}>
                                    <div>
                                        <div>
                                            {
                                                (search.length > 0 ? filteredList : users).map((user) => {
                                                    return (
                                                        <div key={user.id}>
                                                            <div
                                                                className={"flex items-center w-full gap-2 hover:bg-slate-100 p-3 cursor-pointer rounded-xl"}>
                                                                <Skeleton maxHeight={"1rem"}
                                                                          isLoaded={!listUsersQuery.loading}>
                                                                    <Checkbox
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        isChecked={selects.includes(user)}
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setSelects(users => [...users, user])
                                                                            } else {
                                                                                setSelects(selects.filter(f => f.id != user.id))
                                                                            }
                                                                        }}/>
                                                                </Skeleton>
                                                                <Tooltip label={"Clique para ver mais"}
                                                                         placement={"auto"} hasArrow={true}>
                                                                    <div
                                                                        className={"grid grid-cols-2 text-start w-full"}
                                                                        onClick={() => {
                                                                            setSelects([user])
                                                                            editUserModalDisclosure.onOpen()
                                                                        }}
                                                                    >
                                                                        <div>
                                                                            {user.firstName} {user.lastName}
                                                                        </div>
                                                                        <div
                                                                            className={"overflow-hidden overflow-ellipsis text-white px-2 rounded-xl"}>
                                                                            <span
                                                                                className={"rounded-xl bg-gray-400 overflow-hidden py-1 px-2 text-white whitespace-nowrap text-sm"}>
                                                                                {user.email.toLowerCase()}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div
                                        className={"flex items-center justify-between flex-row-reverse gap-2 transition-all"}>
                                        <div className={"flex flex-row-reverse gap-2 transition-all"}>
                                            <IconButton
                                                colorScheme={"teal"}
                                                onClick={createUserModalDisclosure.onOpen}
                                                aria-label={""}
                                                icon={<AddIcon/>}/>
                                            <IconButton
                                                colorScheme={"teal"}
                                                onClick={handleUsersDeleteClick}
                                                isLoading={isUserDeleteLoading}
                                                className={`${selects.length > 0 ? "visible" : "invisible"}`}
                                                aria-label={""} icon={<DeleteIcon/>}/>
                                        </div>
                                        <p className={`text-gray-400 text-sm ${selects.length > 0 ? "block" : "hidden"}`}>{selects.length} items
                                            selecionados</p>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </main>
    )
}
