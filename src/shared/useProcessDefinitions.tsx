import {ServerConfiguration} from "../types/ServerConfiguration.ts";
import {gql, GraphQLClient} from "graphql-request";
import {useQuery} from "@tanstack/react-query";
import {resolveConfiguredHeaders} from "../helpers/headers.ts";


export type ProcessDefinitionsResponse = {
    definitions: Array<ProcessDefinition>
}

export type ProcessDefinition = {
    id: string;
    name: string;
    service?: string;
}

export const useProcessDefinitions = (configuration: ServerConfiguration) => {
    const client = new GraphQLClient(configuration.url, {headers: resolveConfiguredHeaders(configuration)});
    return useQuery({
        queryKey: [`definitions#${configuration.id}`],
        queryFn: async () => {
            return await client.request<ProcessDefinitionsResponse>(gql`
                query {
                  definitions: ProcessDefinitions {
                    id,
                    name,
                    service: serviceUrl
                  }
                }
            `)
        }
    })
}
