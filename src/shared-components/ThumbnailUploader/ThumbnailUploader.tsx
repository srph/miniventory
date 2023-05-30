import React, { useState } from "react";
import invariant from "tiny-invariant";
import cx from "classnames";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "~/client/uploadthing";
import { AiFillPlusCircle } from "react-icons/ai";

interface ThumbnailUploaderProps {
  file?: string | null;
  onUpload?: (url: string) => void;
}

const accept = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
};

const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({
  file,
  onUpload,
}) => {
  const { isUploading, startUpload } = useUploadThing({
    endpoint: "imageUploader",
    onClientUploadComplete: (files) => {
      const file = files?.[0];
      invariant(file, "Missing file.");
      onUpload?.(file.fileUrl);
      setPreview("");
    },
    onUploadError: () => {
      setPreview("");
    },
  });

  const [preview, setPreview] = useState<string>("");

  const handleDrop = async (files: File[]) => {
    invariant(files[0], "No file provided.");
    setPreview(await reader(files[0]));
    startUpload(files.slice(0, 1));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
    disabled: isUploading,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cx(
        "group relative flex h-[240px] w-[240px] cursor-pointer items-center justify-center overflow-hidden rounded border border-dashed",
        {
          "border-neutral-600": !isDragActive,
          "border-blue-500": isDragActive,
        }
      )}
    >
      <input {...getInputProps()} />

      {!preview && file && (
        <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100">
          <div className="text-[32px] text-neutral-500">
            <AiFillPlusCircle />
          </div>
        </div>
      )}

      {Boolean(preview || file) && (
        <img
          src={preview || file}
          className={cx("object-cover", { "animate-pulse": isUploading })}
        />
      )}

      {!preview && !file && (
        <div aria-label="Button" className={cx("text-[32px] text-neutral-500")}>
          <AiFillPlusCircle />
        </div>
      )}
    </div>
  );
};

/**
 * Promisified FileReader that only reads and returns an image
 *
 * @example
 * reader(evt.target.files[0]).then(evt => {
 *   // evt.target.result);
 * })
 */
function reader(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (evt) => {
      invariant(
        typeof evt.target?.result === "string",
        "Invalid result type, expected string."
      );

      resolve(evt.target.result);
    };

    reader.onerror = (evt) => {
      reject(evt);
    };

    if (!/^image/.test(file.type)) {
      throw new Error("Invalid image type, expected image");
    }

    reader.readAsDataURL(file);
  });
}

export { ThumbnailUploader };
