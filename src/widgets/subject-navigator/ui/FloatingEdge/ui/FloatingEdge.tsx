import {
    BaseEdge,
    getBezierPath,
    useInternalNode,
    type EdgeProps
} from '@xyflow/react';
import type { SubjectFlowNode, FloatingEdgeType } from '../../../model/types';
import { getEdgeParams } from '../../../utils/initialElements';

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
        <>
            <BaseEdge
                id={id}
                path={path}
                style={{
                    ...style,
                    strokeWidth: 2.5,
                    filter: 'drop-shadow(0 2px 4px rgba(167, 139, 250, 0.3))'
                }}
                markerEnd={markerEnd}
                markerStart={markerStart}
                interactionWidth={interactionWidth}
            />
        </>
    );
}
