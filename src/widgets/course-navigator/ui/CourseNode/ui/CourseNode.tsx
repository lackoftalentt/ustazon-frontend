import type { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import type { CourseFlowNode } from '../../../model/types';

export function CourseNode({ data }: NodeProps<CourseFlowNode>) {
    return (
        <div className={`courseNode ${data.style ?? 'secondary'}`}>
            <Handle
                type="target"
                position={Position.Top}
                className="courseNode__handle"
            />

            <div className="courseNode__circle" />

            <div className="courseNode__label">{data.label}</div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="courseNode__handle"
            />
        </div>
    );
}
