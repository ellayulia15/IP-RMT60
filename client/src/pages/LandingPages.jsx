import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function LandingPage() {
    const [showChat, setShowChat] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatBoxRef = useRef(null);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const toggleChat = () => {
        if (!showChat) {
            setChatHistory((prev) => [
                ...prev,
                {
                    sender: 'ai',
                    text: 'Halo! Selamat datang di S Tour and Travel. Saya siap membantu Anda dengan informasi seputar:\n• Paket Wisata (alam, hiburan, ziarah)\n• Sewa Kendaraan (bus, elf, mobil)\n\nSilakan tanyakan apa yang Anda butuhkan!'
                },
            ]);
        }
        setShowChat(!showChat);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatResponse = (text) => {
        return text.split('\n').map((line, i) => (
            <React.Fragment key={i}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    const sendMessage = async () => {
        if (!userMessage.trim()) return;

        const newMessage = { sender: 'user', text: userMessage.trim() };
        setChatHistory((prev) => [...prev, newMessage]);
        setUserMessage('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/chat', {
                message: newMessage.text
            });

            const reply = {
                sender: 'ai',
                text: response.data.response,
                type: response.data.type
            };

            setChatHistory((prev) => [...prev, reply]);
        } catch (error) {
            console.error('Gagal mengirim pesan:', error);
            const errorMessage = {
                sender: 'ai',
                text: 'Maaf, terjadi kesalahan. Silakan coba lagi dalam beberapa saat.',
                type: 'error'
            };
            setChatHistory((prev) => [...prev, errorMessage]);
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
                            <div key={index} className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
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
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={toggleChat}
                    className="bg-[#2E8B57] text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                    {showChat ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Chat Box */}
            {showChat && (
                <div className="fixed bottom-20 right-4 w-96 bg-white border rounded-lg shadow-xl z-50">
                    <div className="bg-[#2E8B57] text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-semibold">Chat dengan AI Assistant</h3>
                        <button onClick={toggleChat} className="text-white hover:text-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div ref={chatBoxRef} className="h-96 overflow-y-auto p-4 space-y-4">
                        {chatHistory.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user'
                                        ? 'bg-[#2E8B57] text-white rounded-br-none'
                                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                    }`}>
                                    {formatResponse(msg.text)}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-500 p-3 rounded-lg rounded-bl-none">
                                    Mengetik...
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="Ketik pesan Anda..."
                                value={userMessage}
                                onChange={(e) => setUserMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading}
                                className={`px-4 py-2 bg-[#2E8B57] text-white rounded-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                                    }`}
                            >
                                Kirim
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LandingPage;
