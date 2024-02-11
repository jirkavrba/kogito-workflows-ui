import {FC, useState} from "react";
import {ServerConfiguration} from "../../types/ServerConfiguration.ts";
import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";

export type ServerConfigurationModalProps = {
    isOpen: boolean;
    onOpenChange: () => void;
    onSubmit: (server: ServerConfiguration) => void;
};

const slug = (value: string): string => {
    return String(value)
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export const ServerConfigurationModal: FC<ServerConfigurationModalProps> = ({isOpen, onOpenChange, onSubmit}) => {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");

    const submit = () => {
        if (!name || !url) {
            return
        }

        const configuration: ServerConfiguration = {
            id: slug(name),
            name: name,
            url: url,
        }

        setName("");
        setUrl("")
        onSubmit(configuration);
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Configure a new server connection</ModalHeader>
                        <ModalBody>
                            <Input
                                label="Connection name"
                                placeholder="Development"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                onKeyDown={(event) => (event.key === "Enter") && submit()}
                            />
                            <Input
                                label="Data index GraphQL endpoint"
                                placeholder="https://example-data-index.com/graphql"
                                value={url}
                                onChange={(event) => setUrl(event.target.value)}
                                onKeyDown={(event) => (event.key === "Enter") && submit()}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="default" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={submit}>
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ServerConfigurationModal;
