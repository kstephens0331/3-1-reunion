import { useState } from "react";
import { supabase } from "../supabaseClient";

const PhotoUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file || !(file instanceof File)) {
      setMessage("Please select a valid image file.");
      return;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("photos") // Ensure this matches your bucket name
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      setMessage(`Upload error: ${uploadError.message}`);
      return;
    }

    // Get the public URL of the uploaded image
    const { data: urlData, error: urlError } = supabase.storage
      .from("photos")
      .getPublicUrl(filePath);

    if (urlError || !urlData?.publicUrl) {
      console.error("URL error:", urlError?.message);
      setMessage(`URL error: ${urlError?.message}`);
      return;
    }

    // ✅ Define yearTaken properly before using it
    const yearTaken = file.lastModified
      ? new Date(file.lastModified).getFullYear()
      : new Date().getFullYear();

    // Insert photo metadata into the 'gallery' table
    const { error: insertError } = await supabase.from("gallery").insert([
      {
        url: urlData.publicUrl,
        filename: fileName,
        yeartaken: yearTaken, // must match lowercase DB column
        createdat: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError.message);
      setMessage(`DB error: ${insertError.message}`);
    } else {
      setMessage("Upload complete!");
      setFile(null);
      setProgress(0);
    }
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
