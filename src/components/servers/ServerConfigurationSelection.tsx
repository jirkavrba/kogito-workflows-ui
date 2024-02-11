import {FC, useState} from "react";
import {useServerConfigurations} from "../../shared/useServerConfiguration.tsx";
import {ServerConfiguration} from "../../types/ServerConfiguration.ts";
import ServerConfigurationModal from "./ServerConfigurationModal.tsx";
import {Button, useDisclosure} from "@nextui-org/react";
import {CgPlug, CgTrash} from "react-icons/cg";

export type ServerConfigurationSelectionProps = {
    onSelect: (id: string) => void;
};

export const ServerConfigurationSelection: FC<ServerConfigurationSelectionProps> = ({onSelect}) => {
    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure()
    const [deleteEnabled, setDeleteEnabled] = useState(false);
    const [configurations, setConfigurations] = useServerConfigurations();

    const addConfiguration = (configuration: ServerConfiguration) => {
        setConfigurations(current => [...current, configuration]);
        onClose();
    };

    const deleteConfiguration = (configuration: ServerConfiguration) => {
        setConfigurations(current => current.filter(it => it.id !== configuration.id))
        setDeleteEnabled(false);
    };

    const toggleDeleteEnabled = () => setDeleteEnabled(current => !current);

    return (
        <>
            <div className="flex flex-row gap-4 mb-10">
                {configurations.length === 0 && (
                    <div className="border-2 border-dashed p-8 border-default-300 rounded-lg text-default-300 text-sm">
                        There are no configured data index server connections.<br/>
                        Use the blue button below to configure a new connection.
                    </div>
                )}
                {configurations.map((configuration) =>
                    deleteEnabled
                        ? (
                            <Button size="lg" color="danger" key={configuration.id} onClick={() => deleteConfiguration(configuration)}>
                                {configuration.name}
                                <CgTrash/>
                            </Button>
                        )
                        : (
                            <Button size="lg" color="primary" key={configuration.id} onClick={() => onSelect(configuration.id)}>
                                {configuration.name}
                                <CgPlug/>
                            </Button>
                        )
                )}
            </div>

            <div className="flex flex-row gap-4">
                <Button onClick={onOpen} disabled={deleteEnabled} color={configurations.length === 0 ? "primary" : "default"}>Configure a new server connection</Button>
                <Button onClick={toggleDeleteEnabled} disabled={configurations.length === 0}>
                    {deleteEnabled ? "Cancel" : "Delete a connection"}
                </Button>
            </div>

            <ServerConfigurationModal isOpen={isOpen} onOpenChange={onOpenChange} onSubmit={addConfiguration}/>
        </>
    );
};
