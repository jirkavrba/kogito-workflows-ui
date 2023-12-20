import {StringArgument} from "./GraphQL.ts";

export type ProcessInstanceState =
    | "ACTIVE"
    | "COMPLETED"
    | "ERROR"
    | "ABORTED"
    | "SUSPENDED";

export type ProcessInstanceError = {
    message: string;
};

export type ProcessInstance = {
    id: string;
    processName: string;
    businessKey: string | null;
    state: ProcessInstanceState;
    start: string;
    lastUpdate: string;
    error: ProcessInstanceError | null;
};

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
