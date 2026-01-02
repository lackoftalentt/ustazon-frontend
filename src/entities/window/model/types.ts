export interface WindowTemplate {
    id: number;
    name: string;
    code_name: string;
    created_at: string;
}

export interface WindowData {
    id: number;
    name: string;
    template_id: number;
    link: string | null;
    nsub: boolean;
    image_url: string;
    created_at: string;
    template: WindowTemplate;
}
