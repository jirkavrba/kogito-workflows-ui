import {FC} from "react";
import {CgBolt, CgChevronDoubleRightO, CgCloseO} from "react-icons/cg";

export type ProcessInstanceStatusIconProps = {
    state: string;
    size?: number;
}

export const ProcessInstanceStateIcon: FC<ProcessInstanceStatusIconProps> = ({ state, size = 16}) => {
    switch (state) {
        case "ACTIVE":
            return <CgBolt width={size} height={size}/>

        case "COMPLETED":
            return <CgChevronDoubleRightO width={size} height={size} />

        case "ERROR":
            return <CgCloseO width={size} height={size} />

        default:
            return <></>
    }
}
