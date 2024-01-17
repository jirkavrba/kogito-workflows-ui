import {FC, useEffect, useRef, useState} from "react";
import {instance} from "@viz-js/viz";
import {buildGraphvizSourceFromJson} from "../helpers/graph.ts";
import {ReactZoomPanPinchRef, TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import {Spinner} from "@nextui-org/react";

export type ProcessInstanceGraphProps = {
    source: string;
    selectedNode: string | null;
}

export const ProcessInstanceGraph: FC<ProcessInstanceGraphProps> = ({source, selectedNode}) => {
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
    }, [selectedNode]);

    return (
        <div className="w-full h-[70vh] bg-blue-200 flex flex-col items-stretch justify-stretch">
            <TransformWrapper ref={transform}>
                <TransformComponent>
                    <div className="bg-red-500 w-full h-full" ref={container}/>
                </TransformComponent>
            </TransformWrapper>
        </div>
    )
        ;
}
