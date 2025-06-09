import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import PhotoUpload from "../components/PhotoUpload";

const Gallery = () => {
  const [photosByYear, setPhotosByYear] = useState({});

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("*") // make sure it includes url, yeartaken, etc.
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
      <h1 className="text-3xl font-bold mb-4">Photo Gallery</h1>
      <PhotoUpload />
      {Object.entries(photosByYear).map(([year, photos]) => (
        <div key={year} className="mt-8">
          <h2 className="text-2xl font-bold mb-4">{year}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-white p-2 rounded shadow">
                <img
                  src={photo.url}
                  alt={photo.filename || "Uploaded photo"}
                  className="w-full rounded"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
