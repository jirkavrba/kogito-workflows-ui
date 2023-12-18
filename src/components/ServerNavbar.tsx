import {Button, Flex, Heading} from "@chakra-ui/react";
import {NavLink} from "react-router-dom";
import {FC} from "react";
import {ServerConfiguration} from "../types/ServerConfiguration.ts";

export type ServerNavbarProps = {
    configuration: ServerConfiguration;
}

export const ServerNavbar: FC<ServerNavbarProps> = ({configuration}) => {
    return (
        <header>
            <Flex p={5} direction="row" justifyContent="space-between" alignItems="center">
                <Flex direction="column">
                    <Heading size="md">Connected to {configuration.name}</Heading>
                    <code>{configuration.url}</code>
                </Flex>
                <NavLink to="/">
                    <Button>Disconnect</Button>
                </NavLink>
            </Flex>
        </header>
    );
}
