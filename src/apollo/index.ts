import {gql} from "@apollo/client";

export const GET_RESEARCHERS_BY_YEAR = gql`
    query GetResearchersByYear($year: Float!) {
        getResearchersByYear(year: $year) {
            firstName
            lastName
            email
            id
            features
            verified
            createdAt
            updatedAt
            birthDate
            sex
        }
    }
`

export const GET_DEFAULT_RESEARCHER_ROLE_QUERY = gql`
    query Query {
        getDefaultResearcherRole {
            id
            name
            description
            __typename
        }
    }
`
export const GET_DEFAULT_FINANCIER_QUERY = gql`
    query GetDefaultFinancier {
        getDefaultFinancier {
            id
            name
            description
            __typename
        }
    }
`

export const CREATE_USER_SELF_MUTATION = gql`
    mutation Mutation($input: CreateUserSelfInput!) {
        createUserSelf(input: $input) {
            message
        }
    }
`

export const CREATE_USER_MUTATION = gql`
    mutation Mutation($input: CreateUserInput!) {
        createUser(input: $input) {
            message
        }
    }
`

export const UPDATE_USER_MUTATION = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
        updateUser(input: $input) {
            firstName
            lastName
            email
            id
            features
            verified
        }
    }
`

export const FIND_USER_BY_EMAIL_QUERY = gql`
    query Query ($email: String!){
        findUserByEmail(email: $email) {
            firstName
            lastName
            features
            email
            id
        }
    }
`


export const LIST_USERS_QUERY = gql`
    query Query {
        listUsers {
            firstName
            lastName
            email
            id
        }
    }
`

export const CONFIRM_ACCOUNT_MUTATION = gql`
    mutation Mutation($token: String!) {
        confirmAccount(token: $token)
    }
`

export const LIST_RESEARCHES_BY_NAME = gql`
    query Query($name: String!) {
        listResearchersByName(name: $name) {
            firstName
            lastName
            email
            id
        }
    }
`

export const LIST_RESEARCHERS = gql`
    query Query {
        listResearchers {
            firstName
            lastName
            features
            email
            id
        }
    }
`

export const CONFIRM_SIGNIN_MUTATION = gql`
    mutation Mutation($token: String!) {
        confirmSignin(token: $token)
    }
`

export const AUTH_WITH_EMAIL_MUTATION = gql`
    mutation Mutation($email: String!) {
        authWithEmail(email: $email) {
            message
        }
    }
`

export const GET_USER_SELF_QUERY = gql`
    query Query {
        getUserSelf {
            firstName
            lastName
            email
            id
            features
            verified
            createdAt
            updatedAt
            birthDate
            sex
        }
    }
`

export const LIST_RESEARCH_FIELDS_QUERY = gql`
    query Query {
        listResearchFields {
            id
            code
            name
            subfields {
                id
                name
                code
            }
        }
    }
`;

export const FIND_RESEARCH_FIELD_BY_CODE_QUERY = gql`
    query FindResearchFieldByCode($code: String!) {
        findResearchFieldByCode(code: $code) {
            id
        }
    }
`;

export const FIND_RESEARCH_SUBFIELD_BY_CODE_QUERY = gql`
    query FindResearchFieldByCode($code: String!) {
        findResearchSubfieldByCode(code: $code) {
            id
        }
    }
`;

export const CREATE_RESEARCH_FIELD_MUTATION = gql`
    mutation Mutation($input: CreateResearchFieldInput!) {
        createResearchField(input: $input) {
            id
            name
            code
        }
    }
`;

export const UPDATE_RESEARCH_FIELD_MUTATION = gql`
    mutation Mutation($input: UpdateResearchFieldInput!) {
        updateResearchField(input: $input) {
            id
            code
            name
        }
    }
`;

export const CREATE_RESEARCH_SUBFIELD_MUTATION = gql`
    mutation Mutation($input: CreateResearchSubfieldInput!) {
        createResearchSubfield(input: $input) {
            id
            name
            code
        }
    }
