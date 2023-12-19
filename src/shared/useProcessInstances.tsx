import {ServerConfiguration} from "../types/ServerConfiguration.ts";
import {gql, GraphQLClient} from "graphql-request";
import {useQuery} from "@tanstack/react-query";


export type AggregatedProcessInstancesResponse = {
    instances: Array<AggregatedProcessInstance>
}

export type ProcessInstanceError = {
    message: string;
}

export type AggregatedProcessInstance = {
    id: string;
    processName: string;
    businessKey: string | null;
    state: string;
    start: string;
    lastUpdate: string;
    error: ProcessInstanceError | null;
}

export type AggregatedProcessInstancesRequest = {
    offset: number;
    states: Array<string>;
}

const defaultRequest: AggregatedProcessInstancesRequest = {
    offset: 0,
    states: [
        "ABORTED",
        "ACTIVE",
        "COMPLETED",
        "ERROR",
        "SUSPENDED",
    ]
};

export const useProcessInstances = (configuration: ServerConfiguration, request: AggregatedProcessInstancesRequest = defaultRequest) => {
    const client = new GraphQLClient(configuration.url)
    return useQuery({
        queryKey: [`instances#${configuration.id}`, request],
        queryFn: async () => {
            return await client.request<
                AggregatedProcessInstancesResponse,
                AggregatedProcessInstancesRequest
            >(gql`
                query getProcessInstances($offset: Int, $states: [ProcessInstanceState]) {
                  instances: ProcessInstances(
                      where: {
                        state: {
                          in: $states
                        }
                      },
                      orderBy: {
                        lastUpdate: DESC 
                      },
                      pagination: {
                        limit: 100,
                        offset: $offset
                      }
                  ) {
                    id
                    processName
                    businessKey
                    state
                    start
                    lastUpdate
                    error {
                        message
                    }
                  }
                }
            `, request)
        }
    })
}
