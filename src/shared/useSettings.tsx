
import { useLocalStorage } from "usehooks-ts";
import { EnabledFeatures, FeatureKey, KogitoWorkflowsUISettings } from "../types/Settings.ts";

const SETTINGS_KEY = "KogitoWorkflowsUISettings";

export const useSettings = () =>
    useLocalStorage<KogitoWorkflowsUISettings>(SETTINGS_KEY, {
        enabledFeatures: []
    });

export const useEnabledFeatures = (): EnabledFeatures => {
    const [settings] = useSettings();

    return {
        isEnabled: (key: FeatureKey) => settings.enabledFeatures.includes(key)
    }
}

export const useFeatureEnabled = (key: FeatureKey) => {
    const [settings] = useSettings();

    return settings.enabledFeatures.includes(key);
}