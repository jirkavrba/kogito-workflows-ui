import {ServerConfiguration} from "../types/ServerConfiguration.ts";
import {useLocalStorage} from "usehooks-ts";
import {useNavigate} from "react-router-dom";

const SERVER_CONFIGURATIONS_KEY = "serverConfigurations";

export const useServerConfigurations = () =>
    useLocalStorage<Array<ServerConfiguration>>(SERVER_CONFIGURATIONS_KEY, []);

export const useServerConfiguration = (id: string): ServerConfiguration => {
    const navigate = useNavigate();
    const [configurations] = useServerConfigurations();
    const server = configurations.find(configuration => configuration.id === id) ?? null

    if (!server) {
        navigate("/");
        return null!;
    }

    return server;
}

