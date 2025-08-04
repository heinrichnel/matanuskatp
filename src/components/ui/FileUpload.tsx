import React from 'react';

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  onFileSelect: (files: FileList) => void;
  className?: string;
}

/**
 * FileUpload
 *
 * A FileUpload component
 *
 * @example
 * ```tsx
 * <FileUpload label="example" accept="example" multiple={true} className="example" />
 * ```
 *
 * @param props - Component props
 * @param props.label - label of the component
 * @param props.accept - accept of the component
 * @param props.multiple - multiple of the component
 * @param props.onFileSelect - onFileSelect of the component
 * @param props.className - className of the component
 * @returns React component
 */
const FileUpload: React.FC<FileUploadProps> = ({ label, accept, multiple, onFileSelect, className }) => {
  return (
    <div className={`flex flex-col space-y-2 ${className || ''}`}>
      {label && <label className="font-medium mb-1">{label}</label>}
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={e => {
          if (e.target.files) {
            onFileSelect(e.target.files);
          }
        }}
        className="border rounded p-2 focus:ring"
      />
    </div>
  );
};

export default FileUpload;
