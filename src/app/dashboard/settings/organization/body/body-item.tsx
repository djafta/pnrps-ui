import React, {Dispatch, SetStateAction} from "react";

import {Box, Checkbox, Skeleton} from "@chakra-ui/react";

import {Organization} from "@/models";

export interface BodyItemProps {
    body: Organization
    loading: boolean
    selects: Organization[]
    setSelects: Dispatch<SetStateAction<Organization[]>>
}

export function BodyItem({body, loading, setSelects, selects}: BodyItemProps) {

    return (
        <Box key={body?.id} className={"border-b"}>
            <div className={"flex gap-1 items-center"}>
                <Skeleton maxHeight={"1rem"} isLoaded={!loading}>
                    <Checkbox
                        isChecked={selects.includes(body)}
                        onChange={() => {
                            if (selects.includes(body)) {
                                setSelects(selects.filter(selected => selected.id !== body.id))
                            } else {
                                setSelects(selects => [...selects, body])
                            }
                        }}
                    />
                </Skeleton>
                <Skeleton className={"w-full"} isLoaded={!loading}>
                    <div className={"flex w-full justify-between p-4  hover:bg-slate-100 cursor-pointer"}>
                        {body?.name}
                    </div>
                </Skeleton>
            </div>
        </Box>
    )
}