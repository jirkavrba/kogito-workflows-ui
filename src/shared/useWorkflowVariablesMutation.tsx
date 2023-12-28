import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ServerConfiguration} from "../types/ServerConfiguration.ts";
import {gql, GraphQLClient} from "graphql-request";

export type WorkflowVariablesMutationRequest = {
    id: string;
    variables: string;
};

export const useWorkflowVariablesMutation = (configuration: ServerConfiguration, id: string) => {
    const client = new GraphQLClient(configuration.url)
    const queryClient = useQueryClient();

    return useMutation({
        onSuccess: () => {
          queryClient.invalidateQueries({
              queryKey: [`instances#${configuration.id}#${id}`]
          })
        },
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
