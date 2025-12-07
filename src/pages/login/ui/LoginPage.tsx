import s from './LoginPage.module.scss';
import Illustration from '@/shared/assets/images/auth-illustration.png';
import { LoginForm } from '@/features/auth/ui/login-form';

export const LoginPage = () => {
    return (
        <main className={s.LoginPage}>
            <div className={s.illustration}>
                <img
                    src={Illustration}
                    alt="Illustration"
                    className={s.Illustration}
                />
            </div>
            <div className={s.form}>
                <LoginForm />
            </div>
        </main>
    );
};

export default LoginPage;
