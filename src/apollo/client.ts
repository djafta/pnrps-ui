import {ApolloClient, InMemoryCache, ApolloLink, HttpLink} from '@apollo/client';

// Create an instance of ApolloLink for your middleware
const myMiddleware = new ApolloLink((operation, forward) => {
    // Modify the request or response here
    // You can access operation variables, context, etc.

    operation.setContext({
            headers: {
                authorization: global?.window?.localStorage.getItem("authorization") || ""
            }
        }
    )

    // Proceed to the next link in the chain
    return forward(operation);
});

// Create an instance of HttpLink for your GraphQL endpoint
const httpLink = new HttpLink({uri: process.env.NEXT_PUBLIC_API_URL});

// Create an instance of Apollo Client with the middleware
export const client = new ApolloClient({
    link: myMiddleware.concat(httpLink),
    cache: new InMemoryCache(),
});


