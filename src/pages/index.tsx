import {FC} from "react";
import {version} from "../version";
import {ServerConfigurationSelection} from "../components/servers/ServerConfigurationSelection.tsx";
import {useNavigate} from "react-router-dom";
import {LuGithub} from "react-icons/lu";

export const DefaultPage: FC = () => {
    const navigate = useNavigate();
    const onServerConfigurationSelected = (id: string) => {
        navigate(`/server/${id}`);
    };

    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen">
            <img src="/kogito-ui.svg" alt="Kogito workflows UI icon" className="w-16 h-16 my-4"/>

            <h1 className="text-4xl font-bold mb-10">Kogito Workflows UI</h1>

            <ServerConfigurationSelection onSelect={onServerConfigurationSelected}/>

            <div className="flex flex-row justify-center items-center my-2 gap-2 mt-5">
                <span className="text-xs text-neutral-700">&copy; Jiří Vrba {new Date().getFullYear()}</span>
                <span className="text-neutral-500">
                    <LuGithub/>
                </span>
                <span className="text-xs">
                    <a href="https://github.com/jirkavrba/kogito-workflows-ui" target="_blank" className="text-neutral-700 hover:text-orange-500">
                        Version {version}
                    </a>
                </span>
            </div>
        </div>
    )
};
