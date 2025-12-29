import clsx from 'clsx';
import s from './SectionTitle.module.scss';

interface SectionTitleProps {
    className?: string;
    title: string;
}

export const SectionTitle = ({ title, className }: SectionTitleProps) => {
    return <h2 className={clsx(s.sectionTitle, className)}>{title}</h2>;
};
