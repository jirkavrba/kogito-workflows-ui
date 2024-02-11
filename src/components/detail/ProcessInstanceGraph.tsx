import {FC, useEffect, useRef} from "react";
import {instance} from "@viz-js/viz";
import {buildGraphvizSourceFromJson} from "../../helpers/graph.ts";
import {ReactZoomPanPinchRef, TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";

export type ProcessInstanceGraphProps = {
    source: string;
    selectedNode: string | null;
    selectedNodeTimestamp: Date | null;
}

export const ProcessInstanceGraph: FC<ProcessInstanceGraphProps> = ({source, selectedNode = null, selectedNodeTimestamp = null}) => {
    const transform = useRef<ReactZoomPanPinchRef | null>(null);
    const container = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const { current } = container;
        if (!current) {
            return;
        }

        instance().then(viz => {
            const svg = viz.renderSVGElement(
                buildGraphvizSourceFromJson(source)
            );

            svg.style.aspectRatio = `${svg.style.width.replace("dt", "")}/${svg.style.height.replace("dt", "")}`
            svg.style.width = "100%";
            svg.style.maxHeight = "70vh"

            current.innerHTML = "";
            current.appendChild(svg);

            transform.current?.resetTransform();
            transform.current?.centerView();
        });

        return () => {
            const {current} = container;
            if (current) {
                current.innerHTML = ""
            }
        };
    }, [source, container]);

    useEffect(() => {
        const node = document.getElementById(`node-${selectedNode}`) as HTMLElement | null;

        if (selectedNode && node) {
            const polygon = node.querySelector("polygon");

            transform.current?.zoomToElement(node, 1.25);

            if (polygon) {
                const originalColor = polygon.style.color;
                const originalFill = polygon.style.fill;

                polygon.style.color = "#000000";
                polygon.style.fill = "#ffffff";

                setTimeout(() => {
                    polygon.style.color = originalColor;
                    polygon.style.fill = originalFill;
                }, 1000);
            }

        }
    }, [selectedNode, selectedNodeTimestamp]);

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
