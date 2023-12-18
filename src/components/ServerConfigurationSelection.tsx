import {FC, useState} from "react";
import {useServerConfigurations} from "../shared/useServerConfiguration.tsx";
import {
    Button,
    ButtonGroup,
    Flex,
    IconButton,
    useDisclosure
} from "@chakra-ui/react";
import {SmallCloseIcon} from "@chakra-ui/icons";
import {ServerConfiguration} from "../types/ServerConfiguration.ts";
import ServerConfigurationModal from "./ServerConfigurationModal.tsx";

export type ServerConfigurationSelectionProps = {
    onSelect: (id: string) => void;
};

export const ServerConfigurationSelection: FC<ServerConfigurationSelectionProps> = ({onSelect}) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [deleteEnabled, setDeleteEnabled] = useState(false);
    const [configurations, setConfigurations] = useServerConfigurations();

    const addConfiguration = (configuration: ServerConfiguration) => {
        setConfigurations(current => [...current, configuration]);
        onClose();
    };

    const deleteConfiguration = (configuration: ServerConfiguration) => {
        if (confirm(`Do you really want to delete the server configuration [${configuration.name}]?`)) {
            setConfigurations(current => current.filter(it => it.id !== configuration.id))
        }
    };

    const toggleDeleteEnabled = () => setDeleteEnabled(current => !current);

    return (
        <>
            <Flex alignSelf={"stretch"} alignItems="center" justifyContent="center" gap={10}>
                {configurations.map((configuration) =>
                    <ButtonGroup size="lg" isAttached colorScheme={deleteEnabled ? "gray" : "blue"} key={configuration.id}>
                        <Button onClick={() => onSelect(configuration.id)}>{configuration.name}</Button>
                        {deleteEnabled && <IconButton colorScheme="red" aria-label='Forget this connection' icon={<SmallCloseIcon/>} onClick={() => deleteConfiguration(configuration)}/>}
                    </ButtonGroup>
                )}
            </Flex>

            <Flex my={10}>
                <Button onClick={onOpen} variant="outline">Configure a new server connection</Button>
                <Button ml={5} onClick={toggleDeleteEnabled} variant="outline">
                    {deleteEnabled ? "Finish editing" : "Edit connections"}
                </Button>
            </Flex>

            <ServerConfigurationModal isOpen={isOpen} onClose={onClose} onSubmit={addConfiguration}/>
        </>
    );
};
