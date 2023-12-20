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

    const filter = useMemo(() => buildProcessInstancesFilter(
        names,
        businessKey,
    ), [names, businessKey]);

    const {data: definitionsResponse, isLoading: definitionsLoading} = useProcessDefinitions(configuration);
    const {data: instancesResponse, isLoading: instancesLoading, error} = useProcessInstances(configuration, {
        ...defaultProcessInstancesRequest, filter
    });

    return (
        <>
            <ServerNavbar configuration={configuration}/>
            <main className="grid grid-cols-3 gap-8 mx-8">
            {/*<main className="flex flex-row items-start justify-start gap-8 px-8">*/}
                <div className="col-span-1">
                    {
                        definitionsLoading
                            ? <Loader/>
                            : <ProcessInstancesFilter
                                definitions={definitionsResponse?.definitions ?? []}
                                onChange={({processNames, businessKey}) => {
                                    setNames(processNames);
                                    setBusinessKey(businessKey);
                                }}/>
                    }
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
