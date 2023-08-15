import React, {Dispatch, SetStateAction} from "react";

import {Box, Checkbox, Skeleton} from "@chakra-ui/react";

import {ResearchSample} from "@/models";

export interface ScopeItemProps {
    sample: ResearchSample
    loading: boolean
    selects: ResearchSample[]
    setSelects: Dispatch<SetStateAction<ResearchSample[]>>
}

export function SampleItem({sample, loading, setSelects, selects}: ScopeItemProps) {

    return (
        <Box key={sample?.id} className={"border-b"}>
            <div className={"flex gap-1 items-center"}>
                <Skeleton maxHeight={"1rem"} isLoaded={!loading}>
                    <Checkbox
                        isChecked={selects.includes(sample)}
                        onChange={() => {
                            if (selects.includes(sample)) {
                                setSelects(selects.filter(selected => selected.id !== sample.id))
                            } else {
                                setSelects(selects => [...selects, sample])
                            }
                        }}
                    />
                </Skeleton>
                <Skeleton className={"w-full"} isLoaded={!loading}>
                    <div className={"flex w-full justify-between p-4  hover:bg-slate-100 cursor-pointer"}>
                        {sample?.name}
                    </div>
                </Skeleton>
            </div>
        </Box>
    )
}