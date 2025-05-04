import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

function ViewProfilePage() {
    const [profile, setProfile] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get("http://localhost:3000/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(data);
            } catch (err) {
                console.error(err);
                setMessage("Gagal memuat profil");
            }
        };

        fetchProfile();
    }, [token]);

    if (!profile) return <div className="text-center mt-10">{message || "Memuat profil..."}</div>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Profil Saya</h2>

            {profile.profilePicture && (
                <div className="flex justify-center mb-6">
                    <img
                        src={profile.profilePicture}
                        alt="Foto Profil"
                        className="w-32 h-32 object-cover rounded-full shadow"
                    />
                </div>
            )}

            <div className="space-y-2 text-gray-700">
                <ProfileItem label="Nama Lengkap" value={profile.fullName} />
                <ProfileItem label="NIK" value={profile.nik} />
                <ProfileItem label="Jenis Kelamin" value={profile.gender} />
                <ProfileItem label="Nomor Telepon" value={profile.phoneNumber} />
                <ProfileItem label="Alamat" value={profile.address} />
            </div>

            <div className="mt-6 text-center">
                <button
                    onClick={() => navigate("/profile/edit")}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
                >
                    Edit Profil
                </button>
            </div>
        </div>
    );
}

function ProfileItem({ label, value }) {
    return (
        <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-base">{value || "-"}</p>
        </div>
    );
}

export default ViewProfilePage;