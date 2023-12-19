import {FC} from "react";
import {ServerConfigurationSelection} from "../components/ServerConfigurationSelection.tsx";
import {useNavigate} from "react-router-dom";

export const DefaultPage: FC = () => {
    const navigate = useNavigate();
    const onServerConfigurationSelected = (id: string) => {
        navigate(`/server/${id}`);
    };

    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen">
            <h1 className="text-4xl font-bold mb-10">Kogito Workflows UI</h1>

            <ServerConfigurationSelection onSelect={onServerConfigurationSelected}/>
        </div>
    )
};
