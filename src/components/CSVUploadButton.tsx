import React, { useRef } from "react";
import DiscreetButton from "./base/DiscreetButton";

interface CSVUploadButtonProps {
  onFileUpload: (content: string) => void;
}

const CSVUploadButton: React.FC<CSVUploadButtonProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target?.result as string;
      onFileUpload(fileContent);
    };

    reader.readAsText(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <DiscreetButton onClick={handleClick}>Import from CSV</DiscreetButton>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".csv"
        onChange={handleFileUpload}
      />
    </>
  );
};

export default CSVUploadButton;
