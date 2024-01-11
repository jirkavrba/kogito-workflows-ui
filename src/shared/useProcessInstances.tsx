import {ServerConfiguration} from "../types/ServerConfiguration.ts";
import {gql, GraphQLClient} from "graphql-request";
import {useQuery} from "@tanstack/react-query";
import {AggregatedProcessInstance, availableProcessInstanceStates, ProcessInstanceArgument, ProcessInstanceState} from "../types/ProcessInstance.ts";

export type AggregatedProcessInstancesResponse = {
    instances: Array<AggregatedProcessInstance>
}

export type AggregatedProcessInstancesRequest = {
    offset: number;
    filter: ProcessInstanceArgument;
}

export const defaultProcessInstancesRequest: AggregatedProcessInstancesRequest = {
    offset: 0,
    filter: {}
};

const buildStringArgumentFilter = (
    name: string | Array<string> | null,
    property: "processName" | "businessKey"
): ProcessInstanceArgument => {
    if (name === null) {
        return {
            or: [
                {[property]: {isNull: true}},
                {[property]: {like: "*"}},
            ]
        }
    }

    if (Array.isArray(name)) {
        return {
            [property]: {
                in: name
            }
        }
    }

    return {
        [property]: {
            like: `*${name}*`
        }
    }
};

export const buildProcessInstancesFilter = (
    name: string | Array<string> | null,
    states: Array<ProcessInstanceState> | null,
    businessKey: string | Array<string> | null,
): ProcessInstanceArgument => {
    return {
        and: [
            buildStringArgumentFilter(name, "processName"),
            buildStringArgumentFilter(businessKey, "businessKey"),
            {
                state: {
                    in: (states === null || states.length === 0 ? availableProcessInstanceStates : states)
                }
            }
        ]
    }
}

export const processInstancesPerPage = 10

export const useProcessInstances = (
    configuration: ServerConfiguration,
    request: AggregatedProcessInstancesRequest = defaultProcessInstancesRequest
) => {
    const client = new GraphQLClient(configuration.url)
    return useQuery({
        queryKey: [`instances#${configuration.id}`, request],
        refetchInterval: 5000,
        refetchIntervalInBackground: true,
        queryFn: async () => {
            return await client.request<
                AggregatedProcessInstancesResponse,
                AggregatedProcessInstancesRequest
            >(gql`
                query getProcessInstances(
                  $offset: Int,
                  $filter: ProcessInstanceArgument,
                ) {
                  instances: ProcessInstances(
                    where: $filter,
                    orderBy: {
                      lastUpdate: DESC
                    }, 
                    pagination: {
                      limit: ${processInstancesPerPage}, 
                      offset: $offset
                    }
                  ) {
                    id
                    processName
                    businessKey
                    state
                    start
                    lastUpdate
                     nodes {
                      name 
                      definitionId
                    }
                    error {
                      message
                      nodeDefinitionId
                    }
                  }
                }
            `, request)
        }
    })
}
