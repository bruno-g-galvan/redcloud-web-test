import axios from "axios";
import { ChangeEvent, useState } from "react";

async function uploadToS3(e: ChangeEvent<HTMLFormElement>) {
  const formData = new FormData(e.target);
  const file = formData.get("file");

  if (!file) {
    return null;
  }

  // @ts-ignore
  const fileType = encodeURIComponent(file.type);

  const { data } = await axios.get(`/api/media?fileType=${fileType}`);
  const { uploadUrl, key } = data;

  await axios.put(uploadUrl, file);

  return key;
}

function Upload() {
  const [message, setMessage] = useState<string | null>(null); // Message state
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null); // Message type (success or error)

  async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null); // Clear previous message
    setMessageType(null); // Clear previous message type

    try {
      const key = await uploadToS3(e);

      if (key) {
        setMessage("File uploaded successfully!");
        setMessageType("success");
      } else {
        setMessage("File upload failed.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error uploading file.");
      setMessageType("error");
    }
  }

  return (
    <div className="upload-container">
      <p className="upload-heading">Please select a file to upload</p>

      {message && (
        <div className={`upload-message ${messageType}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="file"
          accept="image/jpeg,image/png"
          name="file"
          className="upload-file-input"
        />
        <button type="submit" className="upload-button">
          Upload
        </button>
      </form>
    </div>
  );
}

export default Upload;
