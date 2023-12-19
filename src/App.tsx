import {Route, Routes, useNavigate} from "react-router-dom";
import {DefaultPage} from "./pages";
import {ServerPage} from "./pages/server.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {NextUIProvider} from "@nextui-org/react";

const client = new QueryClient();

export const App = () => {
    // const navigate = useNavigate();

    return (
        <NextUIProvider>
            <QueryClientProvider client={client}>
                <Routes>
                    <Route path="/server/:connection" element={<ServerPage/>}/>
                    <Route path="/" element={<DefaultPage/>}/>
                </Routes>
            </QueryClientProvider>
        </NextUIProvider>
    );
};

export default App;
