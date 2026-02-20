import { useEffect, useState } from 'react';

function Login() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // useEffect(() => {
    //     if (localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')) {
    //         window.location.href = '/';
    //     }
    // }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(import.meta.env.VITE_API_URI + '/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: user,
                    email: user,
                    password,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                //console.log(data);
                if (data && data.data.accessToken) {
                    localStorage.setItem('accessToken', data.data.accessToken);
                    localStorage.setItem('refreshToken', data.data.refreshToken);
                    sessionStorage.setItem('accessToken', data.data.accessToken);
                    sessionStorage.setItem('refreshToken', data.data.refreshToken);
                }

                window.location.href = '/';
            } else {
                const error = await res.json();
                setError(error.message || 'Login failed');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#5865F2] p-4">
            <div className="w-full max-w-120 bg-[#313338] rounded-lg shadow-2xl p-4 sm:p-6 md:p-8">
                <div className="text-center mb-4 md:mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#F2F3F5] mb-2">Welcome back</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#B5BAC1] uppercase mb-2">
                            Email or Username <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            className="w-full bg-[#1E1F22] border-none rounded px-3 py-2.5 text-[#DBDEE1] focus:outline-none focus:ring-0 placeholder-[#87898C]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#B5BAC1] uppercase mb-2">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#1E1F22] border-none rounded px-3 py-2.5 text-[#DBDEE1] focus:outline-none focus:ring-0 placeholder-[#87898C]"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium rounded py-3 transition-colors duration-200 mt-4"
                    >
                        Continue
                    </button>
                    <div className="text-sm text-[#949BA4] mt-2">
                        <a href="/register" className="text-[#00AFF4] hover:underline">
                            Need an account?
                        </a>
                    </div>
                    <p className="text-xs text-[#87898C] mt-4 leading-relaxed">
                        By logging in, you agree to Discord's{' '}
                        <a href="#" className="text-[#00AFF4] hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-[#00AFF4] hover:underline">Privacy Policy</a>.
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
