import type { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import type { CourseFlowNode } from '../../../model/types';
import './CourseNode.scss';

export function CourseNode({ data }: NodeProps<CourseFlowNode>) {
    return (
        <div className={`courseNode ${data.isCenter ? 'courseNode--center' : ''} ${data.isAddButton ? 'courseNode--add' : ''}`}>
            <Handle
                type="target"
                position={Position.Top}
                className="courseNode__handle"
                style={{ opacity: 0 }}
            />

            <div className="courseNode__content">
                <div className="courseNode__circle">
                    <span className="courseNode__label">{data.label}</span>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="courseNode__handle"
                style={{ opacity: 0 }}
            />
        </div>
    );
}
