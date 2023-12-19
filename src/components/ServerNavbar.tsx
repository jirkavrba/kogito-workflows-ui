import {NavLink} from "react-router-dom";
import {FC} from "react";
import {ServerConfiguration} from "../types/ServerConfiguration.ts";
import {Button} from "@nextui-org/react";

export type ServerNavbarProps = {
    configuration: ServerConfiguration;
}

export const ServerNavbar: FC<ServerNavbarProps> = ({configuration}) => {
    return (
        <header className="flex flex-row justify-between items-center px-8">
            {/*<Flex p={5} direction="row" justifyContent="space-between" alignItems="center">*/}
            {/*    <Flex direction="column">*/}
            <div className="flex flex-col p-4">
                <div className="text-sm">Connected to {configuration.name}</div>
                <code className="text-xs text-gray-500">{configuration.url}</code>
            </div>
            <NavLink to="/">
                <Button>Disconnect</Button>
            </NavLink>
        </header>
    );
}
