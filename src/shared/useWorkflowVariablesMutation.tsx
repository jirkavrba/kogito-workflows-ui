import {useMutation} from "@tanstack/react-query";
import {ServerConfiguration} from "../types/ServerConfiguration.ts";
import {gql, GraphQLClient} from "graphql-request";

export type WorkflowVariablesMutationRequest = {
    id: string;
    variables: string;
};

export const useWorkflowVariablesMutation = (configuration: ServerConfiguration, id: string) => {
    const client = new GraphQLClient(configuration.url)

    return useMutation({
        mutationFn: async (variables: string) => {
            return await client.request<unknown, WorkflowVariablesMutationRequest>(
                gql`
                  mutation handleProcessVariableUpdate(
                    $id: String, 
                    $variables: String
                  ) {  
                    ProcessInstanceUpdateVariables(
                      id: $id,
                      variables: $variables
                    )
                  }
                `,
                {
                    id,
                    variables
                }
            )
        }
    })
};
