import {ServerConfiguration} from "../types/ServerConfiguration.ts";
import {gql, GraphQLClient} from "graphql-request";
import {useQuery} from "@tanstack/react-query";
import {AggregatedProcessInstance, ProcessInstanceArgument, ProcessInstanceState} from "../types/ProcessInstance.ts";

export type AggregatedProcessInstancesResponse = {
    instances: Array<AggregatedProcessInstance>
}

export type AggregatedProcessInstancesRequest = {
    offset: number;
    states: Array<ProcessInstanceState>;
    filter: ProcessInstanceArgument;
}

export const defaultProcessInstancesRequest: AggregatedProcessInstancesRequest = {
    offset: 0,
    states: ["ABORTED", "ACTIVE", "COMPLETED", "ERROR", "SUSPENDED"],
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
    businessKey: string | Array<string> | null,
): ProcessInstanceArgument => {
    return {
        and: [
            buildStringArgumentFilter(name, "processName"),
            buildStringArgumentFilter(businessKey, "businessKey")
        ]
    }
}

export const useProcessInstances = (
    configuration: ServerConfiguration,
    request: AggregatedProcessInstancesRequest = defaultProcessInstancesRequest
) => {
    const client = new GraphQLClient(configuration.url)
    return useQuery({
        queryKey: [`instances#${configuration.id}`, request],
        queryFn: async () => {
            return await client.request<
                AggregatedProcessInstancesResponse,
                AggregatedProcessInstancesRequest
            >(gql`
                query getProcessInstances(
                  $offset: Int,
                  $filter: ProcessInstanceArgument
                ) {
                  instances: ProcessInstances(
                    where: $filter, 
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
