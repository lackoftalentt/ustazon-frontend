import { forwardRef } from 'react';
import { clsx } from 'clsx';
import s from './SearchInput.module.scss';
import SearchIcon from '@/shared/assets/icons/search.svg?react';

export interface SearchInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onSubmit'> {
    className?: string;
    onSubmit?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, onSubmit, ...inputProps }, ref) => {
        return (
            <form
                className={clsx(s.searchBox, className)}
                onSubmit={e => {
                    e.preventDefault();
                    onSubmit?.();
                }}
                role="search">
                <span
                    className={s.searchIcon}
                    aria-hidden>
                    <SearchIcon />
                </span>

                <input
                    {...inputProps}
                    ref={ref}
                    type="search"
                    placeholder={inputProps.placeholder}
                    className={s.searchInput}
                />
            </form>
        );
    }
);

SearchInput.displayName = 'SearchInput';
