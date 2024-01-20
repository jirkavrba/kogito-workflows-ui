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
   const definition  = `${state.name} [id = "node-${state.name}", shape = box, color = "#fde047", fontcolor="#fef9c3", label = "⚡ ${state.name}"]`;
   const transition = `${state.name} -> ${resolveTransition(state.transition)} [taillabel = "${state.onEvents?.flatMap(it => it.eventRefs).join(", ")}"]`

   return [definition, transition].join("\n");
}

const buildOperationState = (state: OperationStateDefinition) => {
    const definition  = `${state.name} [id = "node-${state.name}", shape = box, color = "#67e8f9", fontcolor="#cffafe", label = "🛠️ ${state.name}"]`;
    const transition = `${state.name} -> ${resolveTransition(state.transition)}`
    const onErrorTransitions = state.onErrors?.map(error =>
        `${state.name} -> ${resolveTransition(error.transition)} [color = "#f43f5e", fontcolor = "#fda4af", style = dashed, label="⚠️ ${error.errorRef}"]`
    ) ?? []

    return [definition, transition, ...onErrorTransitions].join("\n");
}

const buildInjectState = (state: InjectStateDefinition) => {
    const definition  = `${state.name} [id = "node-${state.name}", shape = box, color = "#a3e635", fontcolor = "#d9f99d", label = "💉 ${state.name}"]`;
    const transition = `${state.name} -> ${resolveTransition(state.transition)}`

    return [definition, transition].join("\n");
}

const buildCallbackState = (state: CallbackState) => {
    const definition  = `${state.name} [id = "node-${state.name}", shape = box, color = "#fb923c", fontcolor="#fed7aa", label = "🛎️ ${state.name}"]`;
    const transition = `${state.name} -> ${resolveTransition(state.transition)}`

    return [definition, transition].join("\n");
}

const buildForeachState = (state: ForeachState) => {
    const definition  = `${state.name} [id = "node-${state.name}", shape = box, color = "#713f12", fontcolor="#fed7aa", label = "🔄 ${state.name}"]`;
    const transition = `${state.name} -> ${resolveTransition(state.transition)}`

    return [definition, transition].join("\n");
}

const buildSwitchState = (state: SwitchStateDefinition) => {
    const definition  = `${state.name} [id = "node-${state.name}", shape = hexagon, color = "#4ade80", fontcolor="#bbf7d0", label = "❔ ${state.name}"]`;
    const defaultTransition = `${state.name} -> ${resolveTransition(state.defaultCondition.transition)} [style = dashed, label = "default"]`

    const conditionalEventTransitions = state.eventConditions?.map(condition =>
        `${state.name} -> ${resolveTransition(condition.transition)} [label = "⚡ ${condition.eventRef}", color = "#A59430", fontcolor="#FFF3AA"]`
    ) ?? [];

    const conditionalDataTransitions = state.dataConditions?.map(condition =>
        `${state.name} -> ${resolveTransition(condition.transition)} [label = "🧩 ${condition.name ?? condition.condition}", color = "#c4b5fd", fontcolor="#c4b5fd"]`
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

            // TODO: Parallel states!

            default:
                return "";
        }
    });

    return `
       digraph {
           bgcolor = black
           
           node [color = white, fontcolor = white, fontname = "sans-serif", fontsize = "10pt"]
           edge [color = "#888888", fontcolor="#aaaaaa", labelfontcolor = "#aaaaaa", fontname = "sans-serif", fontsize = "10pt"]
            
           start [shape = doublecircle]
           start -> ${workflow.start}
       
           ${nodes.join("\n\n")}
           
           end [shape = doublecircle]
       }
    `;
};
