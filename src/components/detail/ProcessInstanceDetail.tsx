import { ProcessInstance } from "../../types/ProcessInstance.ts";
import { FC, useState } from "react";
import { ProcessInstanceStateIcon } from "./ProcessInstanceStateIcon.tsx";
import { stateBorderColors, stateTextColors } from "../../helpers/colors.ts";
import { NavLink, useLocation } from "react-router-dom";
import TimeAgo from "react-timeago";
import dateformat from "dateformat";
import { Button, ButtonGroup, Spinner, Tab, Tabs, Tooltip } from "@nextui-org/react";
import { ProcessInstanceTimeline } from "./timeline/ProcessInstanceTimeline.tsx";
import { LuArrowLeft, LuCopy, LuRefreshCcw } from "react-icons/lu";
import { ProcessInstanceVariablesEditor } from "./variables/ProcessInstanceVariablesEditor.tsx";
import { ServerConfiguration } from "../../types/ServerConfiguration.ts";
import { ProcessInstancesListing } from "../listing/ProcessInstancesListing.tsx";
import { defaultProcessInstancesRequest, processInstancesPerPage, useProcessInstances } from "../../shared/useProcessInstances.tsx";
import { useLocalStorage } from "usehooks-ts";
import { useFeatureEnabled } from "../../shared/useSettings.tsx";
import { ProcessInstanceVariablesPlaceholder } from "./variables/ProcessInstanceVariablesPlaceholder.tsx";

export type ProcessInstanceDetailProps = {
    instance: ProcessInstance;
    configuration: ServerConfiguration;
    reload: () => void;
};

