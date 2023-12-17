import {Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay} from "@chakra-ui/react";
import {FC, useRef, useState} from "react";
import {ServerConfiguration} from "../types/ServerConfiguration.ts";

export type ServerConfigurationModalProps = {
    isOpen: boolean;
    onClose: () => void;
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

export const ServerConfigurationModal: FC<ServerConfigurationModalProps> = ({isOpen, onClose, onSubmit}) => {
    const initialRef = useRef(null);
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");

    const submit = () => {
        const configuration: ServerConfiguration = {
            id: slug(name),
            name: name,
            url: url,
        }

        onSubmit(configuration);
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef} size="2xl">
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Configure a new server connection</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <FormControl>
                        <FormLabel>Connection name</FormLabel>
                        <Input ref={initialRef} placeholder='Dev' value={name} onChange={(event) => setName(event.target.value)}/>
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Data index GraphQL endpoint</FormLabel>
                        <Input placeholder='https://example-data-index.com/graphql' value={url} onChange={(event) => setUrl(event.target.value)}/>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button variant='ghost' mr={3} onClick={onClose}>Close</Button>
                    <Button colorScheme='blue' onClick={submit}>
                        Save & connect
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ServerConfigurationModal;
