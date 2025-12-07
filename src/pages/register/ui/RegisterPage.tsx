import { RegisterForm } from '@/features/auth/ui/register-form';
import s from './RegisterPage.module.scss';
import Illustration from '@/shared/assets/images/auth-illustration.png';

export const RegisterPage = () => {
    return (
        <main className={s.RegisterPage}>
            <div className={s.illustration}>
                <img
                    src={Illustration}
                    alt="Illustration"
                    className={s.Illustration}
                />
            </div>
            <div className={s.form}>
                <RegisterForm />
            </div>
        </main>
    );
};

export default RegisterPage;
