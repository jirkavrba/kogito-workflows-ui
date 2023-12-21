import {ProcessInstance} from "../types/ProcessInstance.ts";
import {FC} from "react";
import {ProcessInstanceStateIcon} from "./ProcessInstanceStateIcon.tsx";
import {stateBorderColors, stateTextColors} from "../helpers/colors.ts";
import {NavLink, useLocation} from "react-router-dom";
import TimeAgo from "react-timeago";
import dateformat from "dateformat";
import {Chip} from "@nextui-org/react";

export type ProcessInstanceDetailProps = {
    instance: ProcessInstance
};

export const ProcessInstanceDetail: FC<ProcessInstanceDetailProps> = ({instance}) => {
    const {pathname} = useLocation()

    return (
        <main className={`${stateBorderColors[instance.state]} flex flex-col items-stretch justify-start border-t-4 p-8`}>
            <header className="flex flex-row items-center justify-between mb-4">
                <div>
                    <NavLink to={pathname.split("/instance/")[0]} className="text-xs opacity-50 hover:opacity-100">Return to process instances listing</NavLink>
                    <h1 className="text-3xl font-bold my-2">{instance.processName}</h1>
                    <Chip color="default" variant="bordered" size="sm" className="mr-2">
                        Instance ID: {instance.id}
                    </Chip>
                    {
                        instance.businessKey && (
                            <Chip color="default" size="sm">
                                {instance.businessKey}
                            </Chip>
                        )
                    }
                    <div className={`${stateTextColors[instance.state]} flex flex-row items-center justify-start gap-2 my-2`}>
                        <ProcessInstanceStateIcon state={instance.state}/>
                        {instance.state}
                    </div>
                </div>

                <div className="flex flex-col items-end justify-end text-sm gap-1">
                    <p className="opacity-90">
                        Updated <TimeAgo date={instance.lastUpdate}/>
                        <span className="opacity-50 ml-4 font-mono text-xs hidden lg:inline-block">{dateformat(instance.lastUpdate, 'HH:MM:ss')}</span>
                    </p>
                    <p className="opacity-50">
                        Created <TimeAgo date={instance.start}/>
                        <span className="opacity-50 ml-4 font-mono text-xs hidden lg:inline-block">{dateformat(instance.start, 'HH:MM:ss')}</span>
                    </p>
                </div>
            </header>
        </main>
    )
};
