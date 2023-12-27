import {ProcessInstance} from "../types/ProcessInstance.ts";
import {FC, useEffect, useMemo, useRef} from "react";
import {ProcessInstanceStateIcon} from "./ProcessInstanceStateIcon.tsx";
import {stateBorderColors, stateTextColors} from "../helpers/colors.ts";
import {NavLink, useLocation} from "react-router-dom";
import TimeAgo from "react-timeago";
import dateformat from "dateformat";
import {Button, Chip} from "@nextui-org/react";
import {MermaidGraph} from "./MermaidGraph.tsx";
import {buildMermaidSourceFromJson} from "../helpers/graph.ts";
import {ReactZoomPanPinchRef, TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";

export type ProcessInstanceDetailProps = {
    instance: ProcessInstance;
    reload: () => void;
};

export const ProcessInstanceDetail: FC<ProcessInstanceDetailProps> = ({instance, reload}) => {
    const {pathname} = useLocation()
    const graph = useMemo(() => buildMermaidSourceFromJson(instance.source), [instance.source]);
    const graphTransformRef = useRef<ReactZoomPanPinchRef | null>(null);

    useEffect(() => {
        setTimeout(() => {
            graphTransformRef.current?.centerView();
            graphTransformRef.current?.resetTransform();
        }, 100);
    }, []);

    return (
        <div className={`${stateBorderColors[instance.state]} flex flex-col items-stretch justify-start border-t-4 p-8 min-h-screen`}>
            <header className="flex flex-row items-center justify-between pb-4 mb-4 border-b-1 border-default">
                <div>
                    <NavLink to={pathname.split("/instance/")[0]} className="text-xs opacity-50 hover:opacity-100">Return to process instances listing</NavLink>
                    <div className="flex flex-row items-center justify-start gap-4 my-2">
                        <h1 className="text-3xl font-bold my-2">{instance.processName}</h1>
                        <div className={`${stateTextColors[instance.state]} flex flex-row items-center justify-start gap-2`}>
                            <ProcessInstanceStateIcon state={instance.state}/>
                            {instance.state}
                        </div>
                    </div>
                    <div>
                        <Chip color="default" variant="bordered" size="sm" className="my-2">
                            Instance ID: {instance.id}
                        </Chip>
                    </div>
                    <div>
                        {
                            instance.businessKey && (
                                <Chip color="default" size="sm">
                                    Business key: {instance.businessKey}
                                </Chip>
                            )
                        }
                    </div>
                </div>
                <div className="flex flex-col items-end justify-end text-sm gap-1">
                    {/* TODO: umgly :((( */}
                    <p className={`opacity-90 ${((new Date().getTime() - new Date(instance.lastUpdate).getTime()) <= 5 * 60 * 1000) ? "text-warning" : "text-white"}`}>
                        Updated <TimeAgo date={instance.lastUpdate}/>
                        <span className="opacity-50 ml-4 font-mono text-xs hidden lg:inline-block">{dateformat(instance.lastUpdate, 'HH:MM:ss')}</span>
                    </p>
                    <p className="opacity-70">
                        Created <TimeAgo date={instance.start}/>
                        <span className="opacity-50 ml-4 font-mono text-xs hidden lg:inline-block">{dateformat(instance.start, 'HH:MM:ss')}</span>
                    </p>
                    <Button color="primary" className="mt-5" onPress={reload}>Reload data</Button>
                </div>
            </header>
            <main className="grid grid-row grid-cols-4 flex-grow">
                <div>
                    TIMELINE
                </div>

                <div>
                    VARIABLES
                </div>

                <div className="col-span-2 h-full [&>div]:w-full [&>div]:h-full">
                    <TransformWrapper ref={graphTransformRef}>
                        <TransformComponent>
                            <MermaidGraph source={graph}/>
                        </TransformComponent>
                    </TransformWrapper>
                </div>
            </main>
        </div>
    )
};
