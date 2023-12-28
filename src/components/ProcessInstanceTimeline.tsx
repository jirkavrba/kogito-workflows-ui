import {FC, useMemo} from "react";
import {ProcessInstanceError, ProcessInstanceTimelineItem} from "../types/ProcessInstance.ts";
import {useLocalStorage} from "usehooks-ts";
import {LuArrowDownNarrowWide, LuArrowUpWideNarrow, LuBadgeAlert, LuBadgeCheck, LuCombine, LuFlag, LuFunctionSquare, LuSquareCode, LuTimer, LuZap} from "react-icons/lu";
import TimeAgo from "react-timeago";
import {Button, ButtonGroup, Divider, ScrollShadow} from "@nextui-org/react";

export type ProcessInstanceTimelineProps = {
    timeline: Array<ProcessInstanceTimelineItem>;
    error: ProcessInstanceError | null;
};

const TimelineItemIcon: FC<{ type: string }> = ({type}) => {
    switch (type) {
        case "CompositeContextNode":
            return <LuCombine/>;
        case "StartNode":
            return <LuFlag/>;
        case "EventNode":
            return <LuZap/>;
        case "WorkItemNode":
            return <LuSquareCode/>
        case "ActionNode":
            return <LuFunctionSquare/>;
    }
};

type TimelineItemProps = {
    item: ProcessInstanceTimelineItem;
    error: ProcessInstanceError | null;
};

const TimelineItem: FC<TimelineItemProps> = ({item, error}) => {
    const duration = item.exit !== null ? (new Date(item.exit).getTime() - new Date(item.enter).getTime()) : null;
    const completed = duration !== null;
    const errored = error !== null && item.definitionId == error.nodeDefinitionId && !completed;

    return (
        <>
            <div className="flex flex-row items-center justify-start p-4 gap-4">
                <div className="min-w-4">
                    <TimelineItemIcon type={item.type}/>
                </div>
                <div className="flex flex-col justify-start items-start">
                    <div className={`flex flex-row justify-start items-center gap-1 text-sm font-medium`}>
                        {item.name}
                        {completed && <div className="text-success"><LuBadgeCheck/></div>}
                        {errored && <div className="text-danger"><LuBadgeAlert/></div>}
                    </div>
                    <div className="flex flex-row items-center justify-center gap-2 text-xs mt-2">
                        <TimeAgo date={item.enter}/>
                        <div className="flex flex-row items-center justify-start gap-1 opacity-50 font-mono">
                            {duration !== null && <><LuTimer/>{duration < 1 ? "< 1" : duration} ms</>}
                        </div>
                    </div>
                    {
                        errored && (
                            <div className="font-mono text-danger text-wrap text-xs mt-2 overflow-x-scroll">
                                {error.message}
                            </div>
                        )
                    }
                </div>
            </div>
            <Divider/>
        </>
    )
};

export const ProcessInstanceTimeline: FC<ProcessInstanceTimelineProps> = ({timeline, error}) => {
    const [newestFirst, setNewestFirst] = useLocalStorage<boolean>("instance--newest-first-sort", true);
    const renderedTypes = [
        "CompositeContextNode",
        "StartNode",
        "WorkItemNode",
        "EventNode",
        "ActionNode"
    ];

    const ignoredPrefixes = [
        "Embedded",
        "Script"
    ];

    const sorted = useMemo(() =>
        timeline
            .filter(node => renderedTypes.includes(node.type) && !ignoredPrefixes.some(prefix => node.name.startsWith(prefix)))
            .sort((a, b) => {
                const first = new Date(a.enter).getTime();
                const second = new Date(b.enter).getTime();

                return newestFirst ? (second - first) : (first - second);
            }), [timeline, newestFirst])

    return (
        <div className="flex flex-col gap-4">
            <ButtonGroup>
                <Button size="sm" color={newestFirst ? "primary" : "default"} onClick={() => setNewestFirst(true)}>
                    <LuArrowDownNarrowWide/>
                    Newest first
                </Button>
                <Button size="sm" color={newestFirst ? "default" : "primary"} onClick={() => setNewestFirst(false)}>
                    <LuArrowUpWideNarrow/>
                    Oldest first
                </Button>
            </ButtonGroup>
            <ScrollShadow className="max-h-screen">
                {sorted.map((item, key) =>
                    <TimelineItem item={item} key={key} error={error}/>
                )}
            </ScrollShadow>
        </div>
    );
};
