import {
    getBezierPath,
    type ConnectionLineComponentProps,
    type InternalNode,
    type Node
} from '@xyflow/react';

import { getEdgeParams } from '../../../utils/initialElements';

type XY = { x: number; y: number };

export const FloatingConnectionLine = ({
    toX,
    toY,
    fromPosition,
    toPosition,
    fromNode
}: ConnectionLineComponentProps) => {
    // if (!fromNode) return null;

    const targetNode = {
        id: 'connection-target',
        measured: { width: 1, height: 1 },
        internals: { positionAbsolute: { x: toX, y: toY } as XY }
    } as InternalNode<Node>;

    const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
        fromNode as InternalNode<Node>,
        targetNode
    );

    const [edgePath] = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sourcePos ?? fromPosition,
        targetX: tx ?? toX,
        targetY: ty ?? toY,
        targetPosition: targetPos ?? toPosition
    });

    return (
        <g>
            <path
                fill="none"
                stroke="#222"
                strokeWidth={1.5}
                className="animated"
                d={edgePath}
            />
            <circle
                cx={tx ?? toX}
                cy={ty ?? toY}
                fill="#fff"
                r={3}
                stroke="#222"
                strokeWidth={1.5}
            />
        </g>
    );
};

export default FloatingConnectionLine;
