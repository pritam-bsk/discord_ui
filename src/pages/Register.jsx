import { useEffect, useState } from 'react';

function Register() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")) {
            window.location.href = "/";
        }
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        if(password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }
        if(username.length < 3) {
            setError("Username must be at least 3 characters long");
            return;
        }
        try {
            const res = await fetch(import.meta.env.VITE_API_URI + "/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

            if (res.ok) {
                window.location.href = "/login";
            } else {
                const error = await res.json();
                setError(error.message || "Registration failed");
            }
        } catch (error) {
            setError(error.message);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#5865F2] p-4">
            <div className="w-full max-w-120 bg-[#313338] rounded-lg shadow-2xl p-4 sm:p-6 md:p-8">
                <div className="text-center mb-4 md:mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#F2F3F5] mb-2">Create an account</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#B5BAC1] uppercase mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#1E1F22] border-none rounded px-3 py-2.5 text-[#DBDEE1] focus:outline-none focus:ring-0 placeholder-[#87898C]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#B5BAC1] uppercase mb-2">
                            Username <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                        <a href="/login" className="text-[#00AFF4] hover:underline">
                            Already have an account?
                        </a>
                    </div>
                    <p className="text-xs text-[#87898C] mt-4 leading-relaxed">
                        By registering, you agree to Discord's{' '}
                        <a href="#" className="text-[#00AFF4] hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-[#00AFF4] hover:underline">Privacy Policy</a>.
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
