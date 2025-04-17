/* eslint-disable @typescript-eslint/no-explicit-any */
import { LuUpload } from "react-icons/lu";
import { useCSVReader } from "react-papaparse";

import { Button } from "@/components/ui/button";

type Props = {
  onUpload: (results: any) => void;
};

export const UploadButton = ({ onUpload }: Props) => {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: any) => (
        <Button
          className="transition-color w-[calc(50%-0.25rem)] md:w-auto cursor-pointer bg-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50"
          {...getRootProps()}
        >
          <LuUpload className="size-4" />
          Import
        </Button>
      )}
    </CSVReader>
  );
};
