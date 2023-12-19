import {AggregatedProcessInstancesRequest} from "../shared/useProcessInstances.tsx";
import {FC} from "react";
import {FormLabel, Heading, Input} from "@chakra-ui/react";

export type ProcessInstancesFilterProps = {
    onUpdate: (request: AggregatedProcessInstancesRequest) => void;
};

export const ProcessInstancesFilter: FC<ProcessInstancesFilterProps> = ({ onUpdate }) => {
    return (
        <div>
            <Heading size={"sm"}>Filter process instances</Heading>
        </div>
    );
};
