import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { aiApi, UserPresentation } from '@/shared/api/ai';
import { Presentation, AlertCircle, Loader2 } from 'lucide-react';
import { AIGeneratorLayout } from '@/features/ai-tools/ui/components/AIGeneratorLayout/AIGeneratorLayout';
import { AIInput } from '@/features/ai-tools/ui/components/AIInput/AIInput';
import { AISelect } from '@/features/ai-tools/ui/components/AISelect/AISelect';
import { AIButton } from '@/features/ai-tools/ui/components/AIButton/AIButton';
import styles from './PrezaGenerator.module.scss';

const POLL_INTERVAL = 10_000; // 10 секунд

export const PrezaGenerator = () => {
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [topic, setTopic] = useState('');
  const [slidesCount, setSlidesCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const generatingIdsRef = useRef<number[]>([]);
  const statusMapRef = useRef<Map<number, string>>(new Map());
  const [hasActiveIds, setHasActiveIds] = useState(false);

  /* ===========================
     ПАЙДАЛАНУШЫ ПРЕЗЕНТАЦИЯЛАРЫ
     =========================== */
  const {
    data: presentations = [],
    isLoading: isPresentationsLoading,
  } = useQuery({
    queryKey: ['user-presentations'],
    queryFn: aiApi.getUserPresentations,
    refetchOnWindowFocus: false,
    staleTime: 5_000,
  });

  const SUBJECTS = [
  'Балабақша',
  'Бастауыш',
  'Математика',
  'Қазақ тілі | әдебиеті',
  'Тарих',
  'География',
  'Биология',
  'Информатика',
  'Физика',
  'Химия',
  'Орыс тілі',
  'Ағылшын тілі',
  'Еңбек',
  'Дене шынықтыру',
  'Геометрия',
  'Қазақ тілі',
  'Қазақ әдебиеті',
  'Қазақстан тарихы',
  'Дүниежүзі тарих',
  'Python',
];



  /* ===========================
     ГЕНЕРАЦИЯ БОЛЫП ЖАТҚАНДАР
     =========================== */
  useEffect(() => {
    const active = presentations.filter(
      p => p.status === 'generating' || p.status === 'pending'
    );
    generatingIdsRef.current = active.map(p => p.id);
    statusMapRef.current = new Map(active.map(p => [p.id, p.status]));
    setHasActiveIds(active.length > 0);
  }, [presentations]);

  /* ===========================
     СТАТУСТЫ ТЕКСЕРУ (POLLING)
     =========================== */
  const pollStatuses = useCallback(async () => {
    const ids = generatingIdsRef.current;
    if (ids.length === 0) return;

    const statusPromises = ids.map(async (id) => {
      try {
        const res = await aiApi.checkPresentationStatus(id);
        const prevStatus = statusMapRef.current.get(id);
        if (res.status !== prevStatus) {
          return true;
        }
      } catch {
        // қателер әдейі еленбейді
      }
      return false;
    });

    const results = await Promise.all(statusPromises);
    const changed = results.some(Boolean);

    if (changed) {
      queryClient.invalidateQueries({ queryKey: ['user-presentations'] });
    }
  }, [queryClient]);

  useEffect(() => {
    if (!hasActiveIds) return;

    let intervalId: NodeJS.Timeout | null = null;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        pollStatuses();
        intervalId = setInterval(pollStatuses, POLL_INTERVAL);
      } else if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    pollStatuses();
    if (document.visibilityState === 'visible') {
      intervalId = setInterval(pollStatuses, POLL_INTERVAL);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasActiveIds, pollStatuses]);

  /* ===========================
     ПРЕЗЕНТАЦИЯ ҚҰРУ
     =========================== */
  const handleGenerate = async () => {
    if (!subject || !grade || !topic) {
      setError('Барлық міндетті өрістерді толтырыңыз');
      return;
    }

if (slidesCount < 1 || slidesCount > 15) {
  setError('Слайдтар саны 1 мен 10 аралығында болуы керек');
  return;
}

    try {
      setIsGenerating(true);
      setError(null);

      await aiApi.generatePresentation(subject, grade, topic, slidesCount);

      setSubject('');
      setGrade('');
      setTopic('');
      setSlidesCount(12);

      queryClient.invalidateQueries({ queryKey: ['user-presentations'] });
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(
        err.response?.data?.detail ||
        'Генерацияны бастау мүмкін болмады. Кейінірек қайталап көріңіз'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  /* ===========================
     ПРЕЗЕНТАЦИЯНЫ АШУ
     =========================== */
  const handlePresentationClick = (p: UserPresentation) => {
    if (p.status === 'completed' && p.gamma_url) {
      window.open(p.gamma_url, '_blank', 'noopener,noreferrer');
    }
  };

  /* ===========================
     СТАТУС БЕЛГІСІ
     =========================== */
  const renderStatus = (p: UserPresentation) => {
    if (p.status === 'pending') {
      return (
        <span className={`${styles.statusBadge} ${styles.statusGenerating}`}>
          <Loader2 size={12} className={styles.spinner} />
          Іске қосылуда…
        </span>
      );
    }

    if (p.status === 'generating') {
      return (
        <span className={`${styles.statusBadge} ${styles.statusGenerating}`}>
          <Loader2 size={12} className={styles.spinner} />
          Генерация…
        </span>
      );
    }

    if (p.status === 'completed') {
      return (
        <span className={`${styles.statusBadge} ${styles.statusReady}`}>
          Дайын
        </span>
      );
    }

    if (p.status === 'failed') {
      return (
        <span className={`${styles.statusBadge} ${styles.statusFailed}`}>
          Қате
        </span>
      );
    }

    return (
      <span className={`${styles.statusBadge} ${styles.statusUnknown}`}>
        {p.status || 'Белгісіз'}
      </span>
    );
  };

  /* ===========================
     ФОРМА
     =========================== */
  const form = (
    <>
      <AISelect
        label="Пән"
        value={subject}
        onChange={e => setSubject(e.target.value)}
        required
      >
        <option value="">Пәнді таңдаңыз</option>
        {SUBJECTS.map(s => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </AISelect>

      <AISelect
        label="Сынып"
        value={grade}
        onChange={e => setGrade(e.target.value)}
        required
      >
        <option value="">Сыныпты таңдаңыз</option>
        {[1,2,3,4,5,6,7,8,9,10,11].map(n => (
          <option key={n} value={`${n} сынып`}>
            {n} сынып
          </option>
        ))}
      </AISelect>

      <AIInput
        label="Сабақ тақырыбы"
        placeholder="Мысалы: Ұлы Жібек жолы"
        value={topic}
        onChange={e => setTopic(e.target.value)}
      />

      <AIInput
        label="Слайдтар саны"
        type="number"
        min={5}
        max={15}
        value={slidesCount}
        onChange={e => setSlidesCount(Number(e.target.value))}
      />

      <AIButton
        onClick={handleGenerate}
        disabled={isGenerating}
        icon={<Presentation />}
        style={{ marginTop: '1rem' }}
      >
        {isGenerating ? 'Жіберілуде…' : 'Презентация жасау'}
      </AIButton>
    </>
  );

  /* ===========================
     АЛДЫН АЛА КӨРУ
     =========================== */
  const preview = error ? (
    <div className={styles.errorState}>
      <AlertCircle size={48} />
      <p>{error}</p>
      <AIButton variant="secondary" onClick={() => setError(null)}>
        Қайта көру
      </AIButton>
    </div>
  ) : (
    <div className={styles.presentationsPreview}>
      <h3>Менің презентацияларым</h3>

      {isPresentationsLoading ? (
        <Loader2 className={styles.spinner} />
      ) : presentations.length === 0 ? (
        <p>Презентациялар әлі жоқ</p>
      ) : (
        <div className={styles.presentationsList}>
          {presentations.map(p => (
            <div
              key={p.id}
              className={`${styles.presentationItem} ${
                p.status === 'completed' ? styles.presentationClickable : ''
              }`}
              onClick={() => handlePresentationClick(p)}
            >
              <div className={styles.cardHeader}>
                <Presentation size={16} className={styles.cardIcon} />
                {renderStatus(p)}
              </div>
              <div className={styles.cardTitle}>
                {p.topic || 'Тақырыпсыз'}
              </div>
              <div className={styles.cardMeta}>
                {p.grade || 'Көрсетілмеген'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <AIGeneratorLayout
      title="Презентациялар генераторы"
      description="Презентациялар Gamma арқылы жасалып, онлайн ашылады"
      icon={<Presentation size={28} />}
      form={form}
      preview={preview}
      isGenerating={isGenerating}
    />
  );
};