import axios from "axios";
import { ChangeEvent } from "react";

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
  async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    const key = await uploadToS3(e);
  }

  return (
    <div className="upload-container">
      <p className="upload-heading">Please select a file to upload</p>
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
