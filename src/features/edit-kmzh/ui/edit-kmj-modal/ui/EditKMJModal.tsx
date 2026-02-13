import { useRef, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/ui/modal';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Dropdown } from '@/shared/ui/dropdown';
import { ConfirmModal } from '@/shared/ui/confirm-modal';
import { qmjApi } from '@/shared/api/qmjApi';
import { uploadApi } from '@/shared/api/uploadApi';
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

const parseGrade = (classLevel: string): number => {
    const match = classLevel.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
};

const parseQuarter = (quarter: string): number => {
    const match = quarter.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
};

export const EditKMJModal = () => {
    const { t } = useTranslation();
    const { isOpen, kmjData, closeModal } = useEditKMJStore();
    const mainFileRef = useRef<HTMLInputElement>(null);
    const additionalFilesRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const queryClient = useQueryClient();

    const {
        register,
        setValue,
        watch,
        formState: { errors, isSubmitting },
        subjects,
        existingFiles,
        filesToDelete,
        handleSubjectToggle,
        handleMainFileChange,
        handleAdditionalFilesChange,
        handleRemoveExistingFile,
        handleHoursChange,
        resetForm,
        onSubmit
    } = useEditKMJForm(kmjData, async (data: EditKMJFormData) => {
        if (!kmjData) return;

        try {
            const qmjId = parseInt(kmjData.id);

            // Delete removed files
            for (const fileId of filesToDelete) {
                try {
                    await qmjApi.deleteQMJFile(parseInt(fileId));
                } catch (err) {
                    console.error('Failed to delete file:', fileId, err);
                }
            }

            // Upload main file if changed
            let mainFileUrl: string | undefined;
            if (data.mainFile) {
                const uploadResult = await uploadApi.uploadDocument(data.mainFile);
                mainFileUrl = uploadResult.file_path;
            }

            // Update QMJ
            await qmjApi.updateQMJ(qmjId, {
                grade: parseGrade(data.classLevel),
                quarter: parseQuarter(data.quarter),
                code: data.subjectCode,
                title: data.lessonTopic,
                text: data.learningObjectives,
                hour: data.hours,
                ...(mainFileUrl && { file: mainFileUrl }),
                subject_ids: kmjData.subject_ids || [],
                institution_type_ids: kmjData.institution_type_ids || []
            });

            // Upload additional files
            if (data.additionalFiles && data.additionalFiles.length > 0) {
                for (const file of data.additionalFiles) {
                    await qmjApi.addFileToQMJ(qmjId, {
                        file: file
                    });
                }
            }

            queryClient.invalidateQueries({ queryKey: ['qmj'] });
            queryClient.invalidateQueries({ queryKey: ['kmzh'] });
            toast.success(t('editKmzh.success'));
            handleClose();
        } catch {
            toast.error(t('editKmzh.error'));
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
            await qmjApi.deleteQMJ(parseInt(kmjData.id));
            queryClient.invalidateQueries({ queryKey: ['qmj'] });
            queryClient.invalidateQueries({ queryKey: ['kmzh'] });
            toast.success(t('editKmzh.deleteSuccess'));
            setIsDeleteConfirmOpen(false);
            handleClose();
        } catch {
            toast.error(t('editKmzh.deleteError'));
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
                toast.error(t('editKmzh.formatError'));
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
        <Modal open={isOpen} onClose={handleClose} title={t('editKmzh.modalTitle')}>
            <div className={s.header}>
                <h2 className={s.title}>{kmjData.title}</h2>
                <div className={s.badges}>
                    <span className={s.badge}>{kmjData.classLevel}</span>
                    <span className={s.badge}>{kmjData.quarter}</span>
                    <span className={s.badge}>{kmjData.subjectCode}</span>
                </div>
            </div>

            <form onSubmit={onSubmit} className={s.form}>
                <section className={s.section}>
                    <h3 className={s.sectionTitle}>{t('editKmzh.basicInfo')}</h3>

                    <div className={s.row}>
                        <div className={s.field}>
                            <label className={s.label}>{t('editKmzh.grade')} *</label>
                            <Dropdown
                                items={[...CLASS_LEVELS]}
                                value={watch('classLevel')}
                                placeholder={t('editKmzh.selectGrade')}
                                onChange={(v) => setValue('classLevel', v as ClassLevel)}
                            />
                            {errors.classLevel && (
                                <span className={s.error}>{errors.classLevel.message}</span>
                            )}
                        </div>

                        <div className={s.field}>
                            <label className={s.label}>{t('editKmzh.quarter')} *</label>
                            <Dropdown
                                items={[...QUARTERS]}
                                value={watch('quarter')}
                                placeholder={t('editKmzh.selectQuarter')}
                                onChange={(v) => setValue('quarter', v as Quarter)}
                            />
                            {errors.quarter && (
                                <span className={s.error}>{errors.quarter.message}</span>
                            )}
                        </div>
                    </div>

                    <div className={s.row}>
                        <div className={s.field}>
                            <label className={s.label}>{t('editKmzh.subjectCode')} *</label>
                            <Dropdown
                                items={[...SUBJECT_CODES]}
                                value={watch('subjectCode')}
                                placeholder={t('editKmzh.selectSubjectCode')}
                                onChange={(v) => setValue('subjectCode', v as SubjectCode)}
                            />
                            {errors.subjectCode && (
                                <span className={s.error}>{errors.subjectCode.message}</span>
                            )}
                        </div>

                        <div className={s.field}>
                            <label className={s.label}>{t('editKmzh.hours')} *</label>
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
                            <span className={s.hint}>{t('editKmzh.hoursHint')}</span>
                            {errors.hours && (
                                <span className={s.error}>{errors.hours.message}</span>
                            )}
                        </div>
                    </div>
                </section>

                <section className={s.section}>
                    <h3 className={s.sectionTitle}>{t('editKmzh.lessonContent')}</h3>

                    <div className={s.field}>
                        <label className={s.label}>{t('editKmzh.topic')} *</label>
                        <Input
                            {...register('lessonTopic')}
                            placeholder={t('editKmzh.topicPlaceholder')}
                            error={errors.lessonTopic?.message}
                        />
                    </div>

                    <div className={s.field}>
                        <label className={s.label}>{t('editKmzh.objectives')} *</label>
                        <textarea
                            {...register('learningObjectives')}
                            className={clsx(s.textarea, errors.learningObjectives && s.textareaError)}
                            placeholder={t('editKmzh.objectivesPlaceholder')}
                            rows={4}
                        />
                        {errors.learningObjectives && (
                            <span className={s.error}>{errors.learningObjectives.message}</span>
                        )}
                    </div>
                </section>

                <section className={s.section}>
                    <h3 className={s.sectionTitle}>{t('editKmzh.fileUpload')}</h3>

                    <div className={s.field}>
                        <label className={s.label}>{t('editKmzh.file')} *</label>
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
                                {mainFile ? mainFile.name : t('editKmzh.noFileChosen')}
                            </span>
                            <span className={s.fileButtonAction}>{t('editKmzh.chooseFile')}</span>
                        </div>
                        <span className={s.hint}>{t('editKmzh.fileHint')}</span>
                    </div>

                    <div className={s.field}>
                        <label className={s.label}>{t('editKmzh.additionalFiles')}</label>
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
                            <span>{t('editKmzh.dragFiles')}</span>
                        </div>
                        <span className={s.hint}>
                            {t('editKmzh.multiFileHint')}
                        </span>

                        {/* New additional files */}
                        {additionalFiles.length > 0 && (
                            <div className={s.fileList}>
                                <span className={s.fileListTitle}>{t('editKmzh.newFiles')}</span>
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
                                <span className={s.fileListTitle}>{t('editKmzh.existingFiles')}</span>
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

                <section className={s.section}>
                    <h3 className={s.sectionTitle}>{t('editKmzh.categories')}</h3>

                    <div className={s.field}>
                        <label className={s.label}>{t('editKmzh.subjects')} *</label>
                        <span className={s.hint}>{t('editKmzh.subjectsHint')}</span>
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
                        <label className={s.label}>{t('editKmzh.institutionType')} *</label>
                        <span className={s.hint}>{t('editKmzh.institutionTypeHint')}</span>
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
                        {t('editKmzh.cancel')}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className={s.deleteBtn}
                        onClick={handleDeleteClick}>
                        {t('editKmzh.delete')}
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        loading={isSubmitting}>
                        {t('editKmzh.save')}
                    </Button>
                </div>
            </form>

            <ConfirmModal
                open={isDeleteConfirmOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title={t('editKmzh.deleteTitle')}
                message={t('editKmzh.deleteMessage')}
                confirmText={t('editKmzh.deleteConfirm')}
                cancelText={t('editKmzh.deleteCancel')}
                variant="danger"
                loading={isDeleting}
            />
        </Modal>
    );
};
