import {FC, useEffect, useMemo, useRef} from "react";
import {instance} from "@viz-js/viz";
import {buildGraphvizSourceFromJson} from "../../helpers/graph.ts";
import {ReactZoomPanPinchRef, TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import {ProcessInstanceTimelineItem} from "../../types/ProcessInstance.ts";

export type ProcessInstanceGraphProps = {
    source: string;
    timeline: Array<ProcessInstanceTimelineItem>;
}

export const ProcessInstanceGraph: FC<ProcessInstanceGraphProps> = ({source, timeline}) => {
    const firstRender = useRef<boolean>(false);
    const transform = useRef<ReactZoomPanPinchRef | null>(null);
    const container = useRef<HTMLDivElement | null>(null);

    const timelineIterations = useMemo<Record<string, number>>(() =>
            timeline.reduce((acc, current) => {
                const iteration = acc[current.name] ?? 0;
                return {...acc, [current.name]: (iteration + 1)}
            }, {} as Record<string, number>),
        [timeline]
    );

    useEffect(() => {
        const {current} = container;
        if (!current) {
            return;
        }

        instance().then(viz => {
            const svg = viz.renderSVGElement(
                buildGraphvizSourceFromJson(source, timelineIterations)
            );

            if (svg.innerHTML === current.innerHTML) {
                return;
            }

            svg.style.aspectRatio = `${svg.style.width.replace("dt", "")}/${svg.style.height.replace("dt", "")}`
            svg.style.width = "100%";
            svg.style.maxHeight = "70vh"

            current.innerHTML = "";
            current.appendChild(svg);

            if (!firstRender.current) {
                transform.current?.resetTransform();
                transform.current?.centerView();
                firstRender.current = true;
            }
        });

        return () => {
            const {current} = container;
            if (current) {
                current.innerHTML = ""
            }
        };
    }, [source, timelineIterations, container]);

    return (
        <div className="w-full h-[70vh] flex flex-col [&>*]:w-full">
            <TransformWrapper ref={transform}>
                <TransformComponent>
                    <div className="w-full h-[70vh]" ref={container}/>
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
        ;
}
