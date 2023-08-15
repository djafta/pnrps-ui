import React, {Dispatch, SetStateAction} from "react";

import {Box, Checkbox, Skeleton} from "@chakra-ui/react";

import {ResearchDocument} from "@/models";

export interface DocumentItemProps {
    document: ResearchDocument
    loading: boolean
    selects: ResearchDocument[]
    setSelects: Dispatch<SetStateAction<ResearchDocument[]>>
}

export function DocumentItem({document, loading, setSelects, selects}: DocumentItemProps) {

    return (
        <Box key={document?.id} className={"border-b"}>
            <div className={"flex gap-1 items-center"}>
                <Skeleton maxHeight={"1rem"} isLoaded={!loading}>
                    <Checkbox
                        isChecked={selects.includes(document)}
                        onChange={() => {
                            if (selects.includes(document)) {
                                setSelects(selects.filter(selected => selected.id !== document.id))
                            } else {
                                setSelects(selects => [...selects, document])
                            }
                        }}
                    />
                </Skeleton>
                <Skeleton className={"w-full"} isLoaded={!loading}>
                    <div className={"flex w-full justify-between p-4  hover:bg-slate-100 cursor-pointer"}>
                        {document?.name}
                    </div>
                </Skeleton>
            </div>
        </Box>
    )
}