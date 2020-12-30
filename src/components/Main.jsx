import { useState, useLayoutEffect } from "react";
import { Flex } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";

import Start from "./Start";
import Output from "./Output";
import Footer from "./Footer";
import { processFiles } from "../utils/processFiles";

const sx = {
    main: {
        minHeight: "100vh",
        direction: "column",
    },
    footer: {
        mt: "auto",
    },
};

function Main() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState();
    const isDone = files?.length > 0;

    // TODO React Dropzone docs wrap this in useCallback with [] dep array. Necessary?
    const onDrop = async (acceptedFiles, fileRejections) => {
        if (fileRejections?.length) return;

        setIsProcessing(true);
        try {
            const files = await processFiles(acceptedFiles);
            const unique = [
                ...new Map(files.map(file => [file.name, file])).values(),
            ];
            const sorted = unique.sort((a, b) => (a.name > b.name ? 1 : -1));
            setFiles(sorted);
        } catch (e) {
            setError("Something went wrong. See console.");
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

    useLayoutEffect(() => {
        setError(isDragReject ? "SVG only please" : null);
    }, [isDragReject, isDragActive, isDragAccept]);

    const getBg = () => {
        if (error) return "red.300";
        if (isDragActive) return "green.300";
        if (isDragAccept || isProcessing || isDone) return "#38B2AC";
        return "yellow.300";
    };

    return (
        <Flex
            {...sx.main}
            bg={getBg()}
            {...getRootProps()}
            transition="background-color 150ms"
        >
            {isDone ? (
                <Output files={files} onReset={() => setFiles([])} />
            ) : (
                <>
                    <Start
                        isDragging={isDragActive}
                        isProcessing={isDragAccept || isProcessing}
                        numIcons={draggedFiles.length}
                        error={error}
                    />
                    <input {...getInputProps()} />
                </>
            )}
            <Footer {...sx.footer} />
        </Flex>
    );
}

export default Main;