`;


export const DELETE_RESEARCH_FIELD_MUTATION = gql`
    mutation Mutation($id: String!) {
        deleteResearchField(id: $id) {
            message
        }
    }
`;

export const DELETE_RESEARCH_SUBFIELD_MUTATION = gql`
    mutation Mutation($id: String!) {
        deleteResearchSubfield(id: $id) {
            message
        }
    }
`;


export const LIST_RESEARCH_CLASSIFICATIONS_QUERY = gql`
    query ListResearchClassifications {
        listResearchClassifications {
            id
            code
            name
            types {
                id
                code
                name
                subtypes {
                    id
                    code
                    name
                }
            }
        }
    }
`;

export const FIND_RESEARCH_CLASSIFICATION_BY_CODE = gql`
    query Query($code: String!) {
        findResearchClassificationByCode(code: $code) {
            id
        }
    }
`;

export const CREATE_RESEARCH_CLASSIFICATION_MUTATION = gql`
    mutation Mutation($input: CreateResearchClassificationInput!) {
        createResearchClassification(input: $input) {
            id
            name
            code
        }
    }
`;

export const UPDATE_RESEARCH_CLASSIFICATION_MUTATION = gql`
    mutation Mutation($input: UpdateResearchClassificationInput!) {
        updateResearchClassification(input: $input) {
            id
            name
            code
        }
    }
`;

export const DELETE_RESEARCH_CLASSIFICATION_MUTATION = gql`
    mutation Mutation($id: String!) {
        deleteResearchClassification(id: $id) {
            message
        }
    }
`;

export const FIND_RESEARCH_TYPE_BY_CODE_QUERY = gql`
    query Query($code: String!) {
        findResearchTypeByCode(code: $code) {
            id
        }
    }
`;

export const CREATE_RESEARCH_TYPE_MUTATION = gql`
    mutation Mutation($input: CreateResearchTypeInput!) {
        createResearchType(input: $input) {
            id
            name
            code
        }
    }
`

export const UPDATE_RESEARCH_TYPE_MUTATION = gql`
    mutation Mutation($input: UpdateResearchTypeInput!) {
        updateResearchType(input: $input) {
            id
            name
            code
            subtypes {
                id
                name
                code
            }
        }
    }
`

export const DELETE_RESEARCH_TYPE_MUTATION = gql`
    mutation Mutation($id: String!) {
        deleteResearchType(id: $id) {
            message
        }
    }
`

export const CREATE_RESEARCH_SUBTYPE_MUTATION = gql`
    mutation Mutation($input: CreateResearchSubtypeInput!) {
        createResearchSubtype(input: $input) {
            id
            name
            code
        }
    }
`;

export const FIND_RESEARCH_SUBTYPE_BY_CODE_QUERY = gql`
    query Query($code: String!) {
        findResearchSubtypeByCode(code: $code) {
            code
        }
    }
`;

export const DELETE_RESEARCH_SUBTYPE_MUTATION = gql`
    mutation Mutation($id: String!) {
        deleteResearchSubtype(id: $id) {
            message
        }
    }
`

export const LIST_RESEARCH_SAMPLES_QUERY = gql`
    query Query {
        listResearchSamples {
            id
            code
            name
        }
    }
`

export const FIND_RESEARCH_SAMPLE_BY_CODE_QUERY = gql`
    query Query($code: String!) {
        findResearchSampleByCode(code: $code) {
            id
            code
            name
        }
    }
`;

export const CREATE_RESEARCH_SAMPLE_MUTATION = gql`
    mutation Mutation($input: CreateResearchSampleInput!) {
        createResearchSample(input: $input) {
            name
            code
        }
    }
`;

export const UPDATE_RESEARCH_SAMPLE_MUTATION = gql`
    mutation Mutation($input: UpdateResearchSampleInput!) {
        updateResearchSample(input: $input) {
            id
            code
            name
        }
    }
