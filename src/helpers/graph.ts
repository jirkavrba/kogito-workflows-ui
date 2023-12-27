import {
    CallbackState,
    EventStateDefinition, ForeachState,
    InjectStateDefinition,
    OperationStateDefinition,
    ServerlessWorkflowDefinition,
    SwitchStateDefinition,
    TransitionRef
} from "../types/ServerlessWorkflow.tsx";


const resolveTransition = (transition: TransitionRef | undefined): string => {
    if (!transition) {
        return "[*]";
    }

    if (typeof transition === "string") {
        return transition;
    }

    return transition.nextState;
}

const buildEventState = (state: EventStateDefinition) => {
   const definition  = `class ${state.name} eventNode`;
   const transition = `${state.name} --> ${resolveTransition(state.transition)}`

   return [definition, transition].join("\n");
}

const buildOperationState = (state: OperationStateDefinition) => {
    const definition  = `class ${state.name} operationNode`;
    const transition = `${state.name} --> ${resolveTransition(state.transition)}`
    const onErrorTransitions = state.onErrors?.map(error =>
        `${state.name} --> ${resolveTransition(error.transition)} : ${error.errorRef}`
    ) ?? []

    return [definition, transition, ...onErrorTransitions].join("\n");
}

const buildInjectState = (state: InjectStateDefinition) => {
    const definition  = `class ${state.name} injectNode`;
    const transition = `${state.name} --> ${resolveTransition(state.transition)}`

    return [definition, transition].join("\n");
}

const buildCallbackState = (state: CallbackState) => {
    const definition  = `class ${state.name} callbackNode`;
    const transition = `${state.name} --> ${resolveTransition(state.transition)}`

    return [definition, transition].join("\n");
}

const buildForeachState = (state: ForeachState) => {
    const definition  = `class ${state.name} foreachNode`;
    const transition = `${state.name} --> ${resolveTransition(state.transition)}`

    console.log(state);

    return [definition, transition].join("\n");
}

const buildSwitchState = (state: SwitchStateDefinition) => {
    const definition  = `class ${state.name} switchNode`;
    const defaultTransition = `${state.name} --> ${resolveTransition(state.defaultCondition.transition)}: default`

    const conditionalEventTransitions = state.eventConditions?.map(condition =>
        `${state.name} --> ${resolveTransition(condition.transition)}: ${condition.eventRef}`
    ) ?? [];

    const conditionalDataTransitions = state.dataConditions?.map(condition =>
        `${state.name} --> ${resolveTransition(condition.transition)}: ${condition.name ?? condition.condition}`
    ) ?? [];

    return [definition, defaultTransition, ...conditionalDataTransitions, ...conditionalEventTransitions].join("\n");
}

export const buildMermaidSourceFromJson = (source: string): string => {
    console.log(JSON.parse(source));

    const workflow = JSON.parse(source) as ServerlessWorkflowDefinition;
    const nodes = workflow.states.map(state => {
        switch (state.type) {
            case "event":
                return buildEventState(state);
            case "operation":
                return buildOperationState(state);
            case "inject":
                return buildInjectState(state);
            case "switch":
                return buildSwitchState(state);
            case "callback":
                return buildCallbackState(state);
            case "foreach":
                return buildForeachState(state);
            default:
                return "";
        }
    });

    return `
       stateDiagram-v2
       direction TB
       
       [*] --> ${workflow.start}
       
       ${nodes.join("\n")}
       
       classDef eventNode stroke:#ffaa00
       classDef operationNode stroke:#0099ff
       classDef injectNode stroke:#ff99ff
       classDef switchNode stroke:#00ff99
       classDef callbackNode stroke:#ff0000
       classDef foreachNode stroke:#ff00ff;fill:#ff0000
    `;
};
