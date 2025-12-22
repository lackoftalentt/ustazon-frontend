export interface CourseNode {
    id: string;
    name: string;
    type: 'root' | 'quarter' | 'category';
    val: number;
    color: string;
}

export interface CourseLink {
    source: string;
    target: string;
}

export interface GraphData {
    nodes: CourseNode[];
    links: CourseLink[];
}

export interface NavigationState {
    currentLevel: string;
    history: string[];
    graphData: GraphData;
}

export interface VisNode {
    id: string;
    label: string;
    color:
        | string
        | {
              background: string;
              border: string;
              highlight?: {
                  background: string;
                  border: string;
              };
              hover?: {
                  background: string;
                  border: string;
              };
          };
    font?: {
        color: string;
        size: number;
        face: string;
        bold?: boolean;
    };
    size: number;
    shape: string;
    borderWidth: number;
    borderWidthSelected: number;
    chosen: boolean;
}

export interface VisEdge {
    id: number;
    from: string;
    to: string;
    color: {
        color: string;
        highlight?: string;
        hover?: string;
    };
    width?: number;
}
