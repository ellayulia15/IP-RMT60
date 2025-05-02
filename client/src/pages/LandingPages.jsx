function LandingPage() {
    return (
        <div className="bg-[#A7D7A7] font-sans text-gray-800">
            {/* Hero */}
            <section className="bg-white py-16 text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-[#2E8B57] mb-4">
                        Berjelajah Bersama Kami
                    </h2>
                    <p className="text-lg mb-6 text-gray-700">
                        Paket wisata, liburan, dan ziarah dengan kenyamanan dan pelayanan terbaik.
                    </p>
                </div>
            </section>

            {/* Layanan */}
            <section id="layanan" className="py-16 bg-[#A7D7A7] text-center">
                <div className="container mx-auto px-6">
                    <h3 className="text-3xl font-bold text-[#2E8B57] mb-10">Layanan Kami</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl p-6 shadow">
                            <h4 className="text-xl font-bold text-[#2E8B57] mb-2">Wisata Alam</h4>
                            <p className="text-gray-600">
                                Nikmati keindahan alam dengan aman dan nyaman.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow">
                            <h4 className="text-xl font-bold text-[#2E8B57] mb-2">Wisata Hiburan</h4>
                            <p className="text-gray-600">
                                Nikmati berlibur dengan ceria dan bahagia.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow">
                            <h4 className="text-xl font-bold text-[#2E8B57] mb-2">Ziarah Wali</h4>
                            <p className="text-gray-600">
                                Kunjungi situs-situs bersejarah Islam dengan pemandu berpengalaman.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;