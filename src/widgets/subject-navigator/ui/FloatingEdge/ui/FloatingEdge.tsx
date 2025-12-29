import {
    BaseEdge,
    getBezierPath,
    useInternalNode,
    type EdgeProps,
    type Edge
} from '@xyflow/react';
import type { SubjectFlowNode } from '../../../model/types';
import { getEdgeParams } from '../../../utils/initialElements';

type FloatingEdgeType = Edge<Record<string, never>, 'floating'>;

export function FloatingEdge(props: EdgeProps<FloatingEdgeType>) {
    const {
        id,
        source,
        target,
        markerEnd,
        markerStart,
        style,
        interactionWidth
    } = props;

    const sourceNode = useInternalNode<SubjectFlowNode>(source);
    const targetNode = useInternalNode<SubjectFlowNode>(target);

    if (!sourceNode || !targetNode) return null;

    const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
        sourceNode,
        targetNode
    );

    const [path] = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sourcePos,
        targetX: tx,
        targetY: ty,
        targetPosition: targetPos
    });

    return (
        <BaseEdge
            id={id}
            path={path}
            style={style}
            markerEnd={markerEnd}
            markerStart={markerStart}
            interactionWidth={interactionWidth}
        />
    );
}
