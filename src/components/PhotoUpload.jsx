import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../firebase/firebase";

const PhotoUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleUpload = () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const storageRef = ref(storage, `gallery/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      },
      (error) => {
        setMessage(`Error: ${error.message}`);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, "gallery"), {
          url,
          createdAt: serverTimestamp(),
        });
        setMessage("Upload complete!");
        setFile(null);
        setProgress(0);
      }
    );
  };

  return (
    <div className="text-center text-[#041E42]">
      <h2 className="text-2xl font-bold mb-4">Upload a Photo</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        onClick={handleUpload}
        className="bg-[#C99700] text-white px-4 py-2 rounded mt-2 hover:bg-yellow-600"
      >
        Upload
      </button>
      {progress > 0 && <p>Progress: {Math.round(progress)}%</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default PhotoUpload;
