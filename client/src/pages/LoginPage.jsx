import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLoginSuccess = (token) => {
        localStorage.setItem('access_token', token);

        window.dispatchEvent(new CustomEvent('loginStatusChanged', { detail: { isLoggedIn: true } }));
        navigate('/profile');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setError('');
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, {
                email,
                password,
                authType: 'manual',
            });

            handleLoginSuccess(response.data.access_token);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Login gagal');
            } else {
                setError('Terjadi kesalahan saat login');
            }
        }
    };

    async function handleCredentialResponse(response) {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login/google`, {
                googleToken: response.credential,
            });
            console.log(data);

            handleLoginSuccess(data.access_token);
        } catch (err) {
            console.error('Google login error:', err);
            setError(err.response?.data?.message || 'Login dengan Google gagal');
        }
    }

    useEffect(() => {
        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            { theme: "outline", size: "large" }
        );

        window.google.accounts.id.prompt();
    }, []);

    return (
        <div className="min-h-screen bg-[#A7D7A7] flex items-center justify-center px-4">
            <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
                <h2 className="text-3xl font-bold text-center text-[#2E8B57] mb-6">
                    Masuk Akun
                </h2>

                {error && (
                    <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="contoh@email.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Kata Sandi</label>
                        <input
                            type="password"
                            placeholder="********"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#2E8B57] text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Masuk
                    </button>
                </form>

                <div className="my-4 text-center text-gray-500">atau</div>

                <div id="buttonDiv" className="flex justify-center"></div>

                <p className="text-center text-sm mt-6 text-gray-600">
                    Belum punya akun?{' '}
                    <a
                        href="/register"
                        className="text-[#3B82F6] hover:underline font-medium"
                    >
                        Daftar di sini
                    </a>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
