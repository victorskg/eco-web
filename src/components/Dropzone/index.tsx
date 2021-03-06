import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./styles.css";
import { FiUpload } from "react-icons/fi";

interface Props {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
  const [selectedFileURL, setSelectedFileURL] = useState("");

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      setSelectedFileURL(URL.createObjectURL(file));
      onFileUploaded(file);
    },
    [onFileUploaded]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />

      {selectedFileURL ? (
        <img src={selectedFileURL} alt="Foto do Estabelecimento" />
      ) : (
        <p>
          <FiUpload style={{ cursor: "pointer" }} />
          Imagem do estabelecimento
        </p>
      )}
    </div>
  );
};

export default Dropzone;
