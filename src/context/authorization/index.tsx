import {createContext, ReactNode, useEffect, useState} from "react";

// Apollo client
import {GET_USER_SELF_QUERY} from "@/apollo";
import {useLazyQuery} from "@apollo/client";

// Models
import {User} from "@/models";

export interface AuthContextTypes {
    readonly user?: User
    readonly loading: boolean
}

export const AuthContext = createContext<AuthContextTypes>({loading: true} as AuthContextTypes)

export interface AuthProviderProps {
    readonly children: ReactNode
}

/**
 * Provides the authentication and authorization context for entire application
 *
 * @param children
 * @constructor
 */
export function AuthProvider({children}: AuthProviderProps) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User>()

    const [times, setTimes] = useState(3);

    const [query, result] = useLazyQuery(GET_USER_SELF_QUERY, {
        pollInterval: 1000 * 5,
        notifyOnNetworkStatusChange: true,
        fetchPolicy: "no-cache",
        onError: async (e) => {
            setTimeout(() => {
                if (times === 0) {
                    setLoading(false);
                } else {
                    setTimes(times - 1)
                    query({
                        pollInterval: 1000
                    })
                }
            }, 1000)
        }
    })

    useEffect(() => {
        const authorization = global.window.localStorage.getItem("authorization") || ""

        if (!authorization) {
            setLoading(false)
        }

        if (global.window && !user) {
            query({
                context: {
                    headers: {
                        authorization
                    }
                }
            }).then((result) => {
                if (result.data?.getUserSelf) {
                    setLoading(false)
                    setUser(result.data.getUserSelf)
                }
            })
        }
    }, [user, query])


    useEffect(() => {
        setUser(result.data?.getUserSelf)
    }, [result, result.networkStatus])

    return (
        <AuthContext.Provider value={{user, loading}}>
            {children}
        </AuthContext.Provider>
    )
}
