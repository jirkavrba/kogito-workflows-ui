import {createHashRouter, RouterProvider} from "react-router-dom";
import {DefaultPage} from "./pages";
import {ChakraProvider} from "@chakra-ui/react";

const router = createHashRouter([
    {
        path: "/",
        element: <DefaultPage/>
    },
    {
        path: "/server/:id",
        element: <div>Connected</div>
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
