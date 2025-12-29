import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    type NodeMouseHandler,
    Background,
    BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { FloatingEdge } from '../../FloatingEdge/ui/FloatingEdge';
import FloatingConnectionLine from '../../FloatingConnectionLine/ui/FloatingConnectionLine';
import { initialElements } from '../../../utils/initialElements';
import { useNavigate } from 'react-router';
import { CourseNode } from '../../CourseNode/ui/CourseNode';
import './CourseNavigator.scss';

const edgeTypes = {
    floating: FloatingEdge
};

interface CourseNavigatorProps {
    subjectCode: string;
    topics?: Array<{id: number, topic: string}>;
}

export const CourseNavigator = ({ subjectCode, topics = [] }: CourseNavigatorProps) => {
    // Generate nodes and edges with subject code and topics
    const { nodes: initialNodes, edges: initialEdges } = initialElements(subjectCode, topics);

    const [nodes] = useNodesState(initialNodes);
    const [edges] = useEdgesState(initialEdges);
    const navigate = useNavigate();

    const nodeTypes = { courseNode: CourseNode };

    const onNodeClick: NodeMouseHandler = (_, node) => {
        const path = (node.data as any)?.path as string | undefined;
        if (path) navigate(path);
    };

    return (
        <div className="course-navigator">
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
