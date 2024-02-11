import {FC, useState} from "react";
import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea} from "@nextui-org/react";
import {LuZap} from "react-icons/lu";

export type ProcessInstanceEventTriggerModalProps = {
    serviceUrl: string;
    eventName: string;
    onClose: () => void;
};

export const ProcessInstanceEventTriggerModal: FC<ProcessInstanceEventTriggerModalProps> = ({serviceUrl, eventName, onClose}) => {
    const eventEndpoint = `${serviceUrl}/${eventName}`

    const [eventData, setEventData] = useState("{}");
    const [correlationHeaderName, setCorrelationHeaderName] = useState("");
    const [correlationHeaderValue, setCorrelationHeaderValue] = useState("");

    return (
        <Modal isOpen={true} onClose={onClose} size="5xl">
            <ModalContent>
                <ModalHeader>
                    <h1>Trigger the <span className="text-warning">{eventName}</span> event</h1>
                </ModalHeader>
                <ModalBody>
                    <div className="text-xs font-mono mb-4 text-default-400">
                        {eventEndpoint}
                    </div>
                    <div className="flex flex-row gap-2">
                        <Input
                            label="Correlation Header Name"
                            value={correlationHeaderName}
                            onChange={(event) => setCorrelationHeaderName(event.target.value)}
                        />
                        <Input
                            label="Correlation Header Value"
                            value={correlationHeaderValue}
                            onChange={(event) => setCorrelationHeaderValue(event.target.value)}
                        />
                    </div>
                    <Textarea
                        label="Event data"
                        value={eventData}
                        onChange={(event) => setEventData(event.target.value)}
                        className="font-mono text-xs"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="warning">
                        <LuZap/>
                        Trigger event
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )

};
