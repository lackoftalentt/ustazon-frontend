import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import ForceGraph2D from 'react-force-graph-2d';
import { useNavigation } from '../model/useNavigation';
import type { CourseNode, CourseLink } from '../model/types';
import s from './CourseNavigator.module.scss';

export const CourseNavigator = () => {
    const { state, getNodeRoute } = useNavigation();
    const navigate = useNavigate();

    const fgRef = useRef<any>(null);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    const [, setHoveredId] = useState<string | null>(null);

    const [size, setSize] = useState({ w: 0, h: 0 });

    useLayoutEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const ro = new ResizeObserver(entries => {
            const cr = entries[0].contentRect;
            setSize({ w: Math.floor(cr.width), h: Math.floor(cr.height) });
        });

        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const graphData = useMemo(() => {
        const nodes = state.graphData.nodes.map(n => ({ ...n })) as any[];
        const links = state.graphData.links.map(l => ({ ...l })) as any[];

        const root = nodes.find(n => n.type === 'root');
        if (!root) return { nodes, links };

        const rootX = 0;
        const rootY = 0;

        root.x = rootX;
        root.y = rootY;
        root.fx = rootX;
        root.fy = rootY;

        const children = nodes
            .filter(
                n =>
                    n.id !== root.id &&
                    (n.type === 'quarter' || n.type === 'category')
            )
            .sort((a, b) => String(a.id).localeCompare(String(b.id)));

        const radius = 360;
        const angleStart = (-5 * Math.PI) / 6;
        const angleEnd = (-1 * Math.PI) / 6;
        const step =
            children.length <= 1
                ? 0
                : (angleEnd - angleStart) / (children.length - 1);

        children.forEach((n, i) => {
            const a =
                children.length === 1 ? -Math.PI / 2 : angleStart + i * step;
            const x = rootX + radius * Math.cos(a);
            const y = rootY - radius * Math.sin(a);
            n.x = x;
            n.y = y;
            n.fx = x;
            n.fy = y;
        });

        return { nodes, links };
    }, [state.graphData]);

    useEffect(() => {
        const fg = fgRef.current;
        if (!fg) return;
        if (size.w === 0 || size.h === 0) return;

        const id = requestAnimationFrame(() => {
            fg.zoomToFit(250, 60);
        });

        return () => cancelAnimationFrame(id);
    }, [graphData, size.w, size.h]);

    const drawLabel = (
        ctx: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        maxWidth: number
    ) => {
        let t = text;
        while (t.length > 0 && ctx.measureText(t).width > maxWidth) {
            t = t.slice(0, -1);
        }
        if (t !== text) t = t.slice(0, Math.max(0, t.length - 1)) + '…';
        ctx.fillText(t, x, y);
    };

    return (
        <div
            ref={wrapRef}
            className={s.container}>
            {size.w > 0 && size.h > 0 && (
                <ForceGraph2D
                    ref={fgRef}
                    width={size.w}
                    height={size.h}
                    graphData={
                        graphData as {
                            nodes: CourseNode[];
                            links: CourseLink[];
                        }
                    }
                    cooldownTime={0}
                    enableZoomInteraction={false}
                    enablePanInteraction={true}
                    enableNodeDrag={false}
                    linkWidth={3}
                    linkColor={() => '#9aa0a6'}
                    onNodeHover={(node: any) => setHoveredId(node?.id ?? null)}
                    onNodeClick={(node: any) => {
                        if (!node || node.type === 'root') return;
                        const route = getNodeRoute(node.id);
                        if (route) navigate(route);
                    }}
                    nodeCanvasObjectMode={() => 'replace'}
                    nodePointerAreaPaint={(
                        node: any,
                        color: string,
                        ctx: CanvasRenderingContext2D
                    ) => {
                        const r = (node.val as number) / 5;
                        const hitR = r + 80;

                        ctx.fillStyle = color;
                        ctx.beginPath();
                        ctx.arc(node.x ?? 0, node.y ?? 0, hitR, 0, 2 * Math.PI);
                        ctx.fill();
                    }}
                    nodeCanvasObject={(
                        node: any,
                        ctx: CanvasRenderingContext2D,
                        globalScale: number
                    ) => {
                        const r = (node.val as number) / 5;

                        ctx.beginPath();
                        ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
                        ctx.fillStyle = node.color;
                        ctx.fill();

                        ctx.lineWidth = 6;
                        ctx.strokeStyle = '#ffffff';
                        ctx.stroke();

                        const fontSize = 16 / globalScale;
                        ctx.font = `${fontSize}px Inter`;
                        const labelPaddingX = 14;
                        const text = String(node.name ?? '');
                        const textW = ctx.measureText(text).width;
                        const boxW = Math.max(
                            80 / globalScale,
                            textW + (labelPaddingX * 2) / globalScale
                        );
                        const boxH = 26 / globalScale;

                        const boxX = node.x - boxW / 2;
                        const boxY = node.y + r + 10 / globalScale;

                        ctx.fillStyle = 'rgba(255,255,255,0.9)';
                        ctx.strokeStyle = 'rgba(0,0,0,0.05)';
                        ctx.lineWidth = 1 / globalScale;

                        const rad = 10 / globalScale;
                        ctx.beginPath();
                        if (ctx.roundRect) {
                            ctx.roundRect(boxX, boxY, boxW, boxH, rad);
                        } else {
                            ctx.rect(boxX, boxY, boxW, boxH);
                        }
                        ctx.fill();
                        ctx.stroke();

                        ctx.fillStyle = '#111827';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        drawLabel(
                            ctx,
                            text,
                            node.x,
                            boxY + boxH / 2,
                            boxW - 10 / globalScale
                        );
                    }}
                />
            )}
        </div>
    );
};
