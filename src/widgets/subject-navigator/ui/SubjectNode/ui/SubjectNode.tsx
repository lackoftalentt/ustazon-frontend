import type { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import type { SubjectFlowNode } from '../../../model/types';

export function SubjectNode({ data }: NodeProps<SubjectFlowNode>) {
    return (
        <div className={`subjectNode ${data.style ?? 'secondary'}`}>
            <Handle
                type="target"
                position={Position.Top}
                className="subjectNode__handle"
            />

            <div className="subjectNode__circle" />

            <div className="subjectNode__label">{data.label}</div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="subjectNode__handle"
            />
        </div>
    );
}
