import dateformat from "dateformat";
import TimeAgo from "react-timeago";
import {FC, useMemo} from "react";
import {NavLink} from "react-router-dom";
import {ProcessInstanceStateIcon} from "./ProcessInstanceStateIcon.tsx";
import {Button, Card, CardBody, Chip} from "@nextui-org/react";
import {AggregatedProcessInstance} from "../types/ProcessInstance.ts";
import {stateBorderColors, stateTextColors} from "../helpers/colors.ts";


const ProcessInstanceItem: FC<AggregatedProcessInstance> =
    ({
         id,
         processName,
         businessKey,
         state,
         start,
         lastUpdate,
         error,
         nodes
     }) => {
        const errorNode = useMemo(() => error && nodes.find(it => it.definitionId === error.nodeDefinitionId), [error, nodes]);
        return (
            <Card className={`${stateBorderColors[state]} border-l-4 rounded-lg transition transform hover:-translate-x-4`}>
                <CardBody>
                    <div className="flex flex-col items-start justify-start gap-2">
                        <div className="flex flex-row items-start justify-between self-stretch">
                            <div className="flex flex-col items-start justify-start gap-2">
                                <div className={`flex flex-row items-center gap-2 text-xs ${stateTextColors[state]}`}>
                                    <ProcessInstanceStateIcon state={state} size={12}/>
                                    {state}
                                </div>
                                <h1 className="text-lg font-bold ml-2">{processName}</h1>
                            </div>
                            <div className="flex flex-col items-end justify-end text-sm gap-1">
                                <p className="opacity-90">
                                    Updated <TimeAgo date={lastUpdate}/>
                                    <span className="opacity-50 ml-4 font-mono text-xs hidden lg:inline-block">{dateformat(lastUpdate, 'HH:MM:ss')}</span>
                                </p>
                                <p className="opacity-50">
                                    Created <TimeAgo date={start}/>
                                    <span className="opacity-50 ml-4 font-mono text-xs hidden lg:inline-block">{dateformat(start, 'HH:MM:ss')}</span>
                                </p>
                            </div>
                        </div>
                        {businessKey !== null
                            ? (
                                <Chip color="default" size="sm">
                                    {businessKey}
                                </Chip>
                            )
                            : (
                                <Chip color="default" variant="bordered" size="sm">
                                    {id}
                                </Chip>
                            )
                        }
                    </div>

                    {error && (
                        <div className="bg-default-100 mt-4 my-2 p-4 rounded-xl text-xs text-danger font-mono">
                            <div className="text-white font-sans mb-1">Error:</div>
                            <div>{error.message}</div>

                            {errorNode && (<Chip color="danger" variant="dot" size="sm" className="mt-4">{errorNode.name}</Chip>)}
                        </div>
                    )}
                </CardBody>
            </Card>
        )
    };

export type ProcessInstancesListingProps = {
    instances: Array<AggregatedProcessInstance>;
    page: number,
    loadNextPage: () => void;
    loadPreviousPage: () => void;
}

export const ProcessInstancesListing: FC<ProcessInstancesListingProps> = ({instances, page, loadNextPage, loadPreviousPage}) => {
    return (
        <div className="flex flex-col items-stretch justify-start gap-4">
            {page > 0 && (
                <div className="flex flex-row items-center justify-center">
                    <Button onPress={loadPreviousPage}>
                        Load newer process instances
                    </Button>
                </div>
            )}
            {
                instances.map(instance =>
                    <NavLink to={`instance/${instance.id}`} key={instance.id}>
                        <ProcessInstanceItem {...instance}/>
                    </NavLink>
                )
            }
            <div className="flex flex-row items-center justify-center">
                <Button onPress={loadNextPage}>
                    Load older process instances
                </Button>
            </div>
        </div>
    )
};
