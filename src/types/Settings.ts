export type FeatureKey = "variables";

export type KogitoWorkflowsUISettings = {
  readonly enabledFeatures: Array<FeatureKey>;
};

export type EnabledFeatures = {
  readonly isEnabled: (key: FeatureKey) => boolean;
};
