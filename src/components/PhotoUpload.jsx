import { useState } from "react";
import { supabase } from "../supabaseClient";

const PhotoUpload = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!files.length) {
      setMessage("Please select image files to upload.");
      return;
    }

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        setMessage(`Upload error: ${uploadError.message}`);
        continue;
      }

      const { data: urlData, error: urlError } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      if (urlError || !urlData?.publicUrl) {
        console.error("URL error:", urlError?.message);
        setMessage(`URL error: ${urlError?.message}`);
        continue;
      }

      const yearTaken = file.lastModified
        ? new Date(file.lastModified).getFullYear()
        : new Date().getFullYear();

      const { error: insertError } = await supabase.from("gallery").insert([
        {
          url: urlData.publicUrl,
          filename: fileName,
          yeartaken: yearTaken,
          createdat: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        console.error("Insert error:", insertError.message);
        setMessage(`DB error: ${insertError.message}`);
        continue;
      }
    }

    setMessage("Upload complete!");
    setFiles([]);
  };

  return (
    <div className="text-center text-[#041E42]">
      <h2 className="text-2xl font-bold mb-4">Upload Photos</h2>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
        className="mb-2"
      />
      <br />
      <button
        onClick={handleUpload}
        className="bg-[#C99700] text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        Upload
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default PhotoUpload;
