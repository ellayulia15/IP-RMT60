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

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#A7D7A7] flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-600">{message || "Memuat profil..."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#A7D7A7] py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-6 text-center text-[#2E8B57]">Profil Saya</h2>

                        {profile.profilePicture && (
                            <div className="flex justify-center mb-6">
                                <img
                                    src={profile.profilePicture}
                                    alt="Foto Profil"
                                    className="w-32 h-32 object-cover rounded-full shadow"
                                />
                            </div>
                        )}

                        <div className="space-y-4 text-gray-700">
                            <ProfileItem label="Nama Lengkap" value={profile.fullName} />
                            <ProfileItem label="NIK" value={profile.nik} />
                            <ProfileItem label="Jenis Kelamin" value={profile.gender} />
                            <ProfileItem label="Nomor Telepon" value={profile.phoneNumber} />
                            <ProfileItem label="Alamat" value={profile.address} />
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => navigate("/profile/edit")}
                                className="px-6 py-2 bg-[#2E8B57] text-white font-semibold rounded hover:bg-[#276746] transition"
                            >
                                Edit Profil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileItem({ label, value }) {
    return (
        <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-base text-gray-800">{value || "-"}</p>
        </div>
    );
}

export default ViewProfilePage;