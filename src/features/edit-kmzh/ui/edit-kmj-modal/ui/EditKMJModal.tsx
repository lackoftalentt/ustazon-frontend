import { useRef, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { Modal } from '@/shared/ui/modal';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Dropdown } from '@/shared/ui/dropdown';
import { ConfirmModal } from '@/shared/ui/confirm-modal';
import { useEditKMJForm } from '../../../model/useEditKMJForm';
import { useEditKMJStore } from '../../../model/useEditKMJStore';
import {
    CLASS_LEVELS,
    QUARTERS,
    SUBJECTS,
    INSTITUTION_TYPES,
    SUBJECT_CODES,
    type EditKMJFormData,
    type Subject,
    type SubjectCode,
    type ClassLevel,
    type Quarter,
    type InstitutionType
} from '../../../model/types';
import s from './EditKMJModal.module.scss';

export const EditKMJModal = () => {
    const { isOpen, kmjData, closeModal } = useEditKMJStore();
    const mainFileRef = useRef<HTMLInputElement>(null);
    const additionalFilesRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        register,
        setValue,
        watch,
        formState: { errors, isSubmitting },
        subjects,
        existingFiles,
        handleSubjectToggle,
        handleMainFileChange,
        handleAdditionalFilesChange,
        handleRemoveExistingFile,
        handleHoursChange,
        resetForm,
        onSubmit
    } = useEditKMJForm(kmjData, async (data: EditKMJFormData) => {
        try {
            // TODO: API call to update KMJ
            console.log('Updating KMJ:', data);
            toast.success('ҚМЖ сәтті сақталды!');
            handleClose();
        } catch {
            toast.error('ҚМЖ сақтау кезінде қате орын алды');
        }
    });

    const mainFile = watch('mainFile');
    const additionalFiles = watch('additionalFiles') || [];

    const handleClose = useCallback(() => {
        resetForm();
        closeModal();
    }, [resetForm, closeModal]);

    const handleDeleteClick = () => {
        setIsDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!kmjData) return;

        setIsDeleting(true);
        try {
            // TODO: API call to delete KMJ
            console.log('Deleting KMJ:', kmjData.id);
            toast.success('ҚМЖ сәтті жойылды!');
            setIsDeleteConfirmOpen(false);
            handleClose();
        } catch {
            toast.error('ҚМЖ жою кезінде қате орын алды');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteConfirmOpen(false);
    };

    // Main file handlers
    const handleMainFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const ext = file.name.split('.').pop()?.toLowerCase();
            if (!['doc', 'docx', 'pdf'].includes(ext || '')) {
                toast.error('Тек DOC, DOCX немесе PDF форматы қолдау көрсетіледі');
                return;
            }
            handleMainFileChange(file);
        }
        e.target.value = '';
    };

    // Additional files handlers
    const handleAdditionalFilesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const newFiles = Array.from(e.target.files);
            handleAdditionalFilesChange([...additionalFiles, ...newFiles]);
        }
        e.target.value = '';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files?.length) {
            const newFiles = Array.from(e.dataTransfer.files);
            handleAdditionalFilesChange([...additionalFiles, ...newFiles]);
        }
    };

    const removeAdditionalFile = (index: number) => {
        const updated = additionalFiles.filter((_, i) => i !== index);
        handleAdditionalFilesChange(updated);
    };

    if (!kmjData) return null;

    return (
        <Modal open={isOpen} onClose={handleClose} title="ҚМЖ өзгерту">
            <div className={s.header}>
                <h2 className={s.title}>{kmjData.title}</h2>
                <div className={s.badges}>
                    <span className={s.badge}>{kmjData.classLevel}</span>
                    <span className={s.badge}>{kmjData.quarter}</span>
                    <span className={s.badge}>{kmjData.subjectCode}</span>
                </div>
            </div>

            <form onSubmit={onSubmit} className={s.form}>
                {/* Негізгі ақпарат */}
                <section className={s.section}>
                    <h3 className={s.sectionTitle}>Негізгі ақпарат</h3>

                    <div className={s.row}>
                        <div className={s.field}>
                            <label className={s.label}>Сынып *</label>
                            <Dropdown
                                items={[...CLASS_LEVELS]}
                                value={watch('classLevel')}
                                placeholder="Сыныпты таңдаңыз"
                                onChange={(v) => setValue('classLevel', v as ClassLevel)}
                            />
                            {errors.classLevel && (
                                <span className={s.error}>{errors.classLevel.message}</span>
                            )}
                        </div>

                        <div className={s.field}>
                            <label className={s.label}>Тоқсан *</label>
                            <Dropdown
                                items={[...QUARTERS]}
                                value={watch('quarter')}
                                placeholder="Тоқсанды таңдаңыз"
                                onChange={(v) => setValue('quarter', v as Quarter)}
                            />
                            {errors.quarter && (
                                <span className={s.error}>{errors.quarter.message}</span>
                            )}
                        </div>
                    </div>

                    <div className={s.row}>
                        <div className={s.field}>
                            <label className={s.label}>Пән коды *</label>
                            <Dropdown
                                items={[...SUBJECT_CODES]}
                                value={watch('subjectCode')}
                                placeholder="Пән кодын таңдаңыз"
                                onChange={(v) => setValue('subjectCode', v as SubjectCode)}
                            />
                            {errors.subjectCode && (
                                <span className={s.error}>{errors.subjectCode.message}</span>
                            )}
                        </div>

                        <div className={s.field}>
                            <label className={s.label}>Сағат саны *</label>
                            <div className={s.hoursInput}>
                                <button
                                    type="button"
                                    className={s.hoursBtn}
                                    onClick={() => handleHoursChange((watch('hours') || 1) - 1)}>
                                    −
                                </button>
                                <input
                                    type="number"
                                    className={s.hoursValue}
                                    value={watch('hours') || 1}
                                    onChange={(e) => handleHoursChange(parseInt(e.target.value) || 1)}
                                    min={1}
                                    max={10}
                                />
                                <button
                                    type="button"
                                    className={s.hoursBtn}
                                    onClick={() => handleHoursChange((watch('hours') || 1) + 1)}>
                                    +
                                </button>
                            </div>
                            <span className={s.hint}>Сабаққа бөлінген сағат саны (1-10)</span>
                            {errors.hours && (
                                <span className={s.error}>{errors.hours.message}</span>
                            )}
                        </div>
                    </div>
                </section>

                {/* Сабақ мазмұны */}
                <section className={s.section}>
                    <h3 className={s.sectionTitle}>Сабақ мазмұны</h3>

                    <div className={s.field}>
                        <label className={s.label}>Сабақ тақырыбы *</label>
                        <Input
                            {...register('lessonTopic')}
                            placeholder="Сабақтың толық тақырыбын жазыңыз"
                            error={errors.lessonTopic?.message}
                        />
                    </div>

                    <div className={s.field}>
                        <label className={s.label}>Оқу мақсаттары *</label>
                        <textarea
                            {...register('learningObjectives')}
                            className={clsx(s.textarea, errors.learningObjectives && s.textareaError)}
                            placeholder="Оқу бағдарламасындағы мақсаттарды көрсетіңіз"
                            rows={4}
                        />
                        {errors.learningObjectives && (
                            <span className={s.error}>{errors.learningObjectives.message}</span>
                        )}
                    </div>
                </section>

                {/* Файл жүктеу */}
                <section className={s.section}>
                    <h3 className={s.sectionTitle}>Файл жүктеу</h3>

                    <div className={s.field}>
                        <label className={s.label}>Файл *</label>
                        <input
                            ref={mainFileRef}
                            type="file"
                            accept=".doc,.docx,.pdf"
                            onChange={handleMainFileInputChange}
                            className={s.hiddenInput}
                        />
                        <div
                            className={s.fileButton}
                            onClick={() => mainFileRef.current?.click()}>
                            <span className={s.fileButtonText}>
                                {mainFile ? mainFile.name : 'No file chosen'}
                            </span>
                            <span className={s.fileButtonAction}>Таңдау</span>
                        </div>
                        <span className={s.hint}>DOC, DOCX немесе PDF форматындағы файл</span>
                    </div>

                    <div className={s.field}>
                        <label className={s.label}>Қосымша файлдар</label>
                        <input
                            ref={additionalFilesRef}
                            type="file"
                            multiple
                            onChange={handleAdditionalFilesInputChange}
                            className={s.hiddenInput}
                        />
                        <div
                            className={clsx(s.dropzone, isDragOver && s.dragOver)}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => additionalFilesRef.current?.click()}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span>Файлдарды таңдаңыз немесе осы жерге апарыңыз</span>
                        </div>
                        <span className={s.hint}>
                            Бірнеше файлды таңдау үшін Ctrl немесе Cmd пернесін басып ұстаңыз
                        </span>

                        {/* New additional files */}
                        {additionalFiles.length > 0 && (
                            <div className={s.fileList}>
                                <span className={s.fileListTitle}>Жаңа файлдар</span>
                                {additionalFiles.map((file, index) => (
                                    <div key={`new-${index}`} className={s.fileItem}>
                                        <span className={s.fileIcon}>📄</span>
                                        <span className={s.fileName}>{file.name}</span>
                                        <button
                                            type="button"
                                            className={s.fileRemove}
                                            onClick={() => removeAdditionalFile(index)}>
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Existing additional files */}
                        {existingFiles.length > 0 && (
                            <div className={s.fileList}>
                                <span className={s.fileListTitle}>Ағымдағы қосымша файлдар</span>
                                {existingFiles.map((file) => (
                                    <div key={file.id} className={s.fileItem}>
                                        <span className={s.fileIcon}>📄</span>
                                        <div className={s.fileInfo}>
                                            <span className={s.fileName}>{file.path}</span>
                                            <span className={s.fileSize}>({file.size})</span>
                                        </div>
                                        <button
                                            type="button"
                                            className={s.fileRemove}
                                            onClick={() => handleRemoveExistingFile(file.id)}>
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Санаттар */}
                <section className={s.section}>
                    <h3 className={s.sectionTitle}>Санаттар</h3>

                    <div className={s.field}>
                        <label className={s.label}>Пәндер *</label>
                        <span className={s.hint}>Бір немесе бірнеше пән таңдаңыз</span>
                        <div className={s.subjectsGrid}>
                            {SUBJECTS.map((subject) => (
                                <div
                                    key={subject}
                                    className={clsx(
                                        s.subjectItem,
                                        subjects.includes(subject as Subject) && s.selected
                                    )}
                                    onClick={() => handleSubjectToggle(subject as Subject)}>
                                    <input
                                        type="checkbox"
                                        className={s.subjectCheckbox}
                                        checked={subjects.includes(subject as Subject)}
                                        readOnly
                                    />
                                    <span className={s.subjectName}>{subject}</span>
                                </div>
                            ))}
                        </div>
                        {errors.subjects && (
                            <span className={s.error}>{errors.subjects.message}</span>
                        )}
                    </div>

                    <div className={s.field}>
                        <label className={s.label}>Оқу орны түрі *</label>
                        <span className={s.hint}>Оқу орнының түрін таңдаңыз</span>
                        <div className={s.institutionGrid}>
                            {INSTITUTION_TYPES.map((type) => (
                                <div
                                    key={type}
                                    className={clsx(
                                        s.institutionItem,
                                        watch('institutionType') === type && s.selected
                                    )}
                                    onClick={() => setValue('institutionType', type as InstitutionType)}>
                                    <input
                                        type="radio"
                                        className={s.institutionRadio}
                                        checked={watch('institutionType') === type}
                                        readOnly
                                    />
                                    <span className={s.institutionName}>{type}</span>
                                </div>
                            ))}
                        </div>
                        {errors.institutionType && (
                            <span className={s.error}>{errors.institutionType.message}</span>
                        )}
                    </div>
                </section>

                {/* Actions */}
                <div className={s.actions}>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}>
                        Бас тарту
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className={s.deleteBtn}
                        onClick={handleDeleteClick}>
                        Жою
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        loading={isSubmitting}>
                        Өзгерістерді сақтау
                    </Button>
                </div>
            </form>

            <ConfirmModal
                open={isDeleteConfirmOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="ҚМЖ-ды жою"
                message="Бұл ҚМЖ-ды жойғыңыз келетініне сенімдісіз бе? Бұл әрекетті қайтару мүмкін емес."
                confirmText="Жою"
                cancelText="Бас тарту"
                variant="danger"
                loading={isDeleting}
            />
        </Modal>
    );
};
