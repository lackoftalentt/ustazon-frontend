import {
    MarkerType,
    Position,
    type InternalNode,
    type Node,
    type Edge
} from '@xyflow/react';
import type { CourseNodeData } from '../model/types';
import type { CSSProperties } from 'react';

export type EdgeParams = {
    sx: number;
    sy: number;
    tx: number;
    ty: number;
    sourcePos: Position;
    targetPos: Position;
};

type XY = { x: number; y: number };
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
    const sourceIntersectionPoint = getNodeIntersection(source, target);
    const targetIntersectionPoint = getNodeIntersection(target, source);

    return {
        sx: sourceIntersectionPoint.x,
        sy: sourceIntersectionPoint.y,
        tx: targetIntersectionPoint.x,
        ty: targetIntersectionPoint.y,
        sourcePos: getEdgePosition(source, sourceIntersectionPoint),
        targetPos: getEdgePosition(target, targetIntersectionPoint)
    };
}

const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), max);

export function sizeFromTopicsCount(topicCount: number) {
    const minSize = 96;
    const maxSize = 128;

    const t = clamp(topicCount / 12, 0, 1);
    return Math.round(minSize + t * (maxSize - minSize));
}

export function initialElements() {
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const SIZE = sizeFromTopicsCount(4);
    const r = 250;

    const nodes: Node<CourseNodeData>[] = [
        {
            id: 'target',
            data: { label: 'Математика', path: '/course' },
            position: center,
            className: 'course-node',
            style: circleStyle(SIZE, 'primary')
        },

        {
            id: 'n-0',
            data: { label: '1', path: '/course/q1' },
            position: { x: center.x + r, y: center.y },
            className: 'course-node',
            style: circleStyle(SIZE, 'secondary')
        },
        {
            id: 'n-1',
            data: { label: '2', path: '/course/q2' },
            position: { x: center.x, y: center.y + r },
            className: 'course-node',
            style: circleStyle(SIZE, 'secondary')
        },
        {
            id: 'n-2',
            data: { label: '3', path: '/course/q3' },
            position: { x: center.x - r, y: center.y },
            className: 'course-node',
            style: circleStyle(SIZE, 'secondary')
        },
        {
            id: 'n-3',
            data: { label: '4', path: '/course/q4' },
            position: { x: center.x, y: center.y - r },
            className: 'course-node',
            style: circleStyle(SIZE, 'secondary')
        }
    ];

    const edges: Edge[] = [
        {
            id: 'e-0',
            source: 'n-0',
            target: 'target',
            type: 'floating',
            markerEnd: MarkerType.Arrow,
            style: { stroke: '#111', strokeWidth: 2 }
        },
        {
            id: 'e-1',
            source: 'n-1',
            target: 'target',
            type: 'floating',
            markerEnd: MarkerType.Arrow,
            style: { stroke: '#111', strokeWidth: 2 }
        },
        {
            id: 'e-2',
            source: 'n-2',
            target: 'target',
            type: 'floating',
            markerEnd: MarkerType.Arrow,
            style: { stroke: '#111', strokeWidth: 2 }
        },
        {
            id: 'e-3',
            source: 'n-3',
            target: 'target',
            type: 'floating',
            markerEnd: MarkerType.Arrow,
            style: { stroke: '#111', strokeWidth: 2 }
        }
    ];

    return { nodes, edges };
}

function circleStyle(
    size: number,
    variant: 'primary' | 'secondary'
): CSSProperties {
    const border = variant === 'primary' ? '#16a34a' : '#52d399';

    return {
        width: size,
        height: size,
        borderRadius: 9999,
        background: '#fff',
        color: '#111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        fontWeight: variant === 'primary' ? 500 : 600,
        border: `3px solid ${border}`,
        boxShadow: '0 6px 18px rgba(0,0,0,.06)',
        cursor: 'pointer',
        userSelect: 'none',
        stroke: 'rgba(17,17,17,0.35)',
        strokeWidth: 1.25,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    };
}
