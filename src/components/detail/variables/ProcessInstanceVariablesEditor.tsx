import {FC, useEffect, useMemo, useState} from "react";
import {Editor} from "@monaco-editor/react";
import {Button, ButtonGroup, Spinner, useDisclosure} from "@nextui-org/react";
import {LuDiff, LuSave, LuUndo} from "react-icons/lu";
import {useWorkflowVariablesMutation} from "../../../shared/useWorkflowVariablesMutation.tsx";
import {ServerConfiguration} from "../../../types/ServerConfiguration.ts";
import {useQueryClient} from "@tanstack/react-query";
import {ProcessInstanceVariablesSnapshots} from "./ProcessInstanceVariablesSnapshots.tsx";
import {isValidJson, jsonEquals, toFormattedJson} from "../../../helpers/json.ts";
import {DiffModal} from "../DiffModal.tsx";

export type ProcessInstanceVariablesEditorProps = {
    id: string;
    variables: object;
    processName: string;
    configuration: ServerConfiguration;
};


export const ProcessInstanceVariablesEditor: FC<ProcessInstanceVariablesEditorProps> = ({variables, configuration, id, processName}) => {
    const [originalValue, setOriginalValue] = useState(toFormattedJson(variables));
    const [updatedValue, setUpdatedValue] = useState(originalValue)

    const updatedValueValid = useMemo(() => isValidJson(updatedValue), [updatedValue]);
    const pendingChanges = useMemo(() => !jsonEquals(originalValue, updatedValue), [originalValue, updatedValue]);

    const {isOpen: updatedValueDiffOpen, onOpen: openUpdatedValueDiff, onClose: closeUpdatedValueDiff} = useDisclosure();
    const {mutate, isPending} = useWorkflowVariablesMutation(configuration, id);

    const client = useQueryClient();

    const updateWorkflowVariables = (value: string = "") => {
        const updated = value.length > 0 ? value : updatedValue;
        const minified = JSON.stringify(JSON.parse(updated));
        mutate(minified, {
            onSuccess: () => {
                setOriginalValue(updated);
                setUpdatedValue(updated);
                setTimeout(async () => {
                    await client.invalidateQueries({
                        queryKey: [`instances#${configuration.id}#${id}`]
                    })
                }, 250);
            }
        })
    };

    useEffect(() => {
        try {
            const formatted = toFormattedJson(variables);

            setOriginalValue(formatted);

            if (!pendingChanges) {
                setUpdatedValue(formatted)
            }
        } catch {
            console.error("Not valid json")
        }
    }, [variables, pendingChanges]);

    return (
        <>
            <div>
                {
                    !pendingChanges
                        ? <ProcessInstanceVariablesSnapshots
                            processName={processName}
                            workflowVariables={originalValue}
                            updateWorkflowVariables={updateWorkflowVariables}
                        />
                        : (
                            <div className="flex flex-row items-center justify-between bg-default-100 p-2 px-4 rounded-lg mb-2">
                                <h3 className="text-sm font-medium">
                                    Workflow variables changed
                                </h3>
                                <ButtonGroup>
                                    <Button onClick={() => setUpdatedValue(originalValue)} disabled={isPending}>
                                        <LuUndo/>
                                        Discard changes
                                    </Button>
                                    <Button onClick={openUpdatedValueDiff} disabled={isPending || !updatedValueValid}>
                                        <LuDiff/>
                                        {updatedValueValid ? "View diff" : "Invalid JSON"}
                                    </Button>
                                    <Button color={updatedValueValid ? "primary" : "default"} onClick={() => updateWorkflowVariables(updatedValue)} isLoading={isPending}
                                            disabled={isPending || !updatedValueValid}>
                                        <LuSave/>
                                        {updatedValueValid ? "Save" : "Invalid JSON"}
                                    </Button>
                                </ButtonGroup>
                            </div>
                        )
                }
            </div>
            <Editor
                language="json"
                value={updatedValue}
                loading={<Spinner size="lg"/>}
                theme={"vs-dark"}
                className="rounded-lg [&>*]:rounded-lg mr-4"
                onChange={(value) => setUpdatedValue(value ?? "")}
                options={{
                    lineNumbers: "off",
                    theme: "vs-dark",
                    contextmenu: false,
                    cursorSmoothCaretAnimation: "on",
                    stickyScroll: true
                }}
                height="70vh"
            />
            {
                updatedValueDiffOpen && (
                    <DiffModal
                        onClose={closeUpdatedValueDiff}
                        originalValue={originalValue}
                        updatedValue={updatedValue}
                    />
                )
            }
        </>
    );
}
