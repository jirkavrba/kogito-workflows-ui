import {StringArgument} from "./GraphQL.ts";

export type ProcessInstanceState =
    | "ACTIVE"
    | "COMPLETED"
    | "ERROR"
    | "ABORTED"
    | "SUSPENDED";

export type AggregatedProcessInstanceError = {
    message: string;
};

export type AggregatedProcessInstance = {
    id: string;
    processName: string;
    businessKey: string | null;
    state: ProcessInstanceState;
    start: string;
    lastUpdate: string;
    error: AggregatedProcessInstanceError | null;
};

export type ProcessInstanceError = {
    message: string;
    nodeDefinitionId: string;
};

export type ProcessInstanceTimelineItem = {
    id: string;
    name: string;
    nodeId: string;
    definitionId: string;
    type: string;
    enter: string;
    exit: string | null;
};

export type ProcessInstance = {
    id: string;
    processId: string;
    processName: string;
    businessKey: string | null;
    error: ProcessInstanceError | null;
    timeline: ProcessInstanceTimelineItem;
    source: string;
    state: ProcessInstanceState;
    start: string;
    lastUpdate: string;
}

export type ProcessInstanceArgument = {
    or?: Array<ProcessInstanceArgument>;
    and?: Array<ProcessInstanceArgument>;
    not?: ProcessInstanceArgument;
    processName?: StringArgument;
    businessKey?: StringArgument;
    state?: ProcessInstanceStateArgument;
}

export type ProcessInstanceStateArgument = {
    equal?: ProcessInstanceState;
    in?: Array<ProcessInstanceState>;
}
