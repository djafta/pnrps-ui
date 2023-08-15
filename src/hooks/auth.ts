import {useContext} from "react";
import {AuthContext} from "@/context/authorization";

export function useAuth() {
    const {user, loading} = useContext(AuthContext)

    function isAuthorized(...roles: string[]) {
        if (user) {
            for (let feature of user.features) {
                if (roles.includes(feature)) {
                    return true;
                }
            }
        }

        return false;
    }


    return {
        isAuthorized,
        loading,
        user,
    }

}
