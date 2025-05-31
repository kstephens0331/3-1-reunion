import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, serverTimestamp, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import fallenImage from "../assets/images/fallen.jpg";

const Fallen = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    const q = query(collection(db, "fallenMessages"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleSubmit = async () => {
    if (!name || !message) return;
    await addDoc(collection(db, "fallenMessages"), {
      name,
      message,
      createdAt: serverTimestamp(),
    });
    setName("");
    setMessage("");
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="container mx-auto py-8 text-center">
      <h1 className="text-3xl font-bold text-[#E41E26] mb-4">Fallen Members</h1>
      <img src={fallenImage} alt="Fallen Members Tribute" className="mx-auto rounded shadow mb-4" />
      <p className="text-lg text-gray-700 mb-6">
        Honoring those from the 3/1 who are no longer with us.
      </p>

      {/* Scrapbook Form */}
      <div className="bg-white p-4 rounded shadow mb-8 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-2 text-[#E41E26]">Leave a Tribute</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <textarea
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button onClick={handleSubmit} className="bg-[#E41E26] text-white px-4 py-2 rounded">
          Submit
        </button>
      </div>

      {/* Display scrapbook messages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white p-4 rounded shadow transform rotate-[-2deg] hover:rotate-0 transition">
            <p className="text-sm font-bold">{msg.name}</p>
            <p className="text-gray-700">{msg.message}</p>
            <p className="text-xs text-gray-500 mt-2">{new Date(msg.createdAt?.toDate()).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fallen;
