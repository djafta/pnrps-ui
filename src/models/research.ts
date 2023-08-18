import {User} from "@/models/user";

import {
    Collaboration,
    Country,
    Financing,
    Province,
    Region,
    ResearchApproval,
    ResearchClassification,
    ResearchField,
    ResearchFile,
    ResearchInvitation,
    ResearchScope,
    ResearchSubfield,
    ResearchSubtype,
    ResearchType
} from "@/models/other";


export interface Research {
    id?: string
    owner?: User
    files: ResearchFile[]
    code: string
    acronym: string
    title: string
    classification: ResearchClassification | undefined | null
    type: ResearchType | undefined | null
    subtype: ResearchSubtype | undefined | null
    field: ResearchField | undefined | null
    subfield: ResearchSubfield | undefined | null
    scope: ResearchScope | undefined | null
    otherScope: string | undefined
    startDate: string | undefined
    endDate: string | undefined
    country: Country | undefined
    region: Region | undefined
    province: Province | undefined
    countries: string | undefined
    invitations: ResearchInvitation[]
    collaborations: Collaboration[]
    financings: Financing[]
    approval: ResearchApproval
    visibility: "PRIVATE" | "PUBLIC"
    status: "AUTHORIZED" | "UNAUTHORIZED" | "DUPLICATE"
}
