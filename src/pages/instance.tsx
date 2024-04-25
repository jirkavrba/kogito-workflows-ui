import {FC, useCallback, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useServerConfiguration} from "../shared/useServerConfiguration.tsx";
import {ServerNavbar} from "../components/servers/ServerNavbar.tsx";
import {Spinner} from "@nextui-org/react";
import {useProcessInstance} from "../shared/useProcessInstance.tsx";
import {ProcessInstanceDetail} from "../components/detail/ProcessInstanceDetail.tsx";

const Loader: FC = () => {
    return (
        <div className="flex flex-row justify-center align-center p-20">
            <Spinner size="lg"/>
        </div>
    )
};

export const ProcessInstancePage: FC = () => {
    const {connection, processInstanceId} = useParams();
    const configuration = useServerConfiguration(connection ?? "");
    const {data: response, isLoading, error, refetch} = useProcessInstance(configuration, processInstanceId ?? "");
    const [instance] = response?.instances ?? [];

    const navigate = useNavigate();
    const returnToListing = useCallback(() => navigate(`/server/${connection}`), [navigate, connection]);

    useEffect(() => {
        if ((!isLoading && typeof instance === "undefined") || error) {
            returnToListing();
        }
    }, [returnToListing, isLoading, instance, error]);

    return (
        <>
            <ServerNavbar configuration={configuration}/>
            {
                isLoading
                    ? <Loader/>
                    : <ProcessInstanceDetail
                        instance={instance}
                        configuration={configuration}
                        reload={refetch}
                    />
            }
        </>
    );
};
