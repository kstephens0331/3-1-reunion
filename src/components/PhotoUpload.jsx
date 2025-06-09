import { useState } from "react";
import { supabase } from "../supabaseClient";

// Helper: Generate SHA-256 hash of file
const getFileHash = async (file) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
};

const PhotoUpload = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!files.length || uploading) return;

    setUploading(true);
    setMessage("");
    setProgress(0);

    let uploadedCount = 0;
    const skippedFiles = [];

    for (const file of files) {
      const hash = await getFileHash(file);

      // Check for duplicate
      const { data: existing } = await supabase
        .from("gallery")
        .select("id")
        .eq("filehash", hash)
        .maybeSingle();

      if (existing) {
        console.warn("Duplicate found, skipping:", file.name);
        skippedFiles.push(file.name);
        uploadedCount++;
        setProgress(Math.round((uploadedCount / files.length) * 100));
        continue;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        setMessage(`Upload error: ${uploadError.message}`);
        uploadedCount++;
        setProgress(Math.round((uploadedCount / files.length) * 100));
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      const yearTaken = file.lastModified
        ? new Date(file.lastModified).getFullYear()
        : new Date().getFullYear();

      const { error: insertError } = await supabase.from("gallery").insert([
        {
          url: urlData.publicUrl,
          filename: fileName,
          yeartaken: yearTaken,
          createdat: new Date().toISOString(),
          filehash: hash,
        },
      ]);

      if (insertError) {
        console.error("Insert error:", insertError.message);
      }

      uploadedCount++;
      setProgress(Math.round((uploadedCount / files.length) * 100));
    }

    if (skippedFiles.length > 0) {
      setMessage(`Upload complete. Skipped duplicates: ${skippedFiles.join(", ")}`);
    } else {
      setMessage("Upload complete!");
    }

    setFiles([]);
    setUploading(false);
  };

  return (
    <div className="text-center text-[#041E42]">
      <h2 className="text-2xl font-bold mb-4">Upload Photos</h2>

      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
        disabled={uploading}
        className="mb-2"
      />
      <br />

      <button
        onClick={handleUpload}
        disabled={uploading || !files.length}
        className={`px-4 py-2 rounded mt-2 ${
          uploading ? "bg-gray-400 cursor-not-allowed" : "bg-[#C99700] hover:bg-yellow-600"
        } text-white`}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {progress > 0 && (
        <div className="mt-2">
          <div className="h-3 bg-gray-200 rounded">
            <div
              className="h-3 bg-[#C99700] rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1">{progress}% complete</p>
        </div>
      )}

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
};

export default PhotoUpload;
