import {
    MarkerType,
    Position,
    type InternalNode,
    type Node,
    type Edge
} from '@xyflow/react';
import type { SubjectNodeData } from '../model/types';
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

export function initialElements() {
    const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // const SIZE = 64;
    const r = 250;

    const nodes: Node<SubjectNodeData>[] = [
        {
            id: 'target',
            data: { label: 'Математика', path: '/subject' },
            position: center,
            type: 'subjectNode',
            className: 'subject-node',
            style: {
                ['--s' as any]: `${rootSize}px`,
                ['--hoverScale' as any]: 1
            } as any
        },

        {
            id: 'n-0',
            data: { label: '1 четверть', path: '/subject/q1' },
            position: { x: center.x + r, y: center.y },
            type: 'subjectNode',
            className: 'subject-node',
            style: {
                ['--s' as any]: `${leafSize}px`,
                ['--hoverScale' as any]: leafHoverScale
            } as any
        },
        {
            id: 'n-1',
            data: { label: '2 четверть', path: '/subject/q2' },
            position: { x: center.x, y: center.y + r },
            type: 'subjectNode',
            className: 'subject-node',
            style: {
                ['--s' as any]: `${leafSize}px`,
                ['--hoverScale' as any]: leafHoverScale
            } as any
        },
        {
            id: 'n-2',
            data: { label: '3 четверть', path: '/subject/q3' },
            position: { x: center.x - r, y: center.y },
            type: 'subjectNode',
            className: 'subject-node',
            style: {
                ['--s' as any]: `${leafSize}px`,
                ['--hoverScale' as any]: leafHoverScale
            } as any
        },
        {
            id: 'n-3',
            data: { label: '4 четверть', path: '/subject/q4' },
            position: { x: center.x, y: center.y - r },
            type: 'subjectNode',
            className: 'subject-node',
            style: {
                ['--s' as any]: `${leafSize}px`,
                ['--hoverScale' as any]: leafHoverScale
            } as any
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
