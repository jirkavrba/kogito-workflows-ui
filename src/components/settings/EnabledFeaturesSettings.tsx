import { FC } from "react";
import { FeatureKey } from "../../types/Settings";
import { EnabledFeatureToggle } from "./EnabledFeatureToggle";

export type EnabledFeaturesSettingsProps = {
    enabledFeatures: Array<FeatureKey>,
    setEnabledFeatures: (features: Array<FeatureKey>) => void,
};

export const EnabledFeaturesSettings: FC<EnabledFeaturesSettingsProps> = ({ enabledFeatures, setEnabledFeatures }) => {
    const definitions: Array<{ key: FeatureKey, name: string }> = [
        {
            key: "variables",
            name: "Variables editor",
        }
    ];

    return (
        <div>
            {definitions.map(definition =>
                <div>
                    <EnabledFeatureToggle
                        name={definition.name}
                        value={enabledFeatures.includes(definition.key)}
                        onChange={(enabled) => setEnabledFeatures(
                            enabled
                                ? [...enabledFeatures, definition.key]
                                : [...enabledFeatures].filter(it => it !== definition.key)
                        )}
                    />
                </div>
            )}
        </div>
    );
}