import React, {Dispatch, SetStateAction} from "react";

import {Box, Checkbox, Skeleton} from "@chakra-ui/react";

import {ResearchScope} from "@/models";

export interface ScopeItemProps {
    scope: ResearchScope
    loading: boolean
    selects: ResearchScope[]
    setSelects: Dispatch<SetStateAction<ResearchScope[]>>
}

export function ScopeItem({scope, loading, setSelects, selects}: ScopeItemProps) {

    return (
        <Box key={scope?.id} className={"border-b"}>
            <div className={"flex gap-1 items-center"}>
                <Skeleton maxHeight={"1rem"} isLoaded={!loading}>
                    <Checkbox
                        isChecked={selects.includes(scope)}
                        onChange={() => {
                            if (selects.includes(scope)) {
                                setSelects(selects.filter(selected => selected.id !== scope.id))
                            } else {
                                setSelects(selects => [...selects, scope])
                            }
                        }}
                    />
                </Skeleton>
                <Skeleton className={"w-full"} isLoaded={!loading}>
                    <div className={"flex w-full justify-between p-4  hover:bg-slate-100 cursor-pointer"}>
                        {scope?.name}
                    </div>
                </Skeleton>
            </div>
        </Box>
    )
}