`;

export const DELETE_RESEARCH_SAMPLE_MUTATION = gql`
    mutation Mutation($id: String!) {
        deleteResearchSample(id: $id) {
            message
        }
    }
`

export const LIST_RESEARCH_SCOPES_QUERY = gql`
    query Query {
        listResearchScopes {
            id
            name
            code
            description
        }
    }
`

export const FIND_RESEARCH_SCOPE_BY_CODE_QUERY = gql`
    query Query($code: String!) {
        findResearchScopeByCode(code: $code) {
            code
            description
            id
            name
        }
    }
`

export const CREATE_RESEARCH_SCOPE_MUTATION = gql`
    mutation Mutation($input: CreateResearchScopeInput!) {
        createResearchScope(input: $input) {
            code
            description
            id
            name
        }
    }
`

export const UPDATE_RESEARCH_SCOPE_MUTATION = gql`
    mutation Mutation($input: UpdateResearchScopeInput!) {
        updateResearchScope(input: $input) {
            code
            description
            id
            name
        }
    }
`

export const DELETE_RESEARCH_SCOPE_MUTATION = gql`
    mutation Mutation($id: String!) {
        deleteResearchScope(id: $id) {
            message
        }
    }
`

export const LIST_RESEARCH_DOCUMENTS_QUERY = gql`
    query Query {
        listResearchDocuments {
            id
            name
            code
        }
    }
`

export const CREATE_RESEARCH_DOCUMENT_MUTATION = gql`
    mutation Mutation($input: CreateResearchDocumentInput!) {
        createResearchDocument(input: $input) {
            code
            id
            name
        }
    }
`

export const FIND_RESEARCH_DOCUMENT_BY_CODE_QUERY = gql`
    query Query($code: String!) {
        findResearchDocumentByCode(code: $code) {
            code
            id
            name
        }
    }
`


export const UPDATE_RESEARCH_DOCUMENT_MUTATION = gql`
    mutation Mutation($input: UpdateResearchDocumentInput!) {
        updateResearchDocument(input: $input) {
            code
            id
            name
        }
    }
`

export const DELETE_RESEARCH_DOCUMENT_MUTATION = gql`
    mutation Mutation($id: String!) {
        deleteResearchDocument(id: $id) {
            message
        }
    }
`


export const LIST_COUNTRIES_QUERY = gql`
    query Query {
        listCountries {
            id
            name
            code
            regions {
                id
                name
                code
                provinces {
                    id
                    name
                    code
                }
            }
        }
    }
`

export const FIND_COUNTRY_BY_CODE_QUERY = gql`
    query Query($code: String!) {
        findCountryByCode(code: $code) {
            id
            name
            code
            regions {
                id
                name
                code
                provinces {
                    id
                    name
                    code
                }
            }
        }
    }
`

export const CREATE_COUNTRY_MUTATION = gql`
    mutation Mutation($input: CreateCountryInput!) {
        createCountry(input: $input) {
            id
            name
            code
            regions {
                id
                name
                code
                provinces {
                    id
                    name
                    code
                }
            }
        }
    }
`

export const UPDATE_COUNTRY_MUTATION = gql`
    mutation Mutation($input: UpdateCountryInput!) {
        updateCountry(input: $input) {
            id
            name
            code
            regions {
                id
                name
                code
                provinces {
                    id
                    name
                    code
                }
            }
        }
    }
`

export const DELETE_COUNTRY_MUTATION = gql`
    mutation Mutation($id: String!) {
        deleteCountry(id: $id) {
            message
        }
    }
`


export const FIND_REGION_BY_CODE_QUERY = gql`
    query Mutation($code: String!) {
        findRegionByCode(code: $code) {
            id
            name
            code
            provinces {
                id
                name
                code
            }
        }
    }
`

export const CREATE_REGION_MUTATION = gql`
    mutation Mutation($input: CreateRegionInput!) {
        createRegion(input: $input) {
            id
            name
            code
            provinces {
                id
                name
                code
            }
        }
    }
