import {FC, useEffect, useMemo, useState} from "react";
import {ProcessDefinition} from "../../shared/useProcessDefinitions.tsx";
import {Autocomplete, AutocompleteItem, Button, Card, CardBody, Input, Select, SelectItem} from "@nextui-org/react";
import {LuRefreshCcw} from "react-icons/lu";
import {availableProcessInstanceStates, ProcessInstanceState} from "../../types/ProcessInstance.ts";
import {sortBy, uniqBy} from "lodash";

export type ProcessInstancesFilterState = {
    processNames: Array<string> | null,
    processStates: Array<ProcessInstanceState> | null,
    businessKey: string | null
}

export type ProcessInstancesFilterProps = {
    initialState: ProcessInstancesFilterState;
    definitions: Array<ProcessDefinition>;
    onChange?: (state: ProcessInstancesFilterState) => void;
    refresh: () => void;
};

export const ProcessInstancesFilter: FC<ProcessInstancesFilterProps> = ({definitions, onChange, refresh, initialState}) => {
    const [state, setState] = useState<ProcessInstancesFilterState>(initialState);
    const sortedDefinitions = useMemo(() => uniqBy(sortBy(definitions, it => it.name), it => it.name), [definitions]);

    useEffect(() => void onChange?.(state), [onChange, state]);

    return (
        <Card>
            <h1 className="text-xl font-bold text-center my-4">Filter process instances</h1>
            <CardBody className="flex flex-col gap-4">
                <Autocomplete
                    label="Process definition"
                    placeholder="All process definitions"
                    defaultItems={state.processNames?.filter(it => it !== null)}
                    onSelectionChange={(value) => {
                        const process = sortedDefinitions.find(it => it.id == value)?.name ?? ""
                        void setState(current => ({
                            ...current,
                            processNames: process.trim().length === 0
                                ? null
                                : [process]
                        }))
                    }}>
                    {sortedDefinitions.map((definition) =>
                        <AutocompleteItem key={definition.id} value={definition.name}>
                            {definition.name}
                        </AutocompleteItem>
                    )}
                </Autocomplete>
                <Select
                    selectionMode="multiple"
                    label="Process instance states"
                    placeholder="All process instance states"
                    defaultSelectedKeys={state.processStates?.filter(it => it !== null)}
                    onChange={(event) =>
                        void setState(current => ({
                            ...current,
                            processStates: event.target.value.trim().length === 0
                                ? null
                                : (event.target.value.split(",") as Array<ProcessInstanceState>)
                        }))
                    }>
                    {availableProcessInstanceStates.map((state) =>
                        <SelectItem key={state} value={state}>
                            {state}
                        </SelectItem>
                    )}
                </Select>

                <Input
                    label="Business key"
                    placeholder="Fuzzy search is enabled by default"
                    defaultValue={state.businessKey ?? ""}
                    onChange={(event) =>
                        void setState(current => ({
                            ...current,
                            businessKey: event.target.value.trim().length === 0
                                ? null
                                : event.target.value
                        }))
                    }/>

                <Button onClick={refresh} size={"lg"}>
                    <LuRefreshCcw/>
                    Refresh
                </Button>
            </CardBody>
        </Card>
    )
};
