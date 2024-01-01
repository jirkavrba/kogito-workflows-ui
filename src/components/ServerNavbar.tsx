import { NavLink } from "react-router-dom";
import { FC } from "react";
import { ServerConfiguration } from "../types/ServerConfiguration.ts";
import { Button, Spinner } from "@nextui-org/react";
import { useIsFetching } from "@tanstack/react-query";
import { LuUnplug } from "react-icons/lu";

export type ServerNavbarProps = {
    configuration: ServerConfiguration;
}

export const ServerNavbar: FC<ServerNavbarProps> = ({ configuration }) => {
    const fetching = useIsFetching();

    return (
        <header className="flex flex-row justify-between items-center px-8">
            {/*<Flex p={5} direction="row" justifyContent="space-between" alignItems="center">*/}
            {/*    <Flex direction="column">*/}
            <div className="flex flex-col p-4">
                <div className="text-sm">Connected to {configuration.name}</div>
                <code className="text-xs text-gray-500">{configuration.url}</code>
            </div>
            <NavLink to="/">
                {fetching > 0 && <Spinner size="sm" className="mr-2" />}
                <Button>
                    <LuUnplug />
                    Disconnect
                </Button>
            </NavLink>
        </header>
    );
}
