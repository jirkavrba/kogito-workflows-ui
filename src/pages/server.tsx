import {FC, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import {useServerConfiguration} from "../shared/useServerConfiguration.tsx";
import {ServerNavbar} from "../components/ServerNavbar.tsx";
import {buildProcessInstancesFilter, defaultProcessInstancesRequest, useProcessInstances} from "../shared/useProcessInstances.tsx";
import {ConnectionError} from "../components/ConnectionError.tsx";
import {ProcessInstancesListing} from "../components/ProcessInstancesListing.tsx";
import {Spinner} from "@nextui-org/react";
import {useProcessDefinitions} from "../shared/useProcessDefinitions.tsx";
import {ProcessInstancesFilter} from "../components/ProcessInstancesFilter.tsx";
import {ProcessInstanceState} from "../types/ProcessInstance.ts";
import {LuGitlab} from "react-icons/lu";

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

    const [names, setNames] = useState<Array<string> | null>(null);
    const [businessKey, setBusinessKey] = useState<string | null>(null);
    const [processStates, setProcessStates] = useState<Array<ProcessInstanceState> | null>(null);

    const filter = useMemo(() => buildProcessInstancesFilter(
        names,
        processStates,
        businessKey,
    ), [names, businessKey, processStates]);

    const {data: definitionsResponse, isLoading: definitionsLoading} = useProcessDefinitions(configuration);
    const {data: instancesResponse, isLoading: instancesLoading, error, refetch} = useProcessInstances(configuration, {
        ...defaultProcessInstancesRequest,
        filter,
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
                                definitions={definitionsResponse?.definitions ?? []}
                                refresh={refetch}
                                onChange={({processNames, processStates, businessKey}) => {
                                    setNames(processNames);
                                    setBusinessKey(businessKey);
                                    setProcessStates(processStates);
                                }}/>
                    }
                    <div className="flex flex-row justify-center items-center my-2 gap-2">
                        <span className="text-xs text-neutral-700">&copy; Jiří Vrba {new Date().getFullYear()}</span>
                        <span className="text-neutral-500">
                            <LuGitlab/>
                        </span>
                        <span className="text-xs">
                            <a href="https://gitlab.com/jirkavrba/kogito-workflows-ui" target="_blank" className="text-neutral-700 hover:text-orange-500">
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
                                    : <ProcessInstancesListing instances={instancesResponse?.instances ?? []}/>
                            )
                    }
                </div>
            </main>
        </>
    );
};
