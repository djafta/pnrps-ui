import {useQuery} from "@apollo/client";
import {GET_DEFAULT_FINANCIER_QUERY, GET_DEFAULT_RESEARCHER_ROLE_QUERY} from "@/apollo";

interface Record {
    id: string
    __typename?: string
}

export function useDefault() {
    const {data: defaultResearcherRoleData} = useQuery(GET_DEFAULT_RESEARCHER_ROLE_QUERY)
    const {data: defaultFinancierData} = useQuery(GET_DEFAULT_FINANCIER_QUERY)

    function isDefault(record: Record) {
        if (!record) {
            return false;
        }

        if (record["__typename"] === "ResearcherRole") {
            return record.id === defaultResearcherRoleData?.getDefaultResearcherRole.id
        }

        if (record["__typename"] === "Financier") {
            return record.id === defaultFinancierData?.getDefaultFinancier.id
        }

        return false;
    }

    function hasDefault(records: Record[]) {
        for (let record of records) {
            if (isDefault(record)) return true;
        }

        return false;
    }

    return {
        isDefault,
        hasDefault,
        financier: defaultFinancierData?.getDefaultFinancier
    }
}
