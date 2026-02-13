import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Copy, Check } from 'lucide-react';
import s from './CodeBlock.module.scss';

interface CodeBlockProps {
    children: string;
    language: string;
}

export const CodeBlock = ({ children, language }: CodeBlockProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
        }
    };

    return (
        <div className={s.codeBlock}>
            <div className={s.codeHeader}>
                <span className={s.codeLang}>{language || 'code'}</span>
                <button
                    className={`${s.copyCodeBtn} ${copied ? s.copied : ''}`}
                    onClick={handleCopy}
                >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <div className={s.codeContent}>
                <Highlight theme={themes.vsDark} code={children.trim()} language={language || 'text'}>
                    {({ style, tokens, getLineProps, getTokenProps }) => (
                        <pre style={style}>
                            {tokens.map((line, i) => (
                                <div key={i} {...getLineProps({ line })}>
                                    {line.map((token, key) => (
                                        <span key={key} {...getTokenProps({ token })} />
                                    ))}
                                </div>
                            ))}
                        </pre>
                    )}
                </Highlight>
            </div>
        </div>
    );
};

interface InlineCodeProps {
    children: React.ReactNode;
}

export const InlineCode = ({ children }: InlineCodeProps) => {
    return <code className={s.inlineCode}>{children}</code>;
};
