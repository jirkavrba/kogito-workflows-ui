import { Switch } from "@nextui-org/react";
import { FC } from "react";

export type EnabledFeatureToggleProps = {
    name: string,
    value: boolean;
    onChange: (value: boolean) => void;
};

export const EnabledFeatureToggle: FC<EnabledFeatureToggleProps> = ({ name, value, onChange }) => {
    return (
        <div className="my-2">
            <Switch defaultSelected={value} onChange={(event) => onChange(event.target.checked)}>
                {name}
            </Switch>
        </div>
    );
};