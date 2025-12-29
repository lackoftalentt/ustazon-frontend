import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useCreateCardTopic } from '@/entities/card/model/useCards';
import s from './CreateTopicModal.module.scss';

interface CreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentTopicId?: number | null;
  parentTopicName?: string;
}

export const CreateTopicModal = ({
  isOpen,
  onClose,
  parentTopicId = null,
  parentTopicName
}: CreateTopicModalProps) => {
  const [topicName, setTopicName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const createTopic = useCreateCardTopic();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!topicName.trim()) return;

    setErrorMessage('');

    try {
      await createTopic.mutateAsync({
        topic: topicName,
        parent_topic_id: parentTopicId
      });

      setTopicName('');
      onClose();
    } catch (error: any) {
      console.error('Failed to create topic:', error);
      const detail = error?.response?.data?.detail || 'Тема құру мүмкін болмады';
      setErrorMessage(detail);
    }
  };

  const handleClose = () => {
    setTopicName('');
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Жаңа тема құру">
      <form onSubmit={handleSubmit} className={s.form}>
        {parentTopicName && (
          <div className={s.parentInfo}>
            <span className={s.label}>Басты тема:</span>
            <span className={s.parentName}>{parentTopicName}</span>
          </div>
        )}

        <div className={s.formGroup}>
          <label htmlFor="topicName" className={s.label}>
            Тема атауы *
          </label>
          <Input
            id="topicName"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            placeholder="Тема атауын енгізіңіз"
            required
            autoFocus
          />
        </div>

        <div className={s.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
          >
            Болдырмау
          </Button>
          <Button
            type="submit"
            disabled={!topicName.trim() || createTopic.isPending}
          >
            {createTopic.isPending ? 'Сақталуда...' : 'Құру'}
          </Button>
        </div>

        {errorMessage && (
          <div className={s.error}>
            {errorMessage === 'Topic with this name already exists'
              ? 'Бұл атаумен тема бұрыннан бар'
              : errorMessage === 'Not authenticated'
              ? 'Аутентификация қажет. Кіріңіз.'
              : errorMessage}
          </div>
        )}
      </form>
    </Modal>
  );
};
