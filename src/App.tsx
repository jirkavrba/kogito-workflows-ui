import {createHashRouter, RouterProvider} from "react-router-dom";
import {DefaultPage} from "./pages";
import {ChakraProvider} from "@chakra-ui/react";
import {ServerPage} from "./pages/server.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const router = createHashRouter([
    {
        path: "/",
        element: <DefaultPage/>
    },
    {
        path: "/server/:connection",
        element: <ServerPage/>
    }
])

const client = new QueryClient();

export const App = () => {
    return (
        <ChakraProvider>
            <QueryClientProvider client={client}>
                <RouterProvider router={router}/>
            </QueryClientProvider>
        </ChakraProvider>
    );
};

export default App;
