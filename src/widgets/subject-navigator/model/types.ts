import type { Node, Edge } from '@xyflow/react';

export type SubjectNodeKind = 'root' | 'quarter' | 'category';

export type SubjectNodeData = {
    label: string;
    path: string;
    kind?: SubjectNodeKind;
    color?: string;
    style?: string;
    size?: number;
};

export type SubjectFlowNode = Node<SubjectNodeData, 'subjectNode'>;

export type FloatingEdgeType = Edge<Record<string, never>, 'floating'>;
