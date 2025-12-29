import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    type NodeMouseHandler,
    Background,
    BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useNavigate } from 'react-router-dom';
import { FloatingEdge } from '../../FloatingEdge';
import { FloatingConnectionLine } from '../../FloatingConnectionLine';
import { SubjectNode } from '../../SubjectNode';
import { initialElements } from '../../../utils/initialElements';
import type { TopicItem } from '../../../model/types';
import './SubjectNavigator.scss';

const edgeTypes = {
    floating: FloatingEdge
};

const nodeTypes = {
    subjectNode: SubjectNode
};

interface SubjectNavigatorProps {
    subjectCode: string;
    topics?: TopicItem[];
}

export const SubjectNavigator = ({
    subjectCode,
    topics = []
}: SubjectNavigatorProps) => {
    const { nodes: initialNodes, edges: initialEdges } = initialElements(
        subjectCode,
        topics
    );

    const [nodes] = useNodesState(initialNodes);
    const [edges] = useEdgesState(initialEdges);
    const navigate = useNavigate();

    const onNodeClick: NodeMouseHandler = (_, node) => {
        const path = (node.data as Record<string, unknown>)?.path as
            | string
            | undefined;
        if (path && path !== '#') navigate(path);
    };

    return (
        <div className="subject-navigator">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionLineComponent={FloatingConnectionLine}
                fitView
                onNodeClick={onNodeClick}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnDrag={false}
                panOnScroll={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                preventScrolling={false}
                proOptions={{ hideAttribution: true }}>
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="#e0e7ff"
                />
            </ReactFlow>
        </div>
    );
};
