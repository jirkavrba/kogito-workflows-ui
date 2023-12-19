import {FC} from "react";
import FeatherIcon from "feather-icons-react";

export type ProcessInstanceStatusIconProps = {
    state: string;
    size?: number;
};

export const ProcessInstanceStateIcon: FC<ProcessInstanceStatusIconProps> = ({ state, size = 16 }) => {
    switch (state) {
        case "ACTIVE":
            return <FeatherIcon icon={"activity"} width={size} height={size}/>;

        case "COMPLETED":
            return <FeatherIcon icon={"check-circle"} width={size} height={size}/>;

        case "ERROR":
            return <FeatherIcon icon={"alert-circle"} width={size} height={size}/>;

        default:
            return <FeatherIcon icon={"help-circle"} width={size} height={size}/>;
    }
}