export const ProcessInstanceDetail: FC<ProcessInstanceDetailProps> = ({ instance, configuration, reload }) => {
    const { pathname } = useLocation()
    const variablesEnabled = useFeatureEnabled("variables");

    const [selectedSmallScreenTab, setSelectedSmallScreenTab] = useLocalStorage("small-screen-tab", "graph");
    const [selectedLargeScreenTab, setSelectedLargeScreenTab] = useLocalStorage("large-screen-tab", "correlations");

    const [correlatedWorkflowsPage, setCorrelatedWorkflowsPage] = useState(0);
    const loadNextPage = () => setCorrelatedWorkflowsPage(current => current + 1);
    const loadPreviousPage = () => setCorrelatedWorkflowsPage(current => Math.max(current - 1, 0));
    const { data: correlatedInstancesResponse, isLoading: correlatedInstancesLoading } = useProcessInstances(configuration, {
        ...defaultProcessInstancesRequest,
        filter: {
            and: [
                {
                    businessKey: {
                        equal: instance.businessKey ?? ""
                    },
                },
                {
                    not: {
                        id: {
                            equal: instance.id
                        }
                    }
                }
            ]
        },
        offset: correlatedWorkflowsPage * processInstancesPerPage
    });

    return (
        <div className={`${stateBorderColors[instance.state]} flex flex-col items-stretch justify-start border-t-4 p-8`}>
            <header className="flex flex-row items-center justify-between pb-4 mb-4 border-b-1 border-default">
                <div>
                    <div className="flex flex-row items-center justify-start gap-4 my-2">
                        <NavLink to={pathname.split("/instance/")[0]} className="opacity-50 hover:opacity-100 text-2xl">
                            <LuArrowLeft />
                        </NavLink>
                        <h1 className="text-3xl font-bold my-2">
                            {instance.processName}
                        </h1>
                        <div className={`${stateTextColors[instance.state]} flex flex-row items-center justify-start gap-2`}>
                            <ProcessInstanceStateIcon state={instance.state} />
                            {instance.state}
                        </div>
                    </div>
                    <div className="mb-2">
                        <Tooltip content="Process instance ID">
                            <Button size="sm" onClick={() => navigator.clipboard.writeText(instance.id)}>
                                {instance.id}
                                <LuCopy />
                            </Button>
                        </Tooltip>
                    </div>
                    {instance.businessKey && (
                        <Tooltip content="Process business key">
                            <>
                                <ButtonGroup>
                                    {
                                        instance.businessKey.split("#").map(((part, i) =>
                                            <>
                                                <Button key={i} size="sm" onClick={() => navigator.clipboard.writeText(part)}>
                                                    {part}
                                                    <LuCopy />
                                                </Button>
                                            </>
                                        ))
                                    }
                                </ButtonGroup>

                                <Button size="sm" color="primary" className="ml-2" onClick={() => navigator.clipboard.writeText(instance.businessKey!)}>
                                    Copy full business key
                                    <LuCopy />
                                </Button>
                            </>
                        </Tooltip>
                    )}
                </div>
                <div className="flex flex-col items-end justify-end text-sm gap-1">
                    <p className="opacity-90">
                        Updated <TimeAgo date={instance.lastUpdate} />
                        <span className="opacity-50 ml-4 font-mono text-xs hidden lg:inline-block">{dateformat(instance.lastUpdate, 'HH:MM:ss')}</span>
                    </p>
                    <p className="opacity-70">
                        Created <TimeAgo date={instance.start} />
                        <span className="opacity-50 ml-4 font-mono text-xs hidden lg:inline-block">{dateformat(instance.start, 'HH:MM:ss')}</span>
                    </p>
                    <Button color="primary" className="mt-5" onPress={reload}>
                        <LuRefreshCcw />
                        Refresh
                    </Button>
                </div>
            </header>
            <main className="grid grid-row grid-cols-4 fullhd:grid-cols-5 flex-grow gap-4">
                <div>
                    <ProcessInstanceTimeline
                        id={instance.id}
                        configuration={configuration}
                        serviceUrl={instance.serviceUrl}
                        timeline={instance.timeline}
                        error={instance.error}
                    />
                </div>

                <div className="col-span-3 fullhd:hidden">
                    <Tabs
                        color="primary"
                        variant="solid"
                        selectedKey={selectedSmallScreenTab}
                        onSelectionChange={(key) => setSelectedSmallScreenTab(key as string)}
                    >
                        <Tab key="variables" title={
                            <div>
                                Workflow variables
                            </div>
                        }>
                            {
                                variablesEnabled
                                    ? <ProcessInstanceVariablesEditor
                                        configuration={configuration}
                                        variables={instance.variables}
                                        processName={instance.processName}
                                        id={instance.id}
                                    />
                                    : <ProcessInstanceVariablesPlaceholder />
                            }
                        </Tab>
                        <Tab key="correlations" title={
                            <div>
                                Correlated workflows
                            </div>
                        }>
                            {
                                correlatedInstancesLoading
                                    ? <Spinner />
                                    : <ProcessInstancesListing
                                        routePrefix={`/server/${configuration.id}`}
                                        instances={correlatedInstancesResponse?.instances ?? []}
                                        page={correlatedWorkflowsPage}
                                        loadNextPage={loadNextPage}
                                        loadPreviousPage={loadPreviousPage}
                                    />
                            }
                        </Tab>
                    </Tabs>
                </div>

                <div className="hidden grid-cols-2 col-span-4 fullhd:grid">
                    <div>
                        {
                            variablesEnabled
                                ? <ProcessInstanceVariablesEditor
                                    configuration={configuration}
                                    variables={instance.variables}
                                    processName={instance.processName}
                                    id={instance.id}
                                />
                                : <ProcessInstanceVariablesPlaceholder />
                        }
                    </div>

                    <div className="flex flex-col">
                        <Tabs
                            color="primary"
                            variant="solid"
                            selectedKey={selectedLargeScreenTab}
                            onSelectionChange={(key) => setSelectedLargeScreenTab(key as string)}
                        >
                            <Tab key="correlations" title={
                                <div>
                                    Correlated workflows
                                </div>
                            }>
                                <h2 className="text-xs text-center font-medium uppercase tracking-wide my-4">Correlated workflows</h2>
                                {
                                    correlatedInstancesLoading
                                        ? <Spinner />
                                        : <ProcessInstancesListing
                                            routePrefix={`/server/${configuration.id}`}
                                            instances={correlatedInstancesResponse?.instances ?? []}
                                            page={correlatedWorkflowsPage}
                                            loadNextPage={loadNextPage}
                                            loadPreviousPage={loadPreviousPage}
                                        />
                                }
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </main>
        </div>
    )
};
