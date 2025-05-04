import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const response = await axios.post('http://localhost:3000/register', form);
      console.log('Register sukses:', response.data);
      navigate('/login');
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Register gagal');
    }
  };

  return (
    <div className="min-h-screen bg-[#A7D7A7] flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-[#2E8B57] mb-6">
          Daftar Akun
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Masukkan nama Anda"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="contoh@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Kata Sandi</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2E8B57] text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
          >
            Daftar
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Sudah punya akun?{' '}
          <a href="/login" className="text-[#3B82F6] hover:underline font-medium">
            Masuk di sini
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
