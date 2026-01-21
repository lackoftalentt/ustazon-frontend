import { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { CreateTopicModal } from '../../CreateTopicModal';
import { Button } from '@/shared/ui/button';
import './TopicGraph.scss';

interface GraphNode {
    id: string;
    label: string;
    type: string;
    value: number;
    color?: string;
    parentId?: string;
    isTopic?: boolean;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
}

interface GraphLink {
    source: string | GraphNode;
    target: string | GraphNode;
    value: number;
    type: string;
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

interface CardTopic {
    id: number;
    topic: string;
    parent_topic_id: number | null;
    children?: CardTopic[];
}

interface TopicGraphProps {
    subjectCode: string;
    topics?: CardTopic[];
    onTopicSelect?: (topicId: number | null) => void;
    selectedTopicId?: number | null;
}

export const TopicGraph = ({
    subjectCode,
    topics = [],
    onTopicSelect
}: TopicGraphProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
        new Set(['center'])
    );
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedParentTopic, setSelectedParentTopic] = useState<{
        id: number;
        name: string;
    } | null>(null);

    // Prepare graph data from topics with hierarchy support
    const graphData = useMemo((): GraphData => {
        const nodes: GraphNode[] = [
            {
                id: 'center',
                label: subjectCode || 'Темалар',
                type: 'Subject',
                value: 60,
                color: '#2f8450',
                isTopic: true
            }
        ];

        const links: GraphLink[] = [];

        // Recursive function to add topic and its children
        const addTopicWithChildren = (
            topic: CardTopic,
            parentId: string,
            depth: number = 0
        ) => {
            const nodeId = `topic-${topic.id}`;
            const hasChildren = topic.children && topic.children.length > 0;

            // Determine color based on depth
            const colors = ['#b8edc8', '#a1e0ba', '#89d4ac'];
            const color = colors[Math.min(depth, colors.length - 1)];

            nodes.push({
                id: nodeId,
                label: topic.topic,
                type: depth === 0 ? 'Topic' : 'Subtopic',
                value: 45 - depth * 8, // Decrease size for deeper levels
                color: color,
                parentId: parentId,
                isTopic: hasChildren
            });

            links.push({
                source: parentId,
                target: nodeId,
                value: 3 - depth,
                type: 'contains'
            });

            // Recursively add children
            if (hasChildren && topic.children) {
                topic.children.forEach(child => {
                    addTopicWithChildren(child, nodeId, depth + 1);
                });
            }
        };

        if (topics.length > 0) {
            // Only process top-level topics (where parent_topic_id is null)
            const topLevelTopics = topics.filter(
                t => t.parent_topic_id === null
            );

            topLevelTopics.forEach(topic => {
                addTopicWithChildren(topic, 'center', 0);
            });
        } else {
            // Demo data
            for (let i = 1; i <= 6; i++) {
                nodes.push({
                    id: `topic-${i}`,
                    label: `Тема ${i}`,
                    type: 'Topic',
                    value: 45,
                    color: '#b8edc8',
                    parentId: 'center',
                    isTopic: false
                });

                links.push({
                    source: 'center',
                    target: `topic-${i}`,
                    value: 3,
                    type: 'contains'
                });
            }
        }

        return { nodes, links };
    }, [subjectCode, topics]);

    // Filter nodes based on expanded state
    const filteredData = useMemo(() => {
        const isNodeVisible = (node: GraphNode): boolean => {
            if (!node.parentId) return true; // Root node always visible

            // Node is visible only if its direct parent is expanded
            return expandedNodes.has(node.parentId);
        };

        const visibleNodes = graphData.nodes.filter(isNodeVisible);
        const nodeIds = new Set(visibleNodes.map(n => n.id));
        const visibleLinks = graphData.links.filter(link => {
            const sourceId =
                typeof link.source === 'object' ? link.source.id : link.source;
            const targetId =
                typeof link.target === 'object' ? link.target.id : link.target;
            return nodeIds.has(sourceId) && nodeIds.has(targetId);
        });

        return { nodes: visibleNodes, links: visibleLinks };
    }, [graphData, expandedNodes]);

    // Update dimensions
    useEffect(() => {
        const updateDimensions = () => {
            if (svgRef.current?.parentElement) {
                const { clientWidth, clientHeight } =
                    svgRef.current.parentElement;
                setDimensions({ width: clientWidth, height: clientHeight });
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // D3 Force Graph
    useEffect(() => {
        if (!svgRef.current || dimensions.width === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const g = svg.append('g');

        // Zoom behavior
        const zoom = d3
            .zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on('zoom', event => {
                g.attr('transform', String(event.transform));
            });

        svg.call(zoom);

        // Force simulation
        const simulation = d3
            .forceSimulation<GraphNode>(filteredData.nodes)
            .force(
                'link',
                d3
                    .forceLink<GraphNode, GraphLink>(filteredData.links)
                    .id(d => d.id)
                    .distance(d => {
                        const source = d.source as GraphNode;
                        return source.parentId ? 80 : 150;
                    })
            )
            .force('charge', d3.forceManyBody().strength(-500))
            .force(
                'center',
                d3.forceCenter(dimensions.width / 2, dimensions.height / 2)
            )
            .force(
                'collision',
                d3.forceCollide().radius(d => {
                    const node = d as GraphNode;
                    return node.value / 3 + 40;
                })
            );

        // Links
        const link = g
            .append('g')
            .attr('stroke', '#2f8450')
            .attr('stroke-opacity', 0.3)
            .selectAll('line')
            .data(filteredData.links)
            .join('line')
            .attr('stroke-dasharray', d =>
                d.type === 'contains' ? '0' : '5,5'
            )
            .attr('stroke-width', d => Math.sqrt(d.value) * 1.5);

        // Nodes group
        const node = g
            .append('g')
            .selectAll('.node-group')
            .data(filteredData.nodes)
            .join('g')
            .attr('class', 'node-group')
            .style('cursor', 'pointer')
            .call(
                d3
                    .drag<SVGGElement, GraphNode>()
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended) as any
            );

        // Glow for expandable nodes
        node.filter(d => {
            const hasChildren = graphData.nodes.some(n => n.parentId === d.id);
            return !!(hasChildren || d.isTopic);
        })
            .append('circle')
            .attr('r', d => d.value / 4 + 16)
            .attr('fill', 'none')
            .attr('stroke', d => d.color || '#2f8450')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4,2')
            .attr('class', 'rotating-border');

        // Main circle
        node.append('circle')
            .attr('r', d => d.value / 4 + 10)
            .attr('fill', d => d.color || '#2f8450')
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .attr('class', 'node-circle')
            .on('click', (event, d) => {
                event.stopPropagation();
                handleNodeClick(d);
            })
            .on('contextmenu', (event, d) => {
                event.preventDefault();
                handleNodeRightClick(d);
            });

        // Expansion icon (+ / -)
        node.filter(d => {
            const hasChildren = graphData.nodes.some(n => n.parentId === d.id);
            return !!(hasChildren || d.isTopic);
        })
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('fill', 'white')
            .attr('class', 'expansion-icon')
            .style('pointer-events', 'none')
            .text(d => (expandedNodes.has(d.id) ? '−' : '+'));

        // Labels
        node.append('text')
            .attr('dy', d => d.value / 4 + 25)
            .attr('text-anchor', 'middle')
            .attr('class', 'node-label')
            .style('pointer-events', 'none')
            .text(d => d.label);

        // Simulation tick
        simulation.on('tick', () => {
            link.attr('x1', d => (d.source as GraphNode).x || 0)
                .attr('y1', d => (d.source as GraphNode).y || 0)
                .attr('x2', d => (d.target as GraphNode).x || 0)
                .attr('y2', d => (d.target as GraphNode).y || 0);

            node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
        });

        function dragstarted(event: any, d: GraphNode) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: any, d: GraphNode) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event: any, d: GraphNode) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return () => {
            simulation.stop();
        };
    }, [filteredData, dimensions, expandedNodes, graphData.nodes]);

    const handleNodeClick = (node: GraphNode) => {
        const hasChildren = graphData.nodes.some(n => n.parentId === node.id);

        if (hasChildren) {
            // Toggle expand/collapse for nodes with children
            setExpandedNodes(prev => {
                const next = new Set(prev);
                if (next.has(node.id)) {
                    // Collapse: remove this node and all its descendants from expanded set
                    const collapseRecursive = (id: string) => {
                        next.delete(id);
                        graphData.nodes
                            .filter(n => n.parentId === id)
                            .forEach(n => collapseRecursive(n.id));
                    };
                    collapseRecursive(node.id);
                } else {
                    // Expand: add this node to expanded set
                    next.add(node.id);
                }
                return next;
            });
        }

        // Call onTopicSelect when clicking on a topic node
        if (onTopicSelect) {
            if (node.id === 'center') {
                onTopicSelect(null); // Reset filter
            } else if (node.id.startsWith('topic-')) {
                const topicId = parseInt(node.id.replace('topic-', ''));
                onTopicSelect(topicId);
            }
        }
    };

    const handleNodeRightClick = (node: GraphNode) => {
        if (node.id === 'center') {
            // Create root topic
            setSelectedParentTopic(null);
            setIsCreateModalOpen(true);
        } else if (node.id.startsWith('topic-')) {
            // Create subtopic
            const topicId = parseInt(node.id.replace('topic-', ''));
            setSelectedParentTopic({ id: topicId, name: node.label });
            setIsCreateModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
        setSelectedParentTopic(null);
    };

    return (
        <div className="topic-graph-container">
            <div className="graph-header">
                <Button
                    onClick={() => {
                        setSelectedParentTopic(null);
                        setIsCreateModalOpen(true);
                    }}
                    className="create-topic-btn">
                    + Тема құру
                </Button>
            </div>

            <svg
                ref={svgRef}
                className="topic-graph-svg"
                viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            />

            <div className="graph-legend">
                <div className="legend-item">
                    <span className="legend-icon expandable"></span>
                    <span>Тема (+) - басып ашу/жабу</span>
                </div>
                <div className="legend-item">
                    <span className="legend-icon topic"></span>
                    <span>Оң жақ басу - қосымша тема құру</span>
                </div>
            </div>

            <CreateTopicModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseModal}
                parentTopicId={selectedParentTopic?.id}
                parentTopicName={selectedParentTopic?.name}
            />
        </div>
    );
};
