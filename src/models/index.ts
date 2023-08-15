import {User} from "./user";
import {Research} from "./research";

export type {
    User,
    Research
}

export interface ResearchSubfield {
    id: string
    name: string;
    code: string
}

export interface ResearchField {
    id: string
    code: string
    name: string;
    subfields?: ResearchSubfield[];
}

export interface Researcher {
    id: string
    firstName: string
    lastName: string
    email: string
    features: string[]
}

export interface CoResearcher extends Researcher {
    role: ResearcherRole
}

export interface ResearchClassification {
    id: string
    name: string
    code: string
    types?: ResearchType[]
}

export interface ResearchType {
    id: string
    name: string
    code: string
    subtypes?: ResearchSubtype[]
}

export interface ResearchSubtype {
    id: string
    name: string
    code: string
}

export interface ResearchSample {
    id: string
    name: string
    code: string
}

export interface ResearchScope {
    id: string
    name: string
    code: string
    description: string
}

export interface ResearchDocument {
    id: string
    name: string
    code: string
}

export interface Country {
    id: string
    name: string
    code: string
    regions: Region[]
}

export interface Region {
    id: string
    name: string
    code: string
    provinces: Province[]
}

export interface Province {
    id: string
    name: string
    code: string
}

export interface Organization {
    id: string
    name: string
    code: string
    type: OrganizationType
    description: string
}

export interface OrganizationType {
    id: string
    name: string
    description: string
}

export interface ResearchFile {
    id?: string
    name: string
    data: string
    mime: string
    createdAt: Date
    type: ResearchDocument
}

export interface ResearcherRole {
    id: string
    name: string
    description: string
}

export interface Financier {
    id: string
    name: string
    description: string
}

export interface FinancingType {
    id: string
    name: string
    description: string
}

export interface Financing {
    id?: string
    amount: number
    financier: Financier
    type?: FinancingType
}

export interface Collaboration {
    id?: string
    role: ResearcherRole
    researcher: Researcher
}

export interface ResearchInvitation {
    id?: string
    role: ResearcherRole
    status?: string
    researcher: Researcher
    research?: Research
}

export interface ApprovalFile {
    id?: string
    name: string
    data: string
    mime: string
}

export interface ResearchApproval {
    id?: string
    code: string
    file: ApprovalFile
    committees: Organization[]
}


export interface AgreementFile {
    id?: string
    name: string
    data: string
    mime: string
}

export interface ResearchMaterialTransferAgreement {
    id?: string
    file: AgreementFile
    sample: ResearchSample
    description: string
    quantity: string
}
