import {FC, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {useServerConfiguration} from "../shared/useServerConfiguration.tsx";
import {ServerNavbar} from "../components/servers/ServerNavbar.tsx";
import {buildProcessInstancesFilter, defaultProcessInstancesRequest, processInstancesPerPage, useProcessInstances} from "../shared/useProcessInstances.tsx";
import {ConnectionError} from "../components/listing/ConnectionError.tsx";
import {ProcessInstancesListing} from "../components/listing/ProcessInstancesListing.tsx";
import {Spinner} from "@nextui-org/react";
import {useProcessDefinitions} from "../shared/useProcessDefinitions.tsx";
import {ProcessInstancesFilter} from "../components/listing/ProcessInstancesFilter.tsx";
import {ProcessInstanceState} from "../types/ProcessInstance.ts";
import {LuGithub} from "react-icons/lu";
import {version} from "../version.ts";

const Loader: FC = () => {
    return (
        <div className="flex flex-row justify-center align-center p-20">
            <Spinner size="lg"/>
        </div>
    )
};

export const ServerPage: FC = () => {
    const {connection} = useParams();
    const configuration = useServerConfiguration(connection ?? "");

    const [businessKey, setBusinessKey] = useState<string | null>(null);
    const [processStates, setProcessStates] = useState<Array<ProcessInstanceState> | null>(null);
    const [processNames, setProcessNames] = useState<Array<string> | null>(null);
    const [page, setPage] = useState(0);
    const offset = page * processInstancesPerPage;

    const loadNextPage = () => setPage(current => current + 1);
    const loadPreviousPage = () => setPage(current => Math.max(current - 1, 0));

    const filter = useMemo(() => buildProcessInstancesFilter(
        processNames,
        processStates,
        businessKey,
    ), [processNames, businessKey, processStates]);

    const {data: definitionsResponse, isLoading: definitionsLoading} = useProcessDefinitions(configuration);
    const {data: instancesResponse, isLoading: instancesLoading, error, refetch} = useProcessInstances(configuration, {
        ...defaultProcessInstancesRequest,
        filter,
        offset,
    });

    return (
        <>
            <ServerNavbar configuration={configuration}/>
            <main className="grid grid-cols-3 gap-8 mx-8">
                <div className="col-span-1">
                    {
                        definitionsLoading
                            ? <Loader/>
                            : <ProcessInstancesFilter
                                initialState={{
                                    businessKey,
                                    processStates,
                                    processNames,
                                }}
                                definitions={definitionsResponse?.definitions ?? []}
                                refresh={refetch}
                                onChange={({processNames, processStates, businessKey}) => {
                                    setProcessNames(processNames);
                                    setBusinessKey(businessKey);
                                    setProcessStates(processStates);
                                }}/>
                    }
                    <div className="flex flex-row justify-center items-center my-2 gap-2">
                        <span className="text-xs text-neutral-700">
                            &copy; Jiří Vrba {new Date().getFullYear()} 
                        </span>
                        <span className="text-xs text-neutral-700">
                            version {version}
                        </span>
                        <span className="text-neutral-500">
                            <LuGithub/>
                        </span>
                        <span className="text-xs">
                            <a href="https://github.com/jirkavrba/kogito-workflows-ui" target="_blank" className="text-neutral-700 hover:text-orange-500">
                                Source code
                            </a>
                        </span>
                    </div>
                </div>
                <div className="col-span-2">
                    {
                        error !== null
                            ? <ConnectionError/>
                            : (
                                instancesLoading
                                    ? <Loader/>
                                    : <ProcessInstancesListing
                                        routePrefix={`/server/${configuration.id}`}
                                        instances={instancesResponse?.instances ?? []}
                                        page={page}
                                        loadNextPage={loadNextPage}
                                        loadPreviousPage={loadPreviousPage}
                                    />
                            )
                    }
                </div>
            </main>
        </>
    );
};
