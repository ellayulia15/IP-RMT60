import { useEffect, useState } from "react";
import axios from "axios";

function EditProfilePage() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("access_token");

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                setMessage("Anda belum login");
                setLoading(false);
                return;
            }

            try {
                const { data } = await axios.get("http://localhost:3000/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(data);
                setForm(data);
            } catch (err) {
                console.error("Gagal fetch profile:", err);
                setMessage(err.response?.data?.message || "Gagal memuat profil");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setMessage("");
            const { data } = await axios.put(
                "http://localhost:3000/user",
                form,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setProfile(data);
            setMessage("Profil berhasil diperbarui");
        } catch (err) {
            console.error("Gagal update profile:", err);
            setMessage(err.response?.data?.message || "Gagal memperbarui profil");
        }
    };

    if (loading) return <div className="text-center mt-10">Memuat profil...</div>;

    if (!profile) return (
        <div className="text-center mt-10 text-red-500">
            {message || "Terjadi kesalahan saat memuat profil"}
        </div>
    );

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center text-green-700">Profil Saya</h2>

            {message && (
                <div className="text-center mb-4 text-sm text-blue-600">{message}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Nama Lengkap" name="fullName" value={form.fullName || ""} onChange={handleChange} />
                <Input label="NIK" name="nik" value={form.nik || ""} onChange={handleChange} />
                <label className="block text-sm font-medium mb-1">Jenis Kelamin</label>
                <select
                    name="gender"
                    value={form.gender || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-green-300 focus:outline-none"
                >
                    <option value="">-- Pilih --</option>
                    <option value="Pria">Pria</option>
                    <option value="Wanita">Wanita</option>
                </select>
                <Input label="Nomor Telepon" name="phoneNumber" value={form.phoneNumber || ""} onChange={handleChange} />
                <Input label="Alamat" name="address" value={form.address || ""} onChange={handleChange} />
                <Input label="URL Foto Profil" name="profilePicture" value={form.profilePicture || ""} onChange={handleChange} />

                <button
                    type="submit"
                    className="w-full py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
                >
                    Simpan Perubahan
                </button>
            </form>
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-green-300 focus:outline-none"
                {...props}
            />
        </div>
    );
}

export default EditProfilePage;