`

export const UPDATE_REGION_MUTATION = gql`
    mutation Region($input: UpdateRegionInput!) {
        updateRegion(input: $input) {
            id
            name
            code
            provinces {
                id
                name
                code
            }
        }
    }
`

export const DELETE_REGION_MUTATION = gql`
    mutation Mutation($id: String!) {
        deleteRegion(id: $id) {
            message
        }
    }
`

export const FIND_PROVINCE_BY_CODE_QUERY = gql`
    query FindProvinceByCode($code: String!) {
        findProvinceByCode(code: $code) {
            id
            name
            code
        }
    }
`

export const CREATE_PROVINCE_MUTATION = gql`
    mutation Mutation($input: CreateProvinceInput!) {
        createProvince(input: $input) {
            id
            name
            code
        }
    }
`

export const UPDATE_PROVINCE_MUTATION = gql`
    mutation Mutation($input: UpdateProvinceInput!) {
        updateProvince(input: $input) {
            id
            name
            code
        }
    }
`

export const DELETE_PROVINCE_MUTATION = gql`
    mutation Mutation($id: String!) {
        deleteProvince(id: $id) {
            message
        }
    }
`

export const LIST_ORGANIZATIONS_QUERY = gql`
    query Query {
        listOrganizations {
            id
            name
            code
            type {
                id
                name
                description
            }
            description
        }
    }
`

export const LIST_ETHIC_COMMITTEES = gql`
    query ListEthicCommittees {
        listEthicCommittees {
            id
            name
            code
            type {
                id
                name
                description
            }
            description
        }
    }
`

export const LIST_ORGANIZATION_TYPES_QUERY = gql`
    query Query {
        listOrganizationTypes {
            id
            name
            description
        }
    }
`

export const DELETE_ORGANIZATION_MUTATION = gql`
    mutation Mutation($id: String!) {
        deleteOrganization(id: $id) {
            message
        }
    }
`

export const UPDATE_ORGANIZATION_MUTATION = gql`
    mutation Mutation($input: UpdateOrganizationInput!) {
        updateOrganization(input: $input) {
            id
            name
            code
            type {
                id
                name
                description
            }
            description
        }
    }
`

export const FIND_ORGANIZATION_BY_CODE_QUERY = gql`
    query Query($code: String!) {
        findOrganizationByCode(code: $code) {
            id
            name
            code
            type {
                id
                name
                description
            }
            description
        }
    }
`

export const CREATE_ORGANIZATION_MUTATION = gql`
    mutation Mutation($input: CreateOrganizationInput!) {
        createOrganization(input: $input) {
            id
            name
            code
            type {
                id
                name
                description
            }
            description
        }
    }
`

export const LIST_FINANCING_TYPES_QUERY = gql`
    query Query {
        listFinancingTypes {
            id
            name
            description
        }
    }
`

export const CREATE_ORGANIZATION_TYPE_MUTATION = gql`
    mutation CreateOrganizationType($input: CreateOrganizationTypeInput!) {
        createOrganizationType(input: $input) {
            id
            name
            description
        }
    }
`

export const DELETE_ORGANIZATION_TYPE_MUTATION = gql`
    mutation Mutation($id: String!) {
        deleteOrganizationType(id: $id) {
            message
        }
    }
`

export const UPDATE_ORGANIZATION_TYPE_MUTATION = gql`
    mutation Mutation($input: UpdateOrganizationTypeInput!) {
        updateOrganizationType(input: $input) {
            id
            name
            description
        }
    }
`

export const CREATE_FINANCING_TYPE_MUTATION = gql`
    mutation Query($input: CreateFinancingTypeInput!) {
        createFinancingType(input: $input) {
            id
            name
            description
        }
    }
`

export const DELETE_FINANCING_TYPE_MUTATION = gql`
    mutation Mutation($id: String!) {
        deleteFinancingType(id: $id) {
            message
        }
    }
