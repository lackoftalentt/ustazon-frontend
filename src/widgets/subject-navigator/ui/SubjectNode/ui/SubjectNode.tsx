import type { NodeProps } from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';
import type { SubjectFlowNode } from '../../../model/types';
import './SubjectNode.scss';

export function SubjectNode({ data }: NodeProps<SubjectFlowNode>) {
    return (
        <div
            className={`subjectNode ${
                data.isCenter ? 'subjectNode--center' : ''
            } ${data.isAddButton ? 'subjectNode--add' : ''}`}>
            <Handle
                type="target"
                position={Position.Top}
                className="subjectNode__handle"
                style={{ opacity: 0 }}
            />

            <div className="subjectNode__content">
                <div className="subjectNode__circle">
                    <span className="subjectNode__label">{data.label}</span>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="subjectNode__handle"
                style={{ opacity: 0 }}
            />
        </div>
    );
}
