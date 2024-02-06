import {FC, useMemo} from "react";
import {ProcessInstanceError, ProcessInstanceTimelineItem} from "../types/ProcessInstance.ts";
import {useLocalStorage} from "usehooks-ts";
import {
    LuArrowDownNarrowWide,
    LuArrowUpWideNarrow,
    LuBadgeAlert,
    LuBadgeCheck,
    LuCombine,
    LuEye, LuEyeOff,
    LuFlag,
    LuFunctionSquare,
    LuSplit,
    LuSquareCode,
    LuTimer,
    LuZap
} from "react-icons/lu";
import TimeAgo from "react-timeago";
import {Button, ButtonGroup, Divider, ScrollShadow, Tooltip} from "@nextui-org/react";
import _ from "lodash";

export type ProcessInstanceTimelineProps = {
    error: ProcessInstanceError | null;
    timeline: Array<ProcessInstanceTimelineItem>;
    timelineNavigationEnabled?: boolean;
    onTimelineItemSelect?: (id: string) => void;
};

const TimelineItemIcon: FC<{ type: string, className?: string }> = ({type, className = ""}) => {
    switch (type) {
        case "CompositeContextNode":
            return <LuCombine className={className}/>;
        case "StartNode":
            return <LuFlag className={className}/>;
        case "EventNode":
            return <LuZap className={className}/>;
        case "WorkItemNode":
            return <LuSquareCode className={className}/>
        case "ActionNode":
            return <LuFunctionSquare className={className}/>;
        case "Split":
            return <LuSplit className={className}/>;
    }
};

type TimelineItemProps = {
    item: ProcessInstanceTimelineItem;
    index: number;
    error: ProcessInstanceError | null;
    navigationEnabled?: boolean;
    onSelect?: () => void;
};

const TimelineItem: FC<TimelineItemProps> = (
    {
        item,
        index,
        error,
        navigationEnabled = false,
        onSelect = () => {
        }
    }
) => {
    const duration = item.exit !== null ? (new Date(item.exit).getTime() - new Date(item.enter).getTime()) : null;
    const completed = duration !== null;
    const errored = error !== null && item.definitionId == error.nodeDefinitionId && !completed;

    return (
        <>
            <div className="flex flex-row items-center justify-start p-4 gap-4">
                <div className="min-w-4">
                    <TimelineItemIcon type={item.type} className={completed ? "text-neutral-500" : "text-warning"}/>
                </div>
                {navigationEnabled && (
                    ["CompositeContextNode", "Split"].includes(item.type)
                        ? (
                            <Button size="sm" isIconOnly onPress={onSelect}>
                                <LuEye/>
                            </Button>
                        )
                        : (
                            <Tooltip content="Graph navigation is not supported for this type of node">
                                <Button size="sm" isIconOnly disabled={true} variant="bordered">
                                    <LuEyeOff/>
                                </Button>
                            </Tooltip>
                        )
                )}
                <div className="flex flex-col justify-start items-start flex-grow">
                    <div className={`flex flex-row justify-start items-center gap-1 text-sm font-medium`}>
                        {completed && <div className="text-success"><LuBadgeCheck/></div>}
                        {errored && <div className="text-danger"><LuBadgeAlert/></div>}
                        {item.name}
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
                    <span className="text-default-400 text-xs font-mono mt-1">
                        index: {index} &bull;
                        id: {item.definitionId}
                    </span>
                </div>
            </div>
            <Divider/>
        </>
    )
};

export const ProcessInstanceTimeline: FC<ProcessInstanceTimelineProps> = (
    {
        timeline,
        timelineNavigationEnabled = false,
        onTimelineItemSelect = () => {
        },
        error
    }
) => {
    const [newestFirst, setNewestFirst] = useLocalStorage<boolean>("instance--newest-first-sort", true);
    const sortedTimeline = useMemo(() => {
            const renderedTypes = [
                "CompositeContextNode",
                "StartNode",
                "WorkItemNode",
                "EventNode",
                "ActionNode",
                "Split"
            ];

            const ignoredPrefixes = [
                "Embedded",
                "Script"
            ];

            const sorted = _.sortBy(
                timeline.filter(node => renderedTypes.includes(node.type) && !ignoredPrefixes.some(prefix => node.name.startsWith(prefix))),
                (item: ProcessInstanceTimelineItem) => [new Date(item.enter).getTime(), item.nodeId]
            );

            return newestFirst ? sorted.reverse() : sorted;
        },
        [timeline, newestFirst]
    );

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
            <ScrollShadow className="h-[70vh]">
                {sortedTimeline.map((item, index) =>
                    <TimelineItem item={item}
                                  key={index}
                                  index={newestFirst ? (sortedTimeline.length - index) : (index + 1)}
                                  error={error}
                                  navigationEnabled={timelineNavigationEnabled}
                                  onSelect={() => onTimelineItemSelect(item.name)}/>
                )}
            </ScrollShadow>
        </div>
    );
};
