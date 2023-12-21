import {ServerConfiguration} from "../types/ServerConfiguration.ts";
import {gql, GraphQLClient} from "graphql-request";
import {useQuery} from "@tanstack/react-query";
import {ProcessInstance} from "../types/ProcessInstance.ts";

export type ProcessInstanceResponse = {
    instances: Array<ProcessInstance>
}

export type ProcessInstanceRequest = {
    id: string;
}

export const useProcessInstance = (
    configuration: ServerConfiguration,
    instanceId: string,
) => {
    const client = new GraphQLClient(configuration.url)
    return useQuery({
        queryKey: [`instances#${configuration.id}#${instanceId}`],
        queryFn: async () => {
            return await client.request<
                ProcessInstanceResponse,
                ProcessInstanceRequest
            >(gql`
                query findProcessInstance($id: String!) {
                  instances: ProcessInstances(
                    where: {
                      id: {
                        equal: $id
                      }
                    }
                  ) {
                    id
                    processId
                    processName
                    businessKey
                    error {
                      message
                      nodeDefinitionId
                    }
                    timeline: nodes {
                      id
                      name
                      nodeId
                      definitionId
                      type
                      enter
                      exit
                    }
                    source
                    state
                    start
                    lastUpdate
                  }
                }
            `, {
                id: instanceId
            })
        }
    })
}
