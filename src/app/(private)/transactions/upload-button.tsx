import type { HTMLAttributes } from "react";
import { LuUpload } from "react-icons/lu";
import { useCSVReader } from "react-papaparse";

import { Button } from "@/components/ui/button";

type Props = {
  onUpload: (results: {
    data: string[][];
    errors: unknown[];
    meta: Record<string, unknown>;
  }) => void;
};

/**
 * Presentational wrapper component integrating a localized file upload anchor.
 */
export const UploadButton = ({ onUpload }: Props) => {
  // Destructures the main CSV parser context layout tool to build file drop zones
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: { getRootProps: () => HTMLAttributes<HTMLElement> }) => (
        /* Action button mapping file drop native interactions directly to styling layers */
        <Button
          className="transition-color w-[calc(50%-0.25rem)] cursor-pointer bg-teal-500 shadow-none duration-300 ease-in-out hover:bg-teal-400 hover:shadow-lg hover:shadow-teal-200/50 md:w-auto"
          {...getRootProps()}
        >
          <LuUpload className="size-4" />
          Import
        </Button>
      )}
    </CSVReader>
  );
};
