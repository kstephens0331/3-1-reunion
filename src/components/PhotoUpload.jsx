import { useState, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firebase/firebase";

const PhotoUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState([]);

  const handleUpload = () => {
    if (!file) {
      setMessage("Select a file to upload.");
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
      () => {
        setMessage("Upload complete!");
        setFile(null);
        setProgress(0);
        fetchPhotos(); // Refresh gallery after upload
      }
    );
  };

  const fetchPhotos = async () => {
    const galleryRef = ref(storage, "gallery");
    const result = await listAll(galleryRef);
    const urls = await Promise.all(result.items.map((itemRef) => getDownloadURL(itemRef)));
    setPhotos(urls);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <div className="container mx-auto py-8 text-center text-[#041E42]">
      <h2 className="text-2xl font-bold mb-4">Upload a Photo</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className="bg-[#C99700] text-white px-4 py-2 rounded mt-2 hover:bg-yellow-600"
      >
        Upload
      </button>
      {progress > 0 && <p>Progress: {Math.round(progress)}%</p>}
      {message && <p>{message}</p>}

      <h2 className="text-2xl font-bold mt-8 mb-4">Photo Album</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {photos.map((url, idx) => (
          <div key={idx} className="bg-white p-2 rounded shadow">
            <img src={url} alt="Uploaded" className="w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoUpload;
