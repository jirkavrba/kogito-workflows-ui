import {ServerConfiguration} from "../types/ServerConfiguration.ts";
import {gql, GraphQLClient} from "graphql-request";
import {useQuery} from "@tanstack/react-query";

export type ProcessInstanceSource = {
    source: string | null;
}

export type ProcessInstanceSourceResponse = {
    sources: Array<ProcessInstanceSource>
}

export type ProcessInstanceSourceRequest = {
    id: string;
}

export const useProcessInstanceSource = (
    configuration: ServerConfiguration,
    instanceId: string,
) => {
    const client = new GraphQLClient(configuration.url)
    return useQuery({
        refetchOnWindowFocus: false,
        queryKey: [`instances#${configuration.id}#${instanceId}#source`],
        queryFn: async () => {
            return await client.request<
                ProcessInstanceSourceResponse,
                ProcessInstanceSourceRequest
            >(gql`
                query findProcessInstanceSources($id: String!) {
                  sources: ProcessInstances(
                    where: {
                      id: {
                        equal: $id
                      }
                    }
                  ) {
                    source
                  }
                }
            `, {
                id: instanceId
            })
        }
    })
}
