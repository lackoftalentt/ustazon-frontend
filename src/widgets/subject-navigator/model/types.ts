import type { Node, Edge } from '@xyflow/react';

export type SubjectNodeKind = 'root' | 'quarter' | 'category' | 'topic';

export type SubjectNodeData = {
    label: string;
    path: string;
    kind?: SubjectNodeKind;
    color?: string;
    style?: string;
    size?: number;
    isCenter?: boolean;
    isAddButton?: boolean;
};

export type SubjectFlowNode = Node<SubjectNodeData, 'subjectNode'>;

export type FloatingEdgeType = Edge<Record<string, never>, 'floating'>;

export interface TopicItem {
    id: number;
    topic: string;
}
