import {FC, useEffect, useMemo, useState} from "react";
import {DiffEditor, Editor, useMonaco} from "@monaco-editor/react";
import {Button, ButtonGroup, Modal, ModalBody, ModalContent, Spinner, Tooltip, useDisclosure} from "@nextui-org/react";
import {LuDiff, LuSave, LuTrash, LuUndoDot} from "react-icons/lu";
import {useWorkflowVariablesMutation} from "../shared/useWorkflowVariablesMutation.tsx";
import {ServerConfiguration} from "../types/ServerConfiguration.ts";
import {useQueryClient} from "@tanstack/react-query";
import {useLocalStorage} from "usehooks-ts";
import {WorkflowVariablesSnapshot} from "../types/Editors.ts";

export type ProcessInstanceVariablesEditorProps = {
    id: string;
    variables: object;
    configuration: ServerConfiguration;
    processName: string;
};

const validate = (json: string) => {
    try {
        JSON.parse(json);
        return true
    } catch {
        return false;
    }
}

const jsonEquals = (first: string, second: string) => {
    return JSON.stringify(JSON.parse(first)) === JSON.stringify(JSON.parse(second));
}

export const ProcessInstanceVariablesEditor: FC<ProcessInstanceVariablesEditorProps> = ({variables, configuration, id, processName}) => {
    const monaco = useMonaco();

    const [originalValue, setOriginalValue] = useState(JSON.stringify(variables, null, 2));
    const [updatedValue, setUpdatedValue] = useState(originalValue)

    const updatedValueValid = useMemo(() => validate(updatedValue), [updatedValue]);
    const pendingChanges = useMemo(() => updatedValueValid && !jsonEquals(originalValue, updatedValue), [updatedValueValid, originalValue, updatedValue]);

    const {isOpen: updatedValueDiffOpen, onOpen: openUpdatedValueDiff, onClose: closeUpdatedValueDiff} = useDisclosure();

    const [allSnapshots, setSnapshots] = useLocalStorage<Array<WorkflowVariablesSnapshot>>("wf-variables-snapshots", []);
    const snapshots = useMemo(() => allSnapshots.filter(it => it.processName === processName), [allSnapshots, processName]);
    const [selectedSnapshot, setSelectedSnapshot] = useState<WorkflowVariablesSnapshot | null>(null);

    const createSnapshot = () => {
        const id = snapshots.length === 0 ? 0 : (Math.max(...snapshots.map(it => it.id)) + 1);
        const snapshot = {
            id,
            processName,
            json: originalValue,
            createdAt: new Date(),
        }

        setSnapshots(current => [...current, snapshot]);
    };

    const deleteSnapshot = (id: number) => {
        setSnapshots(current => current.filter(it => it.id !== id));
    }

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
        const formatted = JSON.stringify(variables, null, 2);

        setOriginalValue(formatted);

        if (!pendingChanges) {
            setUpdatedValue(formatted)
        }
    }, [variables, pendingChanges]);

    useEffect(() => {
        monaco?.editor?.defineTheme("kogito", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {
                "editor.background": "#000000"
            }
        })
    }, [monaco]);

    // TODO: Split this into separate components

    return (
        <>
            {!updatedValueValid && (
                <div className="flex flex-col items-start justify-start bg-danger p-4 rounded-lg mb-2">
                    <h3 className="text-sm font-medium">Invalid JSON</h3>
                    <p className="text-xs">Updating workflow variables will fail.</p>
                </div>
            )}
            {!pendingChanges && (
                <div className="mb-3">
                    <Button size="sm" onClick={createSnapshot}>Create a new snapshot of the workflow variables</Button>
                    {snapshots.map(snapshot =>
                        <ButtonGroup size="sm" className="mx-2">
                            <Button disabled onPress={() => setSelectedSnapshot(snapshot)} key={snapshot.id}>Snapshot {snapshot.id + 1}</Button>
                            <Tooltip content="Restore the current state to this snapshot">
                                <Button isIconOnly onPress={() => updateWorkflowVariables(snapshot.json)} key={snapshot.id}><LuUndoDot/></Button>
                            </Tooltip>
                            <Tooltip content="Diff against the current state">
                                <Button isIconOnly onPress={() => setSelectedSnapshot(snapshot)} key={snapshot.id}><LuDiff/></Button>
                            </Tooltip>
                            <Button isIconOnly onClick={() => deleteSnapshot(snapshot.id)}><LuTrash/></Button>
                        </ButtonGroup>
                    )}

                </div>
            )}
            {pendingChanges && (
                <div className="flex flex-row items-center justify-between bg-default-100 p-2 px-4 rounded-lg mb-2">
                    <h3 className="text-sm font-medium">
                        Workflow variables changed
                    </h3>
                    <ButtonGroup>
                        <Button onClick={() => setUpdatedValue(originalValue)} disabled={isPending}>
                            <LuTrash/>
                            Discard changes
                        </Button>
                        <Button onClick={openUpdatedValueDiff} disabled={isPending}>
                            <LuDiff/>
                            View diff
                        </Button>
                        <Button color="primary" onClick={() => updateWorkflowVariables(updatedValue)} isLoading={isPending} disabled={isPending}>
                            <LuSave/>
                            Save
                        </Button>
                    </ButtonGroup>
                </div>
            )}
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
                    bracketPairColorization: {
                        enabled: false
                    }
                }}
                height="70vh"
            />
            {
                updatedValueDiffOpen && (
                    <Modal isOpen={updatedValueDiffOpen} onClose={closeUpdatedValueDiff} size="full">
                        <ModalContent>
                            <ModalBody>
                                <DiffEditor
                                    className="m-8"
                                    language={"json"}
                                    original={JSON.stringify(JSON.parse(originalValue), null, 2)}
                                    modified={JSON.stringify(JSON.parse(updatedValue), null, 2)}
                                    theme="kogito"
                                    options={{
                                        readOnly: true,
                                        lineNumbers: "off",
                                        contextmenu: false,
                                        cursorSmoothCaretAnimation: "on",
                                        bracketPairColorization: {
                                            enabled: false
                                        }
                                    }}
                                />
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                )
            }
            {selectedSnapshot !== null && (
                <Modal isOpen={true} onClose={() => setSelectedSnapshot(null)} size="full">
                    <ModalContent>
                        <ModalBody>
                            <DiffEditor
                                className="m-8"
                                language={"json"}
                                modified={JSON.stringify(JSON.parse(originalValue), null, 2)}
                                original={JSON.stringify(JSON.parse(selectedSnapshot!.json), null, 2)}
                                theme="kogito"
                                options={{
                                    readOnly: true,
                                    lineNumbers: "off",
                                    contextmenu: false,
                                    cursorSmoothCaretAnimation: "on",
                                    bracketPairColorization: {
                                        enabled: false
                                    }
                                }}
                            />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
}
