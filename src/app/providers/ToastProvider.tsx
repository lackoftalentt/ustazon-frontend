import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
    return (
        <Toaster
            position="top-center"
            toastOptions={{
                duration: 4000,
                success: {
                    iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff'
                    }
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff'
                    }
                }
            }}
        />
    );
};
