import {v4 as uuid} from "uuid";
import {useMutation} from "@tanstack/react-query";
import {toFormattedJson} from "../helpers/json.ts";

export type TriggerEventRequest = {
    data: string,
    endpoint: string,
    extensions?: { [key: string]: string }
}

export const useTriggerEventMutation = (event: string) => {
    return useMutation({
        mutationFn: async (request: TriggerEventRequest) => {
            const payload = {
                "specversion": "1.0",
                "id": uuid(),
                "type": event,
                "time": new Date().toISOString(),
                "data": JSON.parse(request.data),
                "source": "kogito.vrba.dev",
                ...request.extensions
            };

            await fetch(request.endpoint, {
                method: "post",
                body: toFormattedJson(payload)
            });
        }
    })
};
