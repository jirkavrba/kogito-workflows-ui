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
        return "end";
    }

    if (typeof transition === "string") {
        return transition;
    }

    return transition.nextState;
}

const buildEventState = (state: EventStateDefinition) => {
   const definition  = `${state.name} [id = "${state.name}", shape = box]`;
   const transition = `${state.name} -> ${resolveTransition(state.transition)}`

   return [definition, transition].join("\n");
}

const buildOperationState = (state: OperationStateDefinition) => {
    const definition  = `${state.name} [id = "${state.name}", shape = box, color = blue]`;
    const transition = `${state.name} -> ${resolveTransition(state.transition)}`
    const onErrorTransitions = state.onErrors?.map(error =>
        `${state.name} -> ${resolveTransition(error.transition)} [color = red, style = dashed]`
    ) ?? []

    return [definition, transition, ...onErrorTransitions].join("\n");
}

const buildInjectState = (state: InjectStateDefinition) => {
    const definition  = `${state.name} [id = "${state.name}", shape = box, color = lightblue]`;
    const transition = `${state.name} -> ${resolveTransition(state.transition)}`

    return [definition, transition].join("\n");
}

const buildCallbackState = (state: CallbackState) => {
    const definition  = `${state.name} [id = "${state.name}", shape = ellipse]`;
    const transition = `${state.name} -> ${resolveTransition(state.transition)}`

    return [definition, transition].join("\n");
}

const buildForeachState = (state: ForeachState) => {
    const definition  = `${state.name} [shape = circle]`;
    const transition = `${state.name} -> ${resolveTransition(state.transition)}`

    return [definition, transition].join("\n");
}

const buildSwitchState = (state: SwitchStateDefinition) => {
    const definition  = `${state.name} [shape = hexagon, color = lightgreen]`;
    const defaultTransition = `${state.name} -> ${resolveTransition(state.defaultCondition.transition)} [style = dashed, label = "default"]`

    const conditionalEventTransitions = state.eventConditions?.map(condition =>
        `${state.name} -> ${resolveTransition(condition.transition)} [label = "${condition.eventRef}"]`
    ) ?? [];

    const conditionalDataTransitions = state.dataConditions?.map(condition =>
        `${state.name} -> ${resolveTransition(condition.transition)} [label = "${condition.name ?? condition.condition}"]`
    ) ?? [];

    return [definition, defaultTransition, ...conditionalDataTransitions, ...conditionalEventTransitions].join("\n");
}

export const buildGraphvizSourceFromJson = (source: string): string => {
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
       digraph {
           start [shape = circle]
           start -> ${workflow.start}
       
           ${nodes.join("\n\n")}
       }
    `;
};
