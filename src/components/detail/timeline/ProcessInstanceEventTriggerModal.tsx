import {FC, useMemo, useState} from "react";
import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea} from "@nextui-org/react";
import {LuZap} from "react-icons/lu";
import {useTriggerEventMutation} from "../../../shared/useTriggerEventMutation.tsx";
import {isValidJson} from "../../../helpers/json.ts";
import {useQueryClient} from "@tanstack/react-query";
import {ServerConfiguration} from "../../../types/ServerConfiguration.ts";

export type ProcessInstanceEventTriggerModalProps = {
    serviceUrl: string;
    eventName: string;
    onClose: () => void;
    id: string;
    configuration: ServerConfiguration;
};

export const ProcessInstanceEventTriggerModal: FC<ProcessInstanceEventTriggerModalProps> = ({serviceUrl, eventName, onClose, configuration, id}) => {
    const eventEndpoint = `${serviceUrl}/${eventName}`

    const [eventData, setEventData] = useState("{}");
    const [correlationHeaderName, setCorrelationHeaderName] = useState("");
    const [correlationHeaderValue, setCorrelationHeaderValue] = useState("");

    const {mutate} = useTriggerEventMutation(eventEndpoint, eventName);

    const hasValidPayload = useMemo(() => isValidJson(eventData), [eventData]);

    const client = useQueryClient();
    const triggerEvent = () => {
        const data = eventData
        const extensions = {[correlationHeaderName]: correlationHeaderValue};

        mutate(
            {data, extensions},
            {
                onSuccess: () => {
                    onClose();
                    setTimeout(async () => {
                        await client.invalidateQueries({
                            queryKey: [`instances#${configuration.id}#${id}`]
                        })
                    }, 250);
                }
            });
    }

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
                    <Button color={hasValidPayload ? "warning" : "default"} disabled={!hasValidPayload} onClick={triggerEvent}>
                        <LuZap/>
                        {hasValidPayload ? "Trigger event" : "Invalid JSON"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )

};
