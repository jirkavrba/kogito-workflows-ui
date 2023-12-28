import {ProcessInstance} from "../types/ProcessInstance.ts";
import {FC, useEffect, useMemo, useRef, useState} from "react";
import {ProcessInstanceStateIcon} from "./ProcessInstanceStateIcon.tsx";
import {stateBorderColors, stateTextColors} from "../helpers/colors.ts";
import {NavLink, useLocation} from "react-router-dom";
import TimeAgo from "react-timeago";
import dateformat from "dateformat";
import {Button, Chip, Tab, Tabs} from "@nextui-org/react";
import {MermaidGraph} from "./MermaidGraph.tsx";
import {buildMermaidSourceFromJson} from "../helpers/graph.ts";
import {ReactZoomPanPinchRef, TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import {ProcessInstanceTimeline} from "./ProcessInstanceTimeline.tsx";
import {LuArrowLeft, LuRefreshCcw} from "react-icons/lu";
import {ProcessInstanceVariablesEditor} from "./ProcessInstanceVariablesEditor.tsx";

export type ProcessInstanceDetailProps = {
    instance: ProcessInstance;
    source: string | null;
    reload: () => void;
};

export const ProcessInstanceDetail: FC<ProcessInstanceDetailProps> = ({instance, source, reload}) => {
    const {pathname} = useLocation()
    const graph = useMemo(() => source !== null ? buildMermaidSourceFromJson(source) : null, [source]);
    const graphTransformRef = useRef<ReactZoomPanPinchRef | null>(null);
    const [selectedTab, setSelectedTab] = useState("variables");

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
                    <div className="flex flex-row items-center justify-start gap-4 my-2">
                        <NavLink to={pathname.split("/instance/")[0]} className="opacity-50 hover:opacity-100 text-2xl">
                            <LuArrowLeft/>
                        </NavLink>
                        <h1 className="text-3xl font-bold my-2">
                            {instance.processName}
                        </h1>
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
                    <p className="opacity-90">
                        Updated <TimeAgo date={instance.lastUpdate}/>
                        <span className="opacity-50 ml-4 font-mono text-xs hidden lg:inline-block">{dateformat(instance.lastUpdate, 'HH:MM:ss')}</span>
                    </p>
                    <p className="opacity-70">
                        Created <TimeAgo date={instance.start}/>
                        <span className="opacity-50 ml-4 font-mono text-xs hidden lg:inline-block">{dateformat(instance.start, 'HH:MM:ss')}</span>
                    </p>
                    <Button color="primary" className="mt-5" onPress={reload}>
                        <LuRefreshCcw/>
                        Refresh
                    </Button>
                </div>
            </header>
            <main className="grid grid-row grid-cols-5 flex-grow gap-4">
                <div>
                    <ProcessInstanceTimeline timeline={instance.timeline} error={instance.error}/>
                </div>

                <div className="col-span-4 2k:hidden">
                    <Tabs
                        color="primary"
                        variant="solid"
                        selectedKey={selectedTab}
                        onSelectionChange={(key) => setSelectedTab(key as string)}
                    >
                        <Tab key="variables" title="Workflow variables">
                            <ProcessInstanceVariablesEditor variables={instance.variables}/>
                        </Tab>
                        {graph && (
                            <Tab key="graph" title="Workflow graph">
                                <div className="flex flex-col">
                                    <div className="col-span-2 h-full [&>div]:w-full [&>div]:h-full">
                                        <TransformWrapper ref={graphTransformRef}>
                                            <TransformComponent>
                                                <MermaidGraph source={graph}/>
                                            </TransformComponent>
                                        </TransformWrapper>
                                    </div>
                                </div>
                            </Tab>
                        )}
                    </Tabs>
                </div>

                <div className="hidden grid-cols-2 col-span-4 2k:grid">
                    <div className={graph ? "col-span-1" : "col-span-2"}>
                        <ProcessInstanceVariablesEditor variables={instance.variables}/>
                    </div>
                    {graph && (
                        <div className="flex flex-col">
                            <div className="col-span-2 h-full [&>div]:w-full [&>div]:h-full">
                                <TransformWrapper ref={graphTransformRef}>
                                    <TransformComponent>
                                        <MermaidGraph source={graph}/>
                                    </TransformComponent>
                                </TransformWrapper>
                            </div>
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
};
