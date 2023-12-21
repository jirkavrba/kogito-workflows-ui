import {ProcessInstanceState} from "../types/ProcessInstance.ts";

export const stateTextColors: Record<ProcessInstanceState, string> = {
    "ACTIVE": "text-success",
    "COMPLETED": "text-default-400",
    "ERROR": "text-danger",
    "SUSPENDED": "text-warn",
    "ABORTED": "text-warn"
};

export const stateBorderColors: Record<ProcessInstanceState, string> = {
    "ACTIVE": "border-success",
    "COMPLETED": "border-default-400",
    "ERROR": "border-danger",
    "SUSPENDED": "border-warn",
    "ABORTED": "border-warn"
};

export const stateBackgroundColors: Record<ProcessInstanceState, string> = {
    "ACTIVE": "bg-success",
    "COMPLETED": "bg-default-400",
    "ERROR": "bg-danger",
    "SUSPENDED": "bg-warn",
    "ABORTED": "bg-warn"
};
