import {
    MarkerType,
    Position,
    type InternalNode,
    type Node,
    type Edge
} from '@xyflow/react';
import type { CourseNodeData } from '../model/types';
// import type { CSSProperties } from 'react';

export type EdgeParams = {
    sx: number;
    sy: number;
    tx: number;
    ty: number;
    sourcePos: Position;
    targetPos: Position;
};

type XY = { x: number; y: number };

function movePointTowards(p: XY, towards: XY, distance: number): XY {
    const dx = towards.x - p.x;
    const dy = towards.y - p.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: p.x + (dx / len) * distance, y: p.y + (dy / len) * distance };
}
type AnyInternalNode = InternalNode<Node>;

function getNodeIntersection(
    intersectionNode: AnyInternalNode,
    targetNode: AnyInternalNode
): XY {
    const iw = intersectionNode.measured.width ?? 0;
    const ih = intersectionNode.measured.height ?? 0;
    const tw = targetNode.measured.width ?? 0;
    const th = targetNode.measured.height ?? 0;

    const intersectionPos = intersectionNode.internals.positionAbsolute;
    const targetPos = targetNode.internals.positionAbsolute;

    if (!iw || !ih || !tw || !th) {
        return { x: intersectionPos.x + iw / 2, y: intersectionPos.y + ih / 2 };
    }

    const w = iw / 2;
    const h = ih / 2;

    const x2 = intersectionPos.x + w;
    const y2 = intersectionPos.y + h;
    const x1 = targetPos.x + tw / 2;
    const y1 = targetPos.y + th / 2;

    const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
    const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
    const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
    const xx3 = a * xx1;
    const yy3 = a * yy1;

    return {
        x: w * (xx3 + yy3) + x2,
        y: h * (-xx3 + yy3) + y2
    };
}

function getEdgePosition(
    node: AnyInternalNode,
    intersectionPoint: XY
): Position {
    const abs = node.internals.positionAbsolute;

    const nx = Math.round(abs.x);
    const ny = Math.round(abs.y);
    const px = Math.round(intersectionPoint.x);
    const py = Math.round(intersectionPoint.y);

    const width = node.measured.width ?? 0;
    const height = node.measured.height ?? 0;

    if (px <= nx + 1) return Position.Left;
    if (px >= nx + width - 1) return Position.Right;
    if (py <= ny + 1) return Position.Top;
    if (py >= ny + height - 1) return Position.Bottom;

    return Position.Top;
}

export function getEdgeParams(
    source: AnyInternalNode,
    target: AnyInternalNode
): EdgeParams {
    const sourceIP = getNodeIntersection(source, target);
    const targetIP = getNodeIntersection(target, source);

    const PAD = 8;

    const sxsy = movePointTowards(sourceIP, targetIP, PAD);
    const txty = movePointTowards(targetIP, sourceIP, PAD);

    return {
        sx: sxsy.x,
        sy: sxsy.y,
        tx: txty.x,
        ty: txty.y,
        sourcePos: getEdgePosition(source, sourceIP),
        targetPos: getEdgePosition(target, targetIP)
    };
}

const rootSize = 56;
const leafSize = 36;
const leafHoverScale = rootSize / leafSize;

export function initialElements(subjectCode: string = 'math', topics: Array<{id: number, topic: string}> = []) {
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const r = 280;

    // Use provided topics or default demo topics
    const displayTopics = topics.length > 0 ? topics.map(t => ({
        id: `topic-${t.id}`,
        label: t.topic,
        topicId: t.id
    })) : [
        { id: 'topic-1', label: 'Тема 1', topicId: 1 },
        { id: 'topic-2', label: 'Тема 2', topicId: 2 },
        { id: 'topic-3', label: 'Тема 3', topicId: 3 },
        { id: 'topic-4', label: 'Тема 4', topicId: 4 },
        { id: 'topic-5', label: 'Тема 5', topicId: 5 },
        { id: 'topic-add', label: '+ Қосу', topicId: null },
    ];

    const nodes: Node<CourseNodeData>[] = [
        // Center node - Subject
        {
            id: 'target',
            data: {
                label: 'Темалар',
                path: `/course/${subjectCode}`,
                isCenter: true,
                isAddButton: false
            },
            position: center,
            type: 'courseNode',
            className: 'course-node',
            style: {
                ['--s' as any]: `${rootSize}px`,
                ['--hoverScale' as any]: 1
            } as any
        }
    ];

    // Create nodes in a circle around the center
    const angleStep = (2 * Math.PI) / displayTopics.length;

    displayTopics.forEach((topic, index) => {
        const angle = angleStep * index - Math.PI / 2; // Start from top
        const x = center.x + r * Math.cos(angle);
        const y = center.y + r * Math.sin(angle);

        const isAddButton = topic.topicId === null;

        nodes.push({
            id: topic.id,
            data: {
                label: topic.label,
                path: isAddButton
                    ? '#'
                    : `/course/${subjectCode}?topic=${topic.topicId}`,
                isCenter: false,
                isAddButton: isAddButton
            },
            position: { x, y },
            type: 'courseNode',
            className: 'course-node',
            style: {
                ['--s' as any]: `${leafSize}px`,
                ['--hoverScale' as any]: leafHoverScale
            } as any
        });
    });

    const edges: Edge[] = displayTopics.map((topic, index) => ({
        id: `e-${index}`,
        source: topic.id,
        target: 'target',
        type: 'floating',
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#a78bfa',
            width: 20,
            height: 20
        },
        style: {
            stroke: '#c4b5fd',
            strokeWidth: 2.5,
            strokeDasharray: '5,5',
            animation: 'dashdraw 20s linear infinite'
        },
        animated: true
    }));

    return { nodes, edges };
}

// function circleStyle(
//     size: number,
//     variant: 'primary' | 'secondary'
// ): CSSProperties {
//     const border = variant === 'primary' ? '#16a34a' : '#52d399';
//     const bg =
//         variant === 'primary'
//             ? 'rgba(22, 163, 74, 0.08)'
//             : 'rgba(82, 211, 153, 0.10)';

//     return {
//         width: size,
//         height: size,
//         borderRadius: 9999,
//         background: bg,
//         color: '#0f172a',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         fontSize: 18,
//         fontWeight: variant === 'primary' ? 600 : 600,
//         border: `2px solid ${border}`,
//         boxShadow: '0 6px 18px rgba(15, 23, 42, .06)',
//         cursor: 'pointer',
//         userSelect: 'none'
//     };
// }
