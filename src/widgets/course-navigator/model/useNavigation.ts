import { useState, useCallback } from 'react';
import type {
    GraphData,
    NavigationState,
    CourseNode,
    CourseLink
} from './types';

interface CourseStructureNode {
    id: string;
    name: string;
    children: string[];
    route?: string;
}

type CourseStructureMap = {
    [key: string]: CourseStructureNode;
};

const courseStructure: CourseStructureMap = {
    math: {
        id: 'math',
        name: 'Математика',
        children: ['q1', 'q2', 'q3', 'q4'],
        route: '/course/math'
    },
    q1: {
        id: 'q1',
        name: '1 Четверть',
        children: ['tasks', 'sor-soch'],
        route: '/course/math/first-quarter'
    },
    q2: {
        id: 'q2',
        name: '2 Четверть',
        children: ['tasks2'],
        route: '/course/math/second-quarter'
    },
    q3: {
        id: 'q3',
        name: '3 Четверть',
        children: ['tasks3'],
        route: '/course/math/third-quarter'
    },
    q4: {
        id: 'q4',
        name: '4 Четверть',
        children: ['tasks4'],
        route: '/course/math/fourth-quarter'
    },
    tasks: {
        id: 'tasks',
        name: 'Задания',
        children: [],
        route: '/course/math/first-quarter/tasks'
    },
    'sor-soch': {
        id: 'sor-soch',
        name: 'СОР/СОЧ',
        children: [],
        route: '/course/math/first-quarter/sor-soch'
    },
    tasks2: {
        id: 'tasks2',
        name: 'Задания',
        children: [],
        route: '/course/math/second-quarter/tasks'
    },
    tasks3: {
        id: 'tasks3',
        name: 'Задания',
        children: [],
        route: '/course/math/third-quarter/tasks'
    },
    tasks4: {
        id: 'tasks4',
        name: 'Задания',
        children: [],
        route: '/course/math/fourth-quarter/tasks'
    }
};

const buildGraph = (currentId: string, history: string[]): GraphData => {
    const current = courseStructure[currentId];
    const nodes: CourseNode[] = [];
    const links: CourseLink[] = [];

    const ROOT_SIZE = 150;
    const CHILD_SIZE = 120;

    nodes.push({
        id: current.id,
        name: current.name,
        type: 'root',
        val: ROOT_SIZE,
        color: 'rgba(22, 163, 74, 1)'
    });

    if (history.length > 0) {
        const prevId = history[history.length - 1];
        const prevNode = courseStructure[prevId];
        nodes.push({
            id: prevId,
            name: prevNode.name,
            type: 'category',
            val: CHILD_SIZE,
            color: '#307a40'
        });
        links.push({ source: current.id, target: prevId });
    }

    current.children.forEach((childId: string) => {
        const child = courseStructure[childId];
        nodes.push({
            id: child.id,
            name: child.name,
            type: 'quarter',
            val: CHILD_SIZE,
            color: '#52d399'
        });
        links.push({ source: current.id, target: child.id });
    });

    return { nodes, links };
};

export const useNavigation = () => {
    const [state, setState] = useState<NavigationState>({
        currentLevel: 'math',
        history: [],
        graphData: buildGraph('math', [])
    });

    const navigateTo = useCallback((nodeId: string) => {
        setState(prev => {
            if (prev.history.includes(nodeId)) {
                const historyIndex = prev.history.indexOf(nodeId);
                const newHistory = prev.history.slice(0, historyIndex);
                return {
                    currentLevel: nodeId,
                    history: newHistory,
                    graphData: buildGraph(nodeId, newHistory)
                };
            }

            const newHistory = [...prev.history, prev.currentLevel];
            return {
                currentLevel: nodeId,
                history: newHistory,
                graphData: buildGraph(nodeId, newHistory)
            };
        });
    }, []);

    const getNodeRoute = (nodeId: string): string | undefined => {
        return courseStructure[nodeId]?.route;
    };

    return { state, navigateTo, getNodeRoute };
};
