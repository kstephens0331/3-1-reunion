import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, serverTimestamp, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import fallenImage from "../assets/images/fallen.jpg";

const Fallen = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Fetch messages from Firestore
  const fetchMessages = async () => {
    const q = query(collection(db, "fallenMessages"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // On page load, get messages
  useEffect(() => {
    fetchMessages();
  }, []);

  // Submit a new message
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

  return (
    <div className="container mx-auto py-8 text-center text-[#041E42]">
      <h1 className="text-3xl font-bold mb-4">Fallen Members</h1>
      <p className="text-lg mb-6">
        Honoring those from the 3/1 who are no longer with us.
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center mb-8 gap-4 md:gap-8">
        {/* Left column */}
        <ul className="flex-1 text-left list-disc list-inside">
          <li>Gunnery Sgt. Floyd Holley, 36, Casselberry, Fla.</li>
          <li>Sgt. Brandon Bury, 26, from Kingwood, Texas</li>
          <li>Sgt. John Rankel, 23, Speedway, Ind.</li>
          <li>Sgt. Joseph Caskey, 24, Pittsburgh</li>
          <li>Sgt. Kenneth May, 26, Kilgore, Texas</li>
          <li>Cpl. Jeffery Johnson, 21, Tomball, Texas</li>
          <li>Cpl. Donald Marler, 22, St. Louis</li>
        </ul>

        {/* Center image */}
        <div className="flex-shrink-0 mx-4">
          <img
            src={fallenImage}
            alt="Fallen Members Tribute"
            className="w-64 rounded shadow"
          />
        </div>

        {/* Spacer div for additional spacing on right */}
        <div className="hidden md:block w-8"></div>

        {/* Right column */}
        <ul className="flex-1 text-left list-disc list-inside">
          <li>Cpl. Larry Harris, 24, Thorton, Colo.</li>
          <li>Cpl. Max Donahue, 23, Highlands Ranch, Colo.</li>
          <li>Cpl. Kristopher Greer, 25, Ashland City, Tenn.</li>
          <li>Lance Cpl. Derek Hernandez, 20, Edinburgh, Texas</li>
          <li>Petty Officer 3rd Class Zarian Wood, 29, Houston</li>
          <li>Seaman William Ortega, 23, Miami</li>
          <li>Cpl. Matthew Thomas, 24, Great Britain</li>
        </ul>
      </div>

      {/* Scrapbook form */}
      <div className="bg-white p-4 rounded shadow mb-8 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-2">Leave a Tribute or a Memory</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full mb-2 text-[#041E42]"
        />
        <textarea
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 rounded w-full mb-2 text-[#041E42]"
        />
        <button
          onClick={handleSubmit}
          className="bg-[#C99700] text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>

      {/* Display scrapbook messages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white p-4 rounded shadow transform rotate-[-2deg] hover:rotate-0 transition"
          >
            <p className="text-sm font-bold">{msg.name}</p>
            <p>{msg.message}</p>
            <p className="text-xs text-gray-500 mt-2">
              {msg.createdAt && new Date(msg.createdAt.toDate()).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fallen;
