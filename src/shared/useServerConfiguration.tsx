import {ServerConfiguration} from "../types/ServerConfiguration.ts";
import {useLocalStorage} from "usehooks-ts";

const SERVER_CONFIGURATIONS_KEY = "serverConfigurations";

export const useServerConfigurations = () =>
    useLocalStorage<Array<ServerConfiguration>>(SERVER_CONFIGURATIONS_KEY, []);

export const useServerConfiguration = (id: string): ServerConfiguration | null => {
    const [configurations] = useServerConfigurations();
    return configurations.find(configuration => configuration.id === id) ?? null
}
