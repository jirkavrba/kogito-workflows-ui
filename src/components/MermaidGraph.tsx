import {FC, HTMLAttributes, useEffect, useRef} from "react";
import mermaid from "mermaid";

export type MermaidGraphProps = {
    source: string;
} & HTMLAttributes<HTMLDivElement>;

export const MermaidGraph: FC<MermaidGraphProps> = ({source}) => {
    const renderedElementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mermaid.mermaidAPI.initialize({
            theme: "dark",
            darkMode: true,
            securityLevel : "strict",
        })
    }, []);

    useEffect(() => {
        mermaid.mermaidAPI.render("mermaid", source).then(result => {
            renderedElementRef.current!.innerHTML = "";
            renderedElementRef.current!.innerHTML = result.svg;
        });
    }, [source]);

    console.log(source);

    return <div key="mermaid" ref={renderedElementRef}/>
};
