import React, {FC} from "react";
import {AggregatedProcessInstance} from "../shared/useProcessInstances.tsx";
import {Card, CardBody, Code, Flex, Heading, Stack, Tag, TagLabel, Text} from "@chakra-ui/react";
import {NavLink} from "react-router-dom";
import {ProcessInstanceStateIcon} from "./ProcessInstanceStateIcon.tsx";
import {processInstanceStateColor} from "../shared/helpers.ts";

const ProcessInstanceItem: FC<AggregatedProcessInstance> = ({id, processName, businessKey, state, start, lastUpdate, error}) => {
    const color = processInstanceStateColor(state);
    return (
        <Card variant="filled" borderLeftColor={`${color}.500`} borderLeftWidth={5}>
            <CardBody>
                <Flex justifyContent="space-between" alignItems="center">
                    <Flex gap={4} justifyContent="start" alignItems="center" flexGrow={1}>
                        <Flex direction="column" justifyContent="start" alignItems="start" gap={2}>
                            <Tag colorScheme={color} size="sm" rounded="full" variant="solid">
                                <ProcessInstanceStateIcon state={state}/>
                                <TagLabel ml={2}>
                                    {state}
                                </TagLabel>
                            </Tag>
                            <Heading size="sm">
                                {processName}
                            </Heading>
                            {businessKey && (
                                <Tag colorScheme={"purple"} rounded={"full"} size={"sm"}>
                                    <TagLabel>{businessKey}</TagLabel>
                                </Tag>
                            )}
                            {error && (
                                <Code fontSize="xs">{error.message}</Code>
                            )}
                        </Flex>
                    </Flex>
                    <Flex direction="column" justifyContent="start" alignItems="end" gap={2}>
                        Started at {start}
                        <Text align="right">
                            Last updated at {lastUpdate}
                        </Text>
                    </Flex>
                </Flex>
            </CardBody>
        </Card>
    )
};

export type ProcessInstancesListingProps = {
    instances: Array<AggregatedProcessInstance>;
}

export const ProcessInstancesListing: FC<ProcessInstancesListingProps> = ({instances}) => {
    return (
        <Stack spacing={5} padding={10}>
            {
                instances.map(instance =>
                    <NavLink to={`instance/${instance.id}`} key={instance.id}>
                        <ProcessInstanceItem {...instance}/>
                    </NavLink>
                )
            }
        </Stack>
    )
};