`

export const UPDATE_FINANCING_TYPE_MUTATION = gql`
    mutation UpdateFinancingType($input: UpdateFinancingTypeInput!) {
        updateFinancingType(input: $input) {
            id
            name
            description
        }
    }
`

export const LIST_FINANCIERS_QUERY = gql`
    query Query {
        listFinanciers {
            id
            name
            description
        }
    }
`

export const CREATE_FINANCIER_MUTATION = gql`
    mutation Query($input: CreateFinancierInput!) {
        createFinancier(input: $input) {
            id
            name
            description
        }
    }
`

export const DELETE_FINANCIER_MUTATION = gql`
    mutation Mutation($id: String!) {
        deleteFinancier(id: $id) {
            message
        }
    }
`

export const UPDATE_FINANCIER_MUTATION = gql`
    mutation UpdateFinancier($input: UpdateFinancierInput!) {
        updateFinancier(input: $input) {
            id
            name
            description
        }
    }
`

export const LIST_RESEARCHER_ROLES_QUERY = gql`
    query Query {
        listResearcherRoles {
            id
            name
            description
        }
    }
`

export const CREATE_RESEARCHER_ROLE_MUTATION = gql`
    mutation Query($input: CreateResearcherRoleInput!) {
        createResearcherRole(input: $input) {
            id
            name
            description
        }
    }
`

export const DELETE_RESEARCHER_ROLE_MUTATION = gql`
    mutation Mutation($id: String!) {
        deleteResearcherRole(id: $id) {
            message
        }
    }
`

export const UPDATE_RESEARCHER_ROLE_MUTATION = gql`
    mutation Mutation($input: UpdateResearcherRoleInput!) {
        updateResearcherRole(input: $input) {
            id
            name
            description
        }
    }
`
export const CREATE_RESEARCH_MUTATION = gql`
    mutation CreateResearch($input: CreateResearchInput!) {
        createResearch(input: $input) {
            id
            code
            acronym
            title
            otherScope
            startDate
            endDate
            scope {
                id
                name
                code
                description
            }
            subfield {
                id
                name
                code
            }
            subtype {
                id
                name
                code
            }
        }
    }
`

export const CREATE_RESEARCH_INVITATION_MUTATION = gql`
    mutation CreateResearcherInvitation($input: CreateInvitationInput!) {
        createResearcherInvitation(input: $input) {
            message
        }
    }
`

export const DELETE_RESEARCH_INVITATION_MUTATION = gql`
    mutation DeleteResearchInvitation($id: String!) {
        deleteResearchInvitation(id: $id) {
            message
        }
    }
`

export const GET_RESEARCH_INVITATIONS_QUERY = gql`
    query GetResearchInvitations($id: String!) {
        getResearchInvitations(id: $id) {
            id
            role {
                id
                name
                description
            }
            status
            researcher {
                firstName
                lastName
                email
                id
                features
                verified
                createdAt
                updatedAt
            }
        }
    }
`

export const GET_RESEARCH_FINANCINGS_QUERY = gql`
    query GetResearchFinancings($id: String!) {
        getResearchFinancings(id: $id) {
            amount
            id
            type {
                id
                name
                description
            }
            financier {
                id
                name
                description
            }
        }
    }
`

export const GET_RESEARCH_FILES_QUERY = gql`
    query GetResearchFiles($id: String!) {
        getResearchFiles(id: $id) {
            id
            name
            data
            mime
            type {
                id
                name
                code
            }
            createdAt
            updatedAt
        }
    }
`

export const CREATE_RESEARCH_FILE_MUTATION = gql`
    mutation CreateResearchFile($input: ResearchFileInput!) {
        createResearchFile(input: $input) {
            message
        }
    }
`

export const DELETE_RESEARCH_FILE_MUTATION = gql`
    mutation DeleteResearchFile($id: String!) {
        deleteResearchFile(id: $id) {
            message
        }
    }
