import {createHashRouter, RouterProvider} from "react-router-dom";
import {DefaultPage} from "./pages";
import {ChakraProvider} from "@chakra-ui/react";
import {ServerPage} from "./pages/server.tsx";

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

export const App = () => {
    return (
        <ChakraProvider>
            <RouterProvider router={router}/>
        </ChakraProvider>
    );
};

export default App;
