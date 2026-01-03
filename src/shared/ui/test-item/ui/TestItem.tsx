import {
    Clock,
    Users,
    BarChart,
    Share2,
    QrCode,
    Copy,
    Check
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import s from './TestItem.module.scss';

import { QRCodeSVG } from 'qrcode.react';

import { QRCodeModal } from '../../qrcode-modal';

interface TestItemProps {
    id: string;
    title: string;
    description: string;
    questionsCount: number;
    timeLimit: number;
    participants: number;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
}

export const TestItem = ({
    id,
    title,
    description,
    questionsCount,
    timeLimit,
    participants,
    difficulty,
    category
}: TestItemProps) => {
    const [, /* isHovered */ setIsHovered] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareButtonRef = useRef<HTMLButtonElement | null>(null);
    const shareDropdownRef = useRef<HTMLDivElement | null>(null);

    const testUrl = `${window.location.origin}/test/${id}`;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: description,
                    url: testUrl
                });
            } catch (error) {
                console.log('Ошибка при шаринге:', error);
            }
        } else {
            setShowShareOptions(!showShareOptions);
            setShowQRCode(false);
        }
    };

    useEffect(() => {
        if (!showQRCode) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowQRCode(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showQRCode]);

    useEffect(() => {
        if (!showShareOptions) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowShareOptions(false);
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;

            if (
                shareDropdownRef.current &&
                !shareDropdownRef.current.contains(target) &&
                shareButtonRef.current &&
                !shareButtonRef.current.contains(target)
            ) {
                setShowShareOptions(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showShareOptions]);

    useEffect(() => {
        if (!showQRCode) return;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, [showQRCode]);

    const copyLink = () => {
        navigator.clipboard.writeText(testUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setShowShareOptions(false);
    };

    const toggleQRCode = () => {
        setShowQRCode(!showQRCode);
        setShowShareOptions(false);
    };

    return (
        <div
            className={s.testCard}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                // setIsHovered(false);
                // setShowShareOptions(false);
                // setShowQRCode(false);
            }}
            onClick={() => console.log('Начать тест:', title)}>
            <div className={s.cardHeader}>
                <div className={s.categoryBadge}>{category}</div>
                <div className={s.headerActions}>
                    <div className={s.actionButtons}>
                        <button
                            ref={shareButtonRef}
                            className={s.actionButton}
                            onClick={e => {
                                e.stopPropagation();
                                handleShare();
                            }}
                            title="Поделиться">
                            <Share2 size={18} />
                        </button>
                        <button
                            className={s.actionButton}
                            onClick={e => {
                                e.stopPropagation();
                                toggleQRCode();
                            }}
                            title="QR код">
                            <QrCode size={18} />
                        </button>
                    </div>
                    <div className={`${s.difficultyBadge} ${s[difficulty]}`}>
                        {difficulty === 'easy' && 'Оңай'}
                        {difficulty === 'medium' && 'Орташа'}
                        {difficulty === 'hard' && 'Қиын'}
                    </div>
                </div>
            </div>

            <h3 className={s.title}>{title}</h3>
            <p className={s.description}>{description}</p>

            <div className={s.stats}>
                <div className={s.statItem}>
                    <BarChart size={20} />
                    <div>
                        <div className={s.statValue}>{questionsCount}</div>
                        <div className={s.statLabel}>сұрақ</div>
                    </div>
                </div>

                <div className={s.statItem}>
                    <Clock size={20} />
                    <div>
                        <div className={s.statValue}>{timeLimit}</div>
                        <div className={s.statLabel}>минут</div>
                    </div>
                </div>

                <div className={s.statItem}>
                    <Users size={20} />
                    <div>
                        <div className={s.statValue}>{participants}</div>
                        <div className={s.statLabel}>адам</div>
                    </div>
                </div>
            </div>

            <QRCodeModal
                isOpen={showQRCode}
                onClose={() => setShowQRCode(false)}>
                <h4>QR код теста</h4>

                <div className={s.qrCodePlaceholder}>
                    <QRCodeSVG
                        value={testUrl}
                        size={240}
                        level="H"
                        includeMargin
                        bgColor="#ffffff"
                        fgColor="#2f8450"
                    />
                </div>

                <p className={s.testLink}>{testUrl}</p>

                <button
                    className={s.copyButton}
                    onClick={copyLink}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Көшірілді!' : 'Сілтемені көшіру'}
                </button>

                <button
                    className={s.closeButton}
                    onClick={() => setShowQRCode(false)}>
                    Жабу
                </button>
            </QRCodeModal>

            {showShareOptions && (
                <div
                    ref={shareDropdownRef}
                    className={s.shareDropdown}>
                    <button
                        className={s.shareOption}
                        onClick={copyLink}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        <span>{copied ? 'Көшірілді' : 'Сілтемені көшіру'}</span>
                    </button>

                    <button
                        className={s.shareOption}
                        onClick={toggleQRCode}>
                        <QrCode size={16} />
                        <span>QR код алу</span>
                    </button>
                </div>
            )}

            <div className={s.footer}>
                <button className={s.startButton}>
                    <span>Тестті бастау</span>
                    <div className={s.arrow}>→</div>
                </button>
            </div>
        </div>
    );
};
