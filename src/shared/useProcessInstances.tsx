import {ServerConfiguration} from "../types/ServerConfiguration.ts";
import {gql, GraphQLClient} from "graphql-request";
import {useQuery} from "@tanstack/react-query";

export type AggregatedProcessInstancesRequest = {
    offset: number;
}

export type AggregatedProcessInstancesResponse = {
    ProcessInstances: Array<AggregatedProcessInstance>
}

export type AggregatedProcessInstance = {
    id: string;
    name: string;
    key: string | null;
    state: string;
    start: string;
    lastUpdate: string;
}


export const useProcessInstances = (configuration: ServerConfiguration, offset: number = 0) => {
    const client = new GraphQLClient(configuration.url)
    return useQuery({
        queryKey: [`instances#${configuration.id}`],
        queryFn: async () => {
            return await client.request<
                AggregatedProcessInstancesResponse,
                AggregatedProcessInstancesRequest
            >(gql`
                query getProcessInstances($offset: Int) {
                  instances: ProcessInstances(
                      orderBy: {
                        lastUpdate: DESC 
                      },
                      pagination: {
                        limit: 100,
                        offset: $offset
                      }
                  ) {
                    id
                    name: processName
                    key: businessKey
                    state
                    start
                    lastUpdate
                  }
                }
            `, { offset })
        }
    })
}
