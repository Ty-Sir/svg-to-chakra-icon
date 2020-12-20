import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";

import Start from "./Start";
import Output from "./Output";
import { readFiles } from "../readFiles";

function Main() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [files, setFiles] = useState([]);

    // TODO React Dropzone docs wrap this in useCallback with [] dep array. Necessary?
    const onDrop = async (acceptedFiles, fileRejections) => {
        if (fileRejections?.length) return;

        setIsProcessing(true);
        try {
            const files = await readFiles(acceptedFiles);
            setFiles(files);
        } catch (e) {
            console.error(e);
        }
        setIsProcessing(false);
    };

    const {
        draggedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept: "image/svg+xml",
        onDrop,
    });

    const isDone = files?.length; // && svg optimization succeeds

    const getBg = () => {
        if (isDragReject) return "red.300";
        if (isDragActive) return "green.300";
        if (isDragAccept || isDone) return "#38B2AC";
        return "yellow.300";
    };

    return (
        <Box
            bg={getBg()}
            {...getRootProps()}
            transition="background-color 150ms"
        >
            {isDone ? (
                <Output files={files} />
            ) : (
                <>
                    <Start
                        isDragging={isDragActive}
                        numIcons={draggedFiles.length}
                        isProcessing={isProcessing}
                        error={isDragReject ? "SVG only please" : null}
                    />
                    <input {...getInputProps()} />
                </>
            )}
        </Box>
    );
}

export default Main;
