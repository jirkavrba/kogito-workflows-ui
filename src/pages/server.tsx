import {FC} from "react";
import {useParams} from "react-router-dom";
import {useServerConfiguration} from "../shared/useServerConfiguration.tsx";
import {ServerNavbar} from "../components/ServerNavbar.tsx";

export const ServerPage: FC = () => {
    const {connection} = useParams();
    const configuration = useServerConfiguration(connection ?? "");

    return (
        <>
            <ServerNavbar configuration={configuration} />
            <main></main>
        </>
    );
};
