declare module 'html2pdf.js' {
    interface Html2PdfOptions {
        margin?: number | number[];
        filename?: string;
        image?: { type?: string; quality?: number };
        html2canvas?: Record<string, unknown>;
        jsPDF?: { unit?: string; format?: string; orientation?: string };
        pagebreak?: { mode?: string[] };
    }

    interface Html2PdfWorker {
        set(options: Html2PdfOptions): Html2PdfWorker;
        from(element: HTMLElement): Html2PdfWorker;
        save(): Promise<void>;
    }

    function html2pdf(): Html2PdfWorker;
    export default html2pdf;
}
