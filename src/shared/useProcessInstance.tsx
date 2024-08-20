import { ServerConfiguration } from "../types/ServerConfiguration.ts";
import { gql, GraphQLClient } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { ProcessInstance } from "../types/ProcessInstance.ts";

export type ProcessInstanceResponse = {
  instances: Array<ProcessInstance>
}

export type ProcessInstanceRequest = {
  id: string;
}

export const useProcessInstance = (
  configuration: ServerConfiguration,
  instanceId: string,
  includeVariables: boolean = false
) => {
  const client = new GraphQLClient(configuration.url)
  return useQuery({
    queryKey: [`instances#${configuration.id}#${instanceId}#${includeVariables ? "with-variables" : "without-variables"}`],
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
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
                    state
                    start
                    ${includeVariables ? "variables" : ""}
                    lastUpdate
                    endpoint
                    serviceUrl
                  }
                }
            `, {
        id: instanceId
      })
    }
  })
}
