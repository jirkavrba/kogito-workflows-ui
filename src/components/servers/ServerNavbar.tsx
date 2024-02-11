import {NavLink, useNavigate} from "react-router-dom";
import {FC} from "react";
import {ServerConfiguration} from "../../types/ServerConfiguration.ts";
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner} from "@nextui-org/react";
import {useIsFetching} from "@tanstack/react-query";
import {LuPlug, LuUnplug} from "react-icons/lu";
import {useServerConfigurations} from "../../shared/useServerConfiguration.tsx";

export type ServerNavbarProps = {
    configuration: ServerConfiguration;
}

export const ServerNavbar: FC<ServerNavbarProps> = ({configuration}) => {
    const navigate = useNavigate();
    const fetching = useIsFetching();
    const [configurations] = useServerConfigurations();
    const availableConfigurations = configurations.filter(it => it.id != configuration.id);

    const switchConnection = (id: string) => {
        navigate(`/server/${id}`);
    };

    return (
        <header className="flex flex-row justify-between items-center px-8">
            <div className="flex flex-row items-center gap-4 flex-grow">
                <NavLink to="/">
                    <img src="/kogito-ui.svg" alt="Logo" className="w-8 h-8"/>
                </NavLink>

                {availableConfigurations.length > 0 && (
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant="ghost">
                                <LuPlug/>
                                Switch connection
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu onAction={id => switchConnection(id as string)}>
                            {
                                availableConfigurations.map(it =>
                                    <DropdownItem key={it.id} value={it.id}>
                                        {it.name}
                                    </DropdownItem>
                                )
                            }
                        </DropdownMenu>
                    </Dropdown>
                )}

                <div className="flex flex-col py-4">
                    <div className="text-sm">Connected to {configuration.name}</div>
                    <code className="text-xs text-gray-500">{configuration.url}</code>
                </div>
            </div>
            <NavLink to="/">
                {fetching > 0 && <Spinner size="sm" className="mr-2"/>}
                <Button variant="ghost">
                    <LuUnplug/>
                    Disconnect
                </Button>
            </NavLink>
        </header>
    );
}
