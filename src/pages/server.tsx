import {FC} from "react";
import {useParams} from "react-router-dom";
import {useServerConfiguration} from "../shared/useServerConfiguration.tsx";
import {ServerNavbar} from "../components/ServerNavbar.tsx";
import {useProcessInstances} from "../shared/useProcessInstances.tsx";
import {Spinner} from "@chakra-ui/react";

export const ServerPage: FC = () => {
    const {connection} = useParams();
    const configuration = useServerConfiguration(connection ?? "");
    const {data: processes, isLoading} = useProcessInstances(configuration);

    return (
        <>
            <ServerNavbar configuration={configuration} />
            <main>
            {
                // TODO: Error handling
                isLoading
                ? <Spinner/>
                : JSON.stringify(processes)
            }
            </main>
        </>
    );
};
