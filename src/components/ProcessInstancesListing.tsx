import {FC} from "react";
import {AggregatedProcessInstance} from "../shared/useProcessInstances.tsx";
import {NavLink} from "react-router-dom";
import {ProcessInstanceStateIcon} from "./ProcessInstanceStateIcon.tsx";
import {Card, CardBody, Chip} from "@nextui-org/react";

const stateTextColors = {
    "ACTIVE": "text-success",
    "COMPLETED": "text-default",
    "ERROR": "text-danger",
};

const stateBorderColors = {
    "ACTIVE": "border-success",
    "COMPLETED": "border-default",
    "ERROR": "border-danger",
};

const ProcessInstanceItem: FC<AggregatedProcessInstance> = ({id, processName, businessKey, state, start, lastUpdate, error}) => {
    return (
        <Card className={`${stateBorderColors[state]} border-l-2`}>
            <CardBody>
                <div className="flex flex-col items-start justify-start gap-2">
                    <div className="flex flex-row items-start justify-between">
                        <div className="flex flex-col items-start justify-start gap-2">
                            <div className={`flex flex-row items-center gap-2 text-xs ${stateTextColors[state]}`}>
                                <ProcessInstanceStateIcon state={state} size={12}/>
                                {state}
                            </div>
                            <h1 className="text-lg font-bold">{processName}</h1>
                        </div>
                    </div>
                    {businessKey !== null
                        ? (
                            <Chip color="default" size="sm">
                                {businessKey}
                            </Chip>
                        )
                        : (
                            <Chip color="primary" size="sm">
                                {id}
                            </Chip>
                        )
                    }
                </div>

                {error && (
                    <div className="bg-default-100 my-2 p-2 rounded-lg text-xs text-danger font-mono">
                        {error.message}
                    </div>
                )}
            </CardBody>
        </Card>
    )
};

export type ProcessInstancesListingProps = {
    instances: Array<AggregatedProcessInstance>;
}

export const ProcessInstancesListing: FC<ProcessInstancesListingProps> = ({instances}) => {
    return (
        <div className="flex flex-row gap-4 p-4">
            <div className="flex-[1]">
                <h1>Filters</h1>
            </div>
            <div className="flex-[2] flex flex-col items-stretch justify-start gap-4">
                {
                    instances.map(instance =>
                        <NavLink to={`instance/${instance.id}`} key={instance.id}>
                            <ProcessInstanceItem {...instance}/>
                        </NavLink>
                    )
                }
            </div>
        </div>
    )
};
