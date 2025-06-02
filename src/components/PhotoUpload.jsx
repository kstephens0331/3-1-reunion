import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const PhotoUpload = () => {
  const [file, setFile] = useState(null);
  const [year, setYear] = useState("");
  const [company, setCompany] = useState("");
  const [platoon, setPlatoon] = useState("");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleUpload = () => {
    console.log("Upload button clicked!");
    if (!file || !year || !company || !platoon) {
      console.log("Missing fields:", { file, year, company, platoon });
      setMessage("Fill out all fields and select a file.");
      return;
    }

    console.log("Starting upload...");
    const storageRef = ref(storage, `gallery/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
        console.log("Upload progress:", prog);
      },
      (error) => {
        console.log("Upload error:", error);
        setMessage(`Error: ${error.message}`);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          console.log("Upload complete. Download URL:", url);
          await addDoc(collection(db, "gallery"), {
            url,
            year,
            company,
            platoon,
            createdAt: serverTimestamp(),
          });
          setMessage("Upload complete!");
          setFile(null);
          setYear("");
          setCompany("");
          setPlatoon("");
          setProgress(0);
        });
      }
    );
  };

  return (
    <div className="bg-white p-4 rounded shadow text-center text-[#041E42]">
      <h2 className="text-xl font-bold mb-2">Upload a Photo</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />
      <div className="flex flex-col md:flex-row md:space-x-2 mb-2">
        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-1 rounded w-full md:w-1/3"
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border p-1 rounded w-full md:w-1/3"
        />
        <input
          type="text"
          placeholder="Platoon"
          value={platoon}
          onChange={(e) => setPlatoon(e.target.value)}
          className="border p-1 rounded w-full md:w-1/3"
        />
      </div>
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