`

export const GET_RESEARCH_APPROVAL_QUERY = gql`
    query GetResearchApproval($id: String!) {
        getResearchApproval(id: $id) {
            code
            file {
                id
                name
                data
                mime
                createdAt
                updatedAt
            }
            committees {
                id
                name
                code
                type {
                    id
                    name
                    description
                }
                description
            }
            createdAt
            id
            updatedAt
        }
    }
`

export const CREATE_RESEARCH_APPROVAL_MUTATION = gql`
    mutation CreateResearchApproval($input: UpdateResearchApprovalInput!) {
        createResearchApproval(input: $input) {
            message
        }
    }
`

export const UPDATE_RESEARCH_FINANCING_MUTATION = gql`
    mutation UpdateResearchFinancing($input: UpdateResearchFinancingInput!) {
        updateResearchFinancing(input: $input) {
            message
        }
    }
`

export const GET_RESEARCH_COLLABORATIONS_QUERY = gql`
    query GetResearchCollaborations($id: String!) {
        getResearchCollaborations(id: $id) {
            id
            researcher {
                firstName
                lastName
                email
                id
                features
                verified
                createdAt
                updatedAt
            }
            role {
                id
                name
                description
            }
        }
    }
`

export const DELETE_RESEARCH_COLLABORATION_MUTATION = gql`
    mutation DeleteResearchResearcher($id: String!) {
        deleteResearchResearcher(id: $id) {
            message
        }
    }
`


export const LIST_RESEARCHES_QUERY = gql`
    query ListResearches {
        listResearches {
            id
            code
            acronym
            title
            otherScope
            startDate
            endDate
            visibility
            countries
            status
            owner {
                firstName
                lastName
                email
                sex
            }
            region {
                id
                name
                code
            }
            province {
                id
                name
                code
            }
            scope {
                id
                name
                code
                description
            }
            subfield {
                id
                name
                code
            }
            subtype {
                id
                name
                code
            }
        }
    }
`

export const UPDATE_RESEARCH_MUTATION = gql`
    mutation Mutation($input: UpdateResearchInput!) {
        updateResearch(input: $input) {
            id
            code
            acronym
            title
            otherScope
            startDate
            endDate
            scope {
                id
                name
                code
                description
            }
            subfield {
                id
                name
                code
            }
            subtype {
                id
                name
                code
            }
        }
    }
`

export const UPDATE_RESEARCH_COVERAGE_AREA_MUTATION = gql`
    mutation UpdateResearchCoverageArea($input: UpdateResearchCoverageAreaInput!) {
        updateResearchCoverageArea(input: $input) {
            message
        }
    }
`

export const GET_RESEARCH_STATISTIC = gql`
    query GetResearchStatistics {
        getResearchStatistics {
            total
            monthly
            approved
            nonApproved
        }
    }
`

export const GET_USER_STATISTIC = gql`
    query GetResearchStatistics {
        getUserStatistics {
            total
            verified
            blocked
            researchers
        }
    }
`

export const GET_FINANCIER_STATISTIC = gql`
    query Query {
        getFinancierStatistics {
            total
            monthly
        }
    }
`

export const GET_ORGANIZATION_STATISTIC = gql`
    query Query {
        getOrganizationStatistics {
            total
            monthly
        }
    }
`

export const GET_RESEARCH_REPORT_QUERY = gql`
    query getResearchReport($id: String!) {
        getResearchReport(id: $id) {
            acronym
            code
            countries
            endDate
            id
            otherScope
            province {
                id
                name
                code
            }
            scope {
                id
                name
                code
                description
            }
            startDate
            subfield {
                id
                name
                code
            }
            title
            visibility
            classification {
                id
                name
                code
            }
            field {
                id
                name
                code
            }
        }
    }
