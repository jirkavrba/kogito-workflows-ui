import {createHashRouter, RouterProvider} from "react-router-dom";
import {DefaultPage} from "./pages";

const router = createHashRouter([
    {
        path: "/",
        element: <DefaultPage/>
    }
])

export const App = () => {
    return (
        <RouterProvider router={router}/>
    );
};

export default App;
