import React, {
  KeyboardEvent, ReactNode,
  useCallback,
  useEffect, useMemo, useRef,
  useState
} from "react";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import Button from "@/components/Button";
import { ArrowClockwise, ChevronBarDown, Newspaper } from "react-bootstrap-icons";
import Select from "@/components/Select";
import BoxGroup from "@/components/BoxGroup";
import usePing from "@/hooks/usePing";
import SendCommandForm from "@/features/dashboard/atoms/SendCommandForm";
import clsx from "clsx";
import { clipboardCopy } from "@/utils/utils";
import FileViewer from "@/components/FileViewer";
import { motion, AnimatePresence } from "framer-motion";

const handleKeydown = (event: Event) => {
  const e = event as any as KeyboardEvent<HTMLBodyElement>;

  if (document.activeElement?.tagName === "INPUT") {
    return;
  }

  if (e.key === "/") {
    e.preventDefault();
    document.getElementById("command-input")?.focus();
  }
};

function removeMatching(originalArray: string[], regex: RegExp) {
  let j = 0;
  while (j < originalArray.length) {
    if (regex.test(originalArray[j]))
      originalArray.splice(j, 1);
    else
      j++;
  }
  return originalArray;
}


const Logs = () => {
  const [logFile, setLogFile] = useState("latest.log");
  const { data: ping } = usePing();
  const { data: logFiles, error: logFilesError } = useSWR(`/api/log-files`, fetcher);
  const { data, error, mutate } = useSWR(`/api/log/${logFile ?? "latest.log"}`, fetcher, logFile === "latest.log" ? {
    refreshInterval: (data) => data?.selected === "latest.log" ? 2000 : 0
  }: {
    revalidateOnReconnect: false,
  });
  const [isStickyMode, setIsStickyMode] = useState(true);
  const container = useRef<HTMLPreElement | null>(null);
  const lines: string[] | null = data?.lines;
  const available: string[] | null = data?.available ?? logFiles?.files;

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown)
    return () => {
      document.removeEventListener("keydown", handleKeydown)
    }
  }, [])

  const enableStickyMode = useCallback(() => {
    const element = container.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, []);

  useEffect(() => {
    isStickyMode && enableStickyMode();
  }, [enableStickyMode, isStickyMode, lines])

  if (error) {
    return <React.Fragment />
  }

  const handleScrollBox = (e: React.UIEvent) => {
    console.log(e);
    const element = container.current;
    if (element && e.isTrusted) {
      if (element.scrollHeight === element.scrollTop + element.clientHeight) {
        setIsStickyMode(true);
      } else {
        setIsStickyMode(false);
      }
    }
  };

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!available) return;

    if (available.includes(value)) {
      setLogFile(value);
    }
  }

  return (
    <BoxGroup title="Logs" icon={Newspaper}>
      <div className="flex justify-end items-stretch p-1 gap-1 bg-gray-300 dark:bg-gray-700 rounded-t-md">
        {(ping?.inspect?.state === "running" || ping?.isOnline) && logFile === "latest.log" && (
          <Button className="rounded" onClick={() => mutate(data)}><ArrowClockwise /></Button>
        )}
        <Select onChange={handleChangeSelect} defaultValue={logFile} disabled={!available}>
          {available?.map((filename: string) => (
            <option key={filename} value={filename}>{filename}</option>
          ))}
        </Select>
      </div>
      <FileViewer
        className={clsx("h-96 rounded-none border-none overflow-hidden", !ping?.isOnline && "rounded-b-md")}
        preClassName="text-xs"
        data={lines?.join("\n") ?? "loading..."}
        lang="log"
        ref={container}
        onScroll={handleScrollBox}
        addon={(
          <AnimatePresence>
            {isStickyMode || (
              <motion.button
                key="file-viewer-addon"
                initial={{ bottom: "-2.25rem" }}
                animate={{ bottom: ".75rem" }}
                exit={{ bottom: "-2.25rem" }}
                className="absolute p-2.5 bottom-3 right-3 rounded-xl bg-gray-700 text-white opacity-40 hover:opacity-90 focus:opacity-90 transition"
                style={{ marginRight: window.innerWidth - document.body.clientWidth }}
                onClick={enableStickyMode}><ChevronBarDown /></motion.button>
            )}
          </AnimatePresence>
        )}
      />
      {ping?.isOnline && (
        <div className="p-1 rounded-b bg-gray-300 dark:bg-gray-700">
          <SendCommandForm />
        </div>
      )}
    </BoxGroup>
  )
}

export default Logs
