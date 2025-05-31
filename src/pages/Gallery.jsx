import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import PhotoUpload from "../components/PhotoUpload";

const Gallery = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setPhotos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchPhotos();
  }, []);

  return (
    <div className="container mx-auto py-8 text-center text-[#041E42]">
      <h1 className="text-3xl font-bold mb-4">Photo Gallery</h1>
      <PhotoUpload />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white p-2 rounded shadow">
            <img src={photo.url} alt="Uploaded" className="w-full rounded" />
            <p className="text-sm mt-2">
              {photo.year} - {photo.company} - {photo.platoon}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
