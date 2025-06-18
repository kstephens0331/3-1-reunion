import { supabase } from "../supabase";
import React, { useState } from "react";

export default function PhotoUpload() {
  const [file, setFile] = useState(null);
  const [yearTaken, setYearTaken] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !yearTaken) {
      alert("Please select a file and enter the year taken.");
      return;
    }

    setUploading(true);
    setError(null);

    const filePath = `gallery/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(filePath, file);

    if (uploadError) {
      setError("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("photos").getPublicUrl(filePath);

    const fileHash = await hashFile(file);

    const { error: insertError } = await supabase.from("gallery").insert({
      filename: file.name,
      url: publicUrl,
      yeartaken: parseInt(yearTaken),
      filehash: fileHash,
    });

    if (insertError) {
      setError("Insert into gallery failed: " + insertError.message);
    } else {
      alert("Upload successful!");
    }

    setUploading(false);
  };

  async function hashFile(file) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    return [...new Uint8Array(hashBuffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-xl font-bold mb-4">Upload a Photo</h2>
      <input type="file" onChange={handleFileChange} />
      <input
        type="number"
        className="border p-2 mt-2 w-full"
        placeholder="Year Taken"
        value={yearTaken}
        onChange={(e) => setYearTaken(e.target.value)}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Photo"}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}