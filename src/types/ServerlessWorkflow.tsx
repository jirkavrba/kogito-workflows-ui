// TODO: Support the full spec?

export type ErrorDefinition = {
    name: string;
    code: string;
};

export type FunctionDefinition = {
    name: string;
    operation: string;
    type?: string;
};

export type EventKind = "produced" | "consumed";

export type EventDefinition = {
    name: string;
    type: string;
    kind: EventKind;
}

export type OnEventsRef = {
    eventRefs: Array<string>;
}

export type OnErrorRef = {
    errorRef: string;
    transition?: string;
    end?: true;
};

export type TransitionRef = string | { nextState: string; }

export type EventStateDefinition = {
    type: "event"
    name: string;
    onEvents: Array<OnEventsRef>;
    onErrors?: Array<OnErrorRef>;
    transition?: TransitionRef;
    end?: true;
};

// TODO: Better type for actions?
export type Action = {
    name?: string;
};

export type OperationStateDefinition = {
    type: "operation",
    name: string;
    actions: Array<Action>;
    onErrors?: Array<OnErrorRef>;
    transition?: TransitionRef;
    end?: true;
};

export type DataCondition = {
    name?: string;
    condition: string;
    transition?: TransitionRef;
    end?: true;
}

export type EventCondition = {
    eventRef: string;
    transition?: TransitionRef;
    end?: true;
}

export type ForeachState = {
    type: "foreach";
    name: string;
    actions: Array<unknown>;
    onErrors?: Array<OnErrorRef>;
    transition?: TransitionRef;
    end?: true;
};

export type SwitchStateDefinition = {
    type: "switch";
    name: string;
    dataConditions: Array<DataCondition>;
    eventConditions: Array<EventCondition>;
    defaultCondition: {
        transition?: TransitionRef;
        end?: true;
    }
    onErrors?: Array<OnErrorRef>;
    transition?: TransitionRef;
    end?: true;
};

export type InjectStateDefinition = {
    type: "inject";
    name: string;
    data: unknown;
    onError?: Array<OnErrorRef>;
    transition?: TransitionRef;
    end?: true;
};

export type CallbackState = {
    type: "callback";
    name: string;
    action: unknown;
    onErrors?: Array<OnErrorRef>;
    transition?: TransitionRef;
    end?: true;
};

export type StateDefinition =
    | EventStateDefinition
    | OperationStateDefinition
    | SwitchStateDefinition
    | InjectStateDefinition
    | CallbackState
    | ForeachState;

export type ServerlessWorkflowDefinition = {
    id: string;
    name: string;
    description: string | null;
    start: string;
    errors?: Array<ErrorDefinition>;
    functions?: Array<FunctionDefinition>;
    events: Array<EventDefinition>;
    states: Array<StateDefinition>;
};
