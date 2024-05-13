import {FC, useMemo, useState} from "react";
import {Button, ButtonGroup, Tooltip} from "@nextui-org/react";
import {LuDiff, LuTrash, LuUndoDot} from "react-icons/lu";
import {useLocalStorage} from "usehooks-ts";
import {WorkflowVariablesSnapshot} from "../../../types/Editors.ts";
import {formatJson} from "../../../helpers/json.ts";
import {DiffModal} from "../DiffModal.tsx";
import {useKeyPress} from "../../../shared/useKeyPress.ts";

export type ProcessInstanceVariablesSnapshotsProps = {
    processName: string;
    workflowVariables: string;
    updateWorkflowVariables: (value: string) => void;
};
export const ProcessInstanceVariablesSnapshots: FC<ProcessInstanceVariablesSnapshotsProps> = ({processName, workflowVariables, updateWorkflowVariables}) => {
    const [snapshots, setSnapshots] = useLocalStorage<Array<WorkflowVariablesSnapshot>>("wf-variables-snapshots", []);
    const workflowSnapshots = useMemo(() => snapshots.filter(it => it.processName === processName), [snapshots, processName]);
    const [selectedSnapshot, setSelectedSnapshot] = useState<WorkflowVariablesSnapshot | null>(null);

    const createSnapshot = () => {
        const id = workflowSnapshots.length === 0 ? 0 : (Math.max(...workflowSnapshots.map(it => it.id)) + 1);
        const snapshot = {
            id,
            processName,
            json: workflowVariables,
            createdAt: new Date(),
        }

        setSnapshots(current => [...current, snapshot]);
    };

    const deleteSnapshot = (id: number) => {
        setSnapshots(current => current.filter(it => it.id !== id));
    }

    useKeyPress("s", () => {
        createSnapshot();
    });

    return (
        <>
            <div className="mb-3">
                <Button onClick={createSnapshot}>
                    Create a new snapshot of the workflow variables
                </Button>
                {workflowSnapshots.map(snapshot =>
                    <ButtonGroup className="mx-2">
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
            {selectedSnapshot !== null && (
                <DiffModal
                    onClose={() => setSelectedSnapshot(null)}
                    originalValue={formatJson(selectedSnapshot.json)}
                    updatedValue={formatJson(workflowVariables)}
                />
            )}
        </>
    );
};
