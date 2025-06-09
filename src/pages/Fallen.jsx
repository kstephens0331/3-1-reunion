import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import fallenImage from "../assets/images/fallen.jpg";

const Fallen = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
const { data, error } = await supabase
  .from("fallenmessages")
  .select("*")
  .order("createdat", { ascending: false });

    if (!error) setMessages(data);
  };

  const handleSubmit = async () => {
    if (!name || !message) return;

const { error } = await supabase.from("fallenmessages").insert([
  { name, message, createdat: new Date().toISOString() }
]);

    if (!error) {
      setName("");
      setMessage("");
      fetchMessages();
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="container mx-auto py-8 text-center text-[#041E42]">
      <h1 className="text-3xl font-bold mb-4">Fallen Members</h1>
      <p className="text-lg mb-6">Honoring those from the 3/1 who are no longer with us.</p>
      <img src={fallenImage} alt="Fallen Tribute" className="w-64 mx-auto mb-6 rounded shadow" />

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white p-4 rounded shadow transform rotate-[-2deg] hover:rotate-0 transition">
            <p className="text-sm font-bold">{msg.name}</p>
            <p>{msg.message}</p>
            <p className="text-xs text-gray-500 mt-2">{new Date(msg.createdat).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fallen;
