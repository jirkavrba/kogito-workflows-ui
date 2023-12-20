import {ServerConfiguration} from "../types/ServerConfiguration.ts";
import {gql, GraphQLClient} from "graphql-request";
import {useQuery} from "@tanstack/react-query";


export type ProcessDefinitionsResponse = {
    definitions: Array<ProcessDefinition>
}

export type ProcessDefinition = {
    id: string;
    name: string;
    service?: string;
}

export const useProcessDefinitions = (configuration: ServerConfiguration) => {
    const client = new GraphQLClient(configuration.url)
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
