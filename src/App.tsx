import { Route, Routes } from "react-router-dom";
import { DefaultPage } from "./pages";
import { ServerPage } from "./pages/server.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextUIProvider } from "@nextui-org/react";
import { ProcessInstancePage } from "./pages/instance.tsx";
import { SettingsPage } from "./pages/settings.tsx";

const client = new QueryClient();

export const App = () => {
    return (
        <NextUIProvider>
            <QueryClientProvider client={client}>
                <Routes>
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/server/:connection/instance/:processInstanceId" element={<ProcessInstancePage />} />
                    <Route path="/server/:connection" element={<ServerPage />} />
                    <Route path="/" element={<DefaultPage />} />
                </Routes>
            </QueryClientProvider>
        </NextUIProvider>
    );
};

export default App;
