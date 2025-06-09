import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import PhotoUpload from "../components/PhotoUpload";

const Gallery = () => {
  const [photosByYear, setPhotosByYear] = useState({});
  const [openYear, setOpenYear] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("yeartaken", { ascending: false });

      if (error) {
        console.error("Error fetching photos:", error);
        return;
      }

      const grouped = data.reduce((acc, photo) => {
        const year = photo.yeartaken || "Unknown";
        if (!acc[year]) acc[year] = [];
        acc[year].push(photo);
        return acc;
      }, {});

      setPhotosByYear(grouped);
    };

    fetchPhotos();
  }, []);

  return (
    <div className="container mx-auto py-8 text-center text-[#041E42]">
      <h1 className="text-3xl font-bold mb-6">Photo Gallery</h1>
      <PhotoUpload />

      {!openYear ? (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">View by Year</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(photosByYear).map((year) => (
              <div
                key={year}
                className="cursor-pointer bg-[#f8f9fa] p-6 rounded shadow hover:shadow-lg"
                onClick={() => setOpenYear(year)}
              >
                <h2 className="text-xl font-semibold">{year}</h2>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">{openYear} Album</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photosByYear[openYear].map((photo) => (
              <div key={photo.id} className="bg-white p-2 rounded shadow">
                <img
                  src={photo.url}
                  alt={photo.filename || "Uploaded photo"}
                  className="w-full rounded"
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => setOpenYear(null)}
            className="mt-6 bg-[#C99700] text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Back to Years
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
