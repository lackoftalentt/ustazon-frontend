import { useRef, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import { useAddFilesStore } from '../../../model/useAddFilesStore';
import {
    type FileItem,
    formatFileSize,
    isValidFileType,
    isValidFileSize
} from '../../../model/types';
import s from './AddFilesModal.module.scss';

export const AddFilesModal = () => {
    const { isOpen, files, closeModal, addFiles, removeFile, clearFiles } =
        useAddFilesStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleClose = useCallback(() => {
        clearFiles();
        closeModal();
    }, [clearFiles, closeModal]);

    const processFiles = useCallback(
        (fileList: FileList | File[]) => {
            const validFiles: FileItem[] = [];
            const errors: string[] = [];

            Array.from(fileList).forEach((file) => {
                if (!isValidFileType(file)) {
                    errors.push(`${file.name}: қолдау көрсетілмейтін формат`);
                    return;
                }
                if (!isValidFileSize(file)) {
                    errors.push(`${file.name}: файл өлшемі 10MB-дан асады`);
                    return;
                }

                validFiles.push({
                    id: crypto.randomUUID(),
                    file,
                    name: file.name,
                    size: file.size,
                    progress: 0,
                    status: 'pending'
                });
            });

            if (errors.length > 0) {
                errors.forEach((err) => toast.error(err));
            }

            if (validFiles.length > 0) {
                addFiles(validFiles);
            }
        },
        [addFiles]
    );

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        if (e.dataTransfer.files?.length) {
            processFiles(e.dataTransfer.files);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            processFiles(e.target.files);
        }
        e.target.value = '';
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error('Файлдарды таңдаңыз');
            return;
        }

        setIsUploading(true);

        try {
            // TODO: Implement actual upload API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast.success(`${files.length} файл сәтті жүктелді!`);
            handleClose();
        } catch {
            toast.error('Файлдарды жүктеу кезінде қате орын алды');
        } finally {
            setIsUploading(false);
        }
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        switch (ext) {
            case 'pdf':
                return '📄';
            case 'doc':
            case 'docx':
                return '📝';
            case 'ppt':
            case 'pptx':
                return '📊';
            case 'txt':
                return '📃';
            case 'rtf':
                return '📋';
            default:
                return '📁';
        }
    };

    return (
        <Modal open={isOpen} onClose={handleClose} title="Жаңа файлдар қосу">
            <div className={s.content}>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.rtf,.ppt,.pptx"
                    onChange={handleFileInputChange}
                    className={s.hiddenInput}
                />

                <div
                    className={clsx(s.dropzone, isDragOver && s.dragOver)}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}>
                    <div className={s.dropzoneIcon}>
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    </div>
                    <div className={s.dropzoneText}>
                        <span className={s.dropzoneTitle}>
                            Файлдарды таңдаңыз немесе осы жерге апарыңыз
                        </span>
                        <span className={s.dropzoneHint}>
                            PDF, DOC, DOCX, TXT, RTF, PPT, PPTX форматтары қолдау
                            көрсетіледі (макс. 10MB)
                        </span>
                    </div>
                </div>

                {files.length > 0 && (
                    <div className={s.fileList}>
                        <div className={s.fileListHeader}>
                            <span className={s.fileListTitle}>
                                Таңдалған файлдар ({files.length})
                            </span>
                            <button
                                type="button"
                                className={s.clearAllBtn}
                                onClick={clearFiles}>
                                Барлығын өшіру
                            </button>
                        </div>

                        <div className={s.files}>
                            {files.map((file, index) => (
                                <div
                                    key={file.id}
                                    className={s.fileItem}
                                    style={{
                                        animationDelay: `${index * 0.05}s`
                                    }}>
                                    <span className={s.fileIcon}>
                                        {getFileIcon(file.name)}
                                    </span>
                                    <div className={s.fileInfo}>
                                        <span className={s.fileName}>
                                            {file.name}
                                        </span>
                                        <span className={s.fileSize}>
                                            {formatFileSize(file.size)}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className={s.removeBtn}
                                        onClick={() => removeFile(file.id)}>
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2">
                                            <line
                                                x1="18"
                                                y1="6"
                                                x2="6"
                                                y2="18"
                                            />
                                            <line
                                                x1="6"
                                                y1="6"
                                                x2="18"
                                                y2="18"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className={s.actions}>
                    <Button variant="outline" onClick={handleClose}>
                        Болдырмау
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpload}
                        loading={isUploading}
                        disabled={files.length === 0}>
                        Жүктеу
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
