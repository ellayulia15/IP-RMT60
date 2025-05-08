import React, { useState } from 'react';
import axios from 'axios';

function LandingPage() {
    const [showChat, setShowChat] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleChat = () => setShowChat(!showChat);

    const sendMessage = async () => {
        if (!userMessage) return;
        const newMessage = { sender: 'user', text: userMessage };
        setChatHistory([...chatHistory, newMessage]);
        setUserMessage('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/chat', { message: userMessage });
            const reply = { sender: 'ai', text: response.data.response };
            setChatHistory([...chatHistory, newMessage, reply]);
        } catch (error) {
            console.error('Gagal mengirim pesan:', error);
            setChatHistory([...chatHistory, newMessage, { sender: 'ai', text: 'Error, coba lagi.' }]);
        } finally {
            setLoading(false);
        }
    };

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
                        {['Wisata Alam', 'Wisata Hiburan', 'Ziarah Wali'].map((layanan, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow">
                                <h4 className="text-xl font-bold text-[#2E8B57] mb-2">{layanan}</h4>
                                <p className="text-gray-600">
                                    Nikmati {layanan.toLowerCase()} dengan aman dan nyaman.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Floating Chat Button */}
            <div className="fixed bottom-4 right-4">
                <button
                    onClick={toggleChat}
                    className="bg-[#2E8B57] text-white p-3 rounded-full shadow hover:bg-green-700"
                >
                    Chat AI
                </button>
            </div>

            {/* Chat Box */}
            {showChat && (
                <div className="fixed bottom-16 right-4 w-80 bg-white border rounded-lg shadow-md p-4">
                    <div className="h-64 overflow-y-auto mb-2">
                        {chatHistory.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-2 rounded mb-1 ${msg.sender === 'user' ? 'bg-gray-100' : 'bg-green-100'}`}
                            >
                                <span className="font-bold">{msg.sender === 'user' ? 'Anda' : 'AI'}: </span>
                                {msg.text}
                            </div>
                        ))}
                        {loading && <div className="text-gray-600">Mengetik...</div>}
                    </div>
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Ketik pesan..."
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            className="flex-1 p-2 border rounded-l"
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-[#2E8B57] text-white p-2 rounded-r"
                        >
                            Kirim
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LandingPage;