`

export const GET_RESEARCH_RC_QUERY = gql`
    query getResearchRC($id: String!) {
        getResearchRC(id: $id) {
            id
            code
            acronym
            title
            collaborations {
                id
                role {
                    id
                    name
                    description
                }
                researcher {
                    firstName
                    lastName
                    email
                    id
                    features
                    verified
                    createdAt
                    updatedAt
                }
            }
            approval {
                id
                code
                createdAt
                updatedAt
            }
        }
    }
`

export const FIND_RESEARCH_INVITATION_BY_ID = gql`
    query FindInvitationById($id: String!) {
        findInvitationById(id: $id) {
            id
            role {
                id
                name
                description
            }
            status
            researcher {
                firstName
                lastName
                email
                id
                features
                verified
                createdAt
                updatedAt
            }
            research {
                id
                code
                acronym
                title
                subfield {
                    id
                    name
                    code
                }
                subtype {
                    id
                    name
                    code
                }
                otherScope
                countries
                startDate
                endDate
                visibility
                province {
                    id
                    name
                    code
                }
                scope {
                    id
                    name
                    code
                    description
                }
                owner {
                    firstName
                    lastName
                    email
                    id
                    features
                    verified
                    createdAt
                    updatedAt
                }
            }
        }
    }
`

export const GET_RESEARCH_BY_ID_QUERY = gql`
    query getResearchById($id: String!) {
        getResearchById(id: $id) {
            id
            code
            acronym
            title
            otherScope
            startDate
            endDate
            visibility
            countries
            status
            province {
                id
                name
                code
            }
            scope {
                id
                name
                code
                description
            }
            subfield {
                id
                name
                code
            }
            subtype {
                id
                name
                code
            }
        }
    }
`

export const ACCEPT_RESEARCH_INVITATION = gql`
    mutation AcceptResearchInvitation($id: String!) {
        acceptResearchInvitation(id: $id) {
            message
        }
    }
`

export const CREATE_RESEARCH_MATERIAL_TRANSFER_AGREEMENT = gql`
    mutation CreateResearchMaterialTransferAgreement($input: CreateResearchMaterialTransferAgreement!) {
        createResearchMaterialTransferAgreement(input: $input) {
            message
        }
    }
`

export const GET_RESEARCH_MATERIAL_TRANSFER_AGREEMENTS = gql`
    query GetResearchMaterialTransferAgreements($id: String!) {
        getResearchMaterialTransferAgreements(id: $id) {
            description
            quantity
            file {
                id
                name
                data
                mime
                createdAt
                updatedAt
            }
            id
            sample {
                id
                name
                code
            }
        }
    }
`

export const GET_DEFAULT_ORGANIZATION_TYPE_QUERY = gql`
    query GetDefaultOrganizationType {
        getDefaultOrganizationType {
            id
            name
            description
        }
    }
`

export const UPDATE_RESEARCH_STATUS_MUTATION = gql`
    mutation UpdateResearchStatus($input: UpdateResearchStatusInput!) {
        updateResearchStatus(input: $input) {
            message
        }
    }
`

export const HAS_APPROVAL_QUERY = gql`
    query GetResearchApproval($id: String!) {
        getResearchApproval(id: $id) {
            code
        }
    }
`

export const GET_USER_BY_ID = gql`
    query GetUserById($id: String!) {
        getUserById(id: $id) {
            firstName
            lastName
            email
            id
            features
            verified
            createdAt
            updatedAt
            birthDate
            sex
        }
    }
`

export const ASK_FOR_PERMISSION_MUTATION = gql`
    mutation AskForPermission {
        askForPermission {
            message
        }
    }
`

export const SWITCH_TO_ADMIN = gql`
    mutation SwitchToAdmin {
        switchToAdmin {
            message
        }
    }
`

export const SWITCH_TO_RESEARCHER = gql`
    mutation SwitchToResearcher {
        switchToResearcher {
            message
        }
    }
`

export const SIGN_OUT_MUTATION = gql`
    mutation SignOut {
        signOut {
            message
        }
    }
`
