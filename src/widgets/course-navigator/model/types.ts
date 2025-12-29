import type { Node, Edge } from '@xyflow/react';

export type CourseNodeKind = 'root' | 'quarter' | 'category' | 'topic';

export type CourseNodeData = {
    label: string;
    path: string;
    kind?: CourseNodeKind;
    color?: string;
    style?: string;
    size?: number;
    isCenter?: boolean;
    isAddButton?: boolean;
};

export type CourseFlowNode = Node<CourseNodeData, 'courseNode'>;

export type FloatingEdgeType = Edge<Record<string, never>, 'floating'>;
