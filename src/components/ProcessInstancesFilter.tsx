import {FC, useEffect, useState} from "react";
import {ProcessDefinition} from "../shared/useProcessDefinitions.tsx";
import {Card, CardBody, Input, Select, SelectItem} from "@nextui-org/react";

type ProcessInstancesFilterState = {
    processNames: Array<string> | null,
    businessKey: string | null
}


export type ProcessInstancesFilterProps = {
    definitions: Array<ProcessDefinition>;
    onChange?: (state: ProcessInstancesFilterState) => void;
};

export const ProcessInstancesFilter: FC<ProcessInstancesFilterProps> = ({definitions, onChange}) => {
    const [state, setState] = useState<ProcessInstancesFilterState>({
        processNames: null,
        businessKey: null,
    });

    useEffect(() => void onChange?.(state), [onChange, state]);

    return (
        <Card>
            <h1 className="text-xl font-bold text-center my-4">Filter process instances</h1>
            <CardBody className="flex flex-col gap-4">
                <Select
                    selectionMode="multiple"
                    label="Process definition"
                    placeholder="All process definitions"
                    onChange={(event) =>
                        void setState(current => ({
                            ...current,
                            processNames: event.target.value.trim().length === 0
                                ? null
                                : event.target.value.split(",")
                        }))
                    }>
                    {definitions.map((definition) =>
                        <SelectItem key={definition.name} value={definition.name}>
                            {definition.name}
                        </SelectItem>
                    )}
                </Select>

                <Input
                    label="Business key"
                    placeholder="Fuzzy search is enabled by default"
                    onChange={(event) =>
                    void setState(current => ({
                        ...current,
                        businessKey: event.target.value.trim().length === 0
                            ? null
                            : event.target.value
                    }))
                }/>
            </CardBody>
        </Card>
    )
};
