import { ResetPasswordForm } from '@/features/auth/ui/reset-password-form/ui/ResetPasswordForm';
import s from './ResetPasswordPage.module.scss';
import Illustration from '@/shared/assets/images/auth-illustration.png';

export const ResetPasswordPage = () => {
    return (
        <main className={s.ResetPasswordPage}>
            <div className={s.illustration}>
                <img
                    src={Illustration}
                    alt="Illustration"
                    className={s.Illustration}
                />
            </div>
            <div className={s.form}>
                <ResetPasswordForm />
            </div>
        </main>
    );
};

export default ResetPasswordPage;
