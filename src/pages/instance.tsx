import {FC, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useServerConfiguration} from "../shared/useServerConfiguration.tsx";
import {ServerNavbar} from "../components/ServerNavbar.tsx";
import {Spinner} from "@nextui-org/react";
import {useProcessInstance} from "../shared/useProcessInstance.tsx";
import {ProcessInstanceDetail} from "../components/ProcessInstanceDetail.tsx";

const Loader: FC = () => {
    return (
        <div className="flex flex-row justify-center align-center p-20">
            <Spinner size="lg"/>
        </div>
    )
};

export const ProcessInstancePage: FC = () => {
    const navigate = useNavigate();
    const {connection, processInstanceId} = useParams();
    const configuration = useServerConfiguration(connection ?? "");
    const {data: response, isLoading, error, refetch} = useProcessInstance(configuration, processInstanceId ?? "");
    const [instance] = response?.instances ?? [];

    useEffect(() => {
        if ((!isLoading && typeof instance === "undefined") || error) {
            navigate("../..");
        }
    }, [navigate, isLoading, instance, error]);

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
