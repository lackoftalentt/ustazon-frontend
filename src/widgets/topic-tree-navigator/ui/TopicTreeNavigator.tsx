import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    MarkerType,
    type Node,
    type Edge,
    type NodeMouseHandler
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface Topic {
    id: number;
    topic: string;
    parent_topic_id: number | null;
    children?: Topic[];
}

interface TopicTreeNavigatorProps {
    subjectCode: string;
    topics: Topic[];
    onTopicClick?: (topic: Topic) => void;
}

const TopicNode = ({ data }: { data: { label: string; isRoot?: boolean } }) => {
    return (
        <div
            style={{
                padding: data.isRoot ? '16px 24px' : '12px 20px',
                background: data.isRoot
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#fff',
                color: data.isRoot ? '#fff' : '#333',
                borderRadius: '12px',
                border: data.isRoot ? 'none' : '2px solid #e0e7ff',
                fontWeight: data.isRoot ? 600 : 500,
                fontSize: data.isRoot ? '16px' : '14px',
                boxShadow: data.isRoot
                    ? '0 8px 16px rgba(102, 126, 234, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: data.isRoot ? '120px' : '100px',
                textAlign: 'center'
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = data.isRoot
                    ? '0 12px 24px rgba(102, 126, 234, 0.4)'
                    : '0 4px 12px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = data.isRoot
                    ? '0 8px 16px rgba(102, 126, 234, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.08)';
            }}>
            {data.label}
        </div>
    );
};

const nodeTypes = {
    topicNode: TopicNode
};

export const TopicTreeNavigator = ({
    topics,
    onTopicClick
}: TopicTreeNavigatorProps) => {
    const buildTree = (topics: Topic[]): Topic[] => {
        const topicMap = new Map<number, Topic>();
        const roots: Topic[] = [];

        topics.forEach(topic => {
            topicMap.set(topic.id, { ...topic, children: [] });
        });

        topics.forEach(topic => {
            const current = topicMap.get(topic.id)!;
            if (topic.parent_topic_id === null) {
                roots.push(current);
            } else {
                const parent = topicMap.get(topic.parent_topic_id);
                if (parent) {
                    parent.children!.push(current);
                }
            }
        });

        return roots;
    };

    const generateNodesAndEdges = () => {
        const nodes: Node[] = [];
        const edges: Edge[] = [];

        const tree = buildTree(topics);

        let nodeId = 0;
        const centerX = 400;
        const centerY = 250;
        const levelGap = 200;
        const siblingGap = 150;

        const processNode = (
            topic: Topic,
            x: number,
            y: number,
            isRoot = false,
            parentId?: string
        ): void => {
            const currentId = `node-${nodeId++}`;

            nodes.push({
                id: currentId,
                type: 'topicNode',
                position: { x, y },
                data: {
                    label: topic.topic,
                    isRoot,
                    topicId: topic.id
                }
            });

            if (parentId) {
                edges.push({
                    id: `edge-${parentId}-${currentId}`,
                    source: parentId,
                    target: currentId,
                    type: 'smoothstep',
                    animated: false,
                    style: { stroke: '#a5b4fc', strokeWidth: 2 },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: '#a5b4fc'
                    }
                });
            }

            if (topic.children && topic.children.length > 0) {
                const childrenCount = topic.children.length;
                const startX = x - ((childrenCount - 1) * siblingGap) / 2;

                topic.children.forEach((child, index) => {
                    processNode(
                        child,
                        startX + index * siblingGap,
                        y + levelGap,
                        false,
                        currentId
                    );
                });
            }
        };

        if (tree.length > 0) {
            tree.forEach((root, index) => {
                const startX = centerX - ((tree.length - 1) * siblingGap) / 2;
                processNode(root, startX + index * siblingGap, centerY, true);
            });
        } else {
            nodes.push({
                id: 'placeholder',
                type: 'topicNode',
                position: { x: centerX, y: centerY },
                data: {
                    label: 'Нет тем',
                    isRoot: true
                }
            });
        }

        return { nodes, edges };
    };

    const { nodes: initialNodes, edges: initialEdges } =
        generateNodesAndEdges();
    const [nodes] = useNodesState(initialNodes);
    const [edges] = useEdgesState(initialEdges);

    const handleNodeClick: NodeMouseHandler = (_, node) => {
        const topicId = (node.data as any).topicId;
        if (topicId && onTopicClick) {
            const topic = topics.find(t => t.id === topicId);
            if (topic) {
                onTopicClick(topic);
            }
        }
    };

    return (
        <div
            style={{
                width: '100%',
                height: '500px',
                background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0'
            }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodeClick={handleNodeClick}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={true}
                panOnDrag={true}
                panOnScroll={true}
                zoomOnScroll={true}
                zoomOnPinch={true}
                zoomOnDoubleClick={false}
                minZoom={0.5}
                maxZoom={2}
            />
        </div>
    );
};
