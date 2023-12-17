import {FC} from "react";
import {Divider, Flex, Heading} from "@chakra-ui/react";
import {ServerConfigurationSelection} from "../components/ServerConfigurationSelection.tsx";
import {useNavigate} from "react-router-dom";

export const DefaultPage: FC = () => {
    const navigate = useNavigate();
    const onServerConfigurationSelected = (id: string) => {
        navigate(`/server/${id}`);
    };

    return (
        <>
            <Flex direction="column" justifyContent="center" alignItems="center" padding={20}>
                <Heading>Kogito Workflows UI</Heading>

                <Divider margin={10}/>

                <ServerConfigurationSelection onSelect={onServerConfigurationSelected}/>
            </Flex>
        </>
    )
};
