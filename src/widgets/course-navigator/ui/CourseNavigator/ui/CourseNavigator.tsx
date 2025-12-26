import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    type NodeMouseHandler
} from '@xyflow/react';

import { FloatingEdge } from '../../FloatingEdge/ui/FloatingEdge';
import FloatingConnectionLine from '../../FloatingConnectionLine/ui/FloatingConnectionLine';
import { initialElements } from '../../../utils/initialElements';
import { useNavigate } from 'react-router';

const { nodes: initialNodes, edges: initialEdges } = initialElements();

const edgeTypes = {
    floating: FloatingEdge
};

export const CourseNavigator = () => {
    const [nodes] = useNodesState(initialNodes);
    const [edges] = useEdgesState(initialEdges);
    const navigate = useNavigate();

    const onNodeClick: NodeMouseHandler = (_, node) => {
        const path = (node.data as any)?.path as string | undefined;
        if (path) navigate(path);
    };

    console.log(edges);
    return (
        <div
            className="floating-edges"
            style={{ height: 420, width: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
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
                preventScrolling={false}>
                {/* <Background /> */}
            </ReactFlow>
        </div>
    );
};
