import React, { forwardRef, ReactNode, useMemo } from "react";
import { CheckCircle, XCircle } from "react-bootstrap-icons";
import reactStringReplace from "react-string-replace";
import { twMerge } from "tailwind-merge";

const PropertiesHighlighter = (lines: string[]) => {
  const result: ReactNode[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.match(/^#/)) {
      result.push(
        <span className="text-[#608b4e] break-all">{line}</span>
      )
      continue;
    }

    const matches = line.match(/^([a-zA-Z0-9\-_.]+)=(.*)$/);

    if (!matches) {
      result.push(line);
      continue;
    }

    const [, key, value] = matches;

    const formattedValue = (() => {
      if (key.match(/^(rcon\.[a-zA-Z0-9]+|[a-zA-Z0-9]*password[a-zA-Z0-9]*)$/g)) {
        return <span className="text-gray-400 dark:text-gray-500 text-xs">(hidden)</span>;
      }

      if (value.match(/^[\d.]+$/)) {
        return <span className="text-blue-700 dark:text-blue-400">{value}</span>;
      }

      if (
        (key === "gamemode" && ["survival", "creative", "spectator", "adventure"].includes(value))
        || (key === "difficulty" && ["peaceful", "easy", "normal", "hard"].includes(value))
      ) {
        return <span className="text-orange-600 dark:text-orange-400">{value}</span>;
      }

      if (["true", "false"].includes(value)) {
        return <span className={`${value === "true" ? "text-emerald-500 dark:text-emerald-400" : "text-red-600 dark:text-red-400"} inline-flex items-center gap-0.5`}>{value}{value === "true" ? <CheckCircle /> : <XCircle />}</span>;
      }

      return <span className="text-gray-800 dark:text-gray-300">{value}</span>;
    })()

    result.push(<>
      <span className="text-sky-700 dark:text-sky-500">{key}</span>
      <span className="text-gray-500 dark:text-gray-400">=</span>
      {formattedValue}
    </>)
  }
  return result;
}

const YamlHighlighter = (lines: string[]) => {
  const result: ReactNode[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const comment = line.match(/^(\s*)(#.*)$/);
    if (comment) {
      const [, indent, str] = comment;
      result.push(
        <>
          {indent}
          <span className="text-[#608b4e]">{str}</span>
        </>
      )
      continue;
    }

    const matches = line.match(/^(\s*)([a-zA-Z0-9\-_.]+)(\s*:\s*)(.*)$/);

    if (!matches) {
      const matches = line.match(/^(\s*)(-)(\s*)(.*)$/);

      if (matches) {
        const [, indent, dash, spaces, value] = matches;
        result.push(<>
          <span className="text-sky-700 dark:text-sky-500">{indent}</span>
          <span className="text-gray-500 dark:text-gray-400">{dash}</span>
          <span>{spaces}</span>
          {reactStringReplace(value, '********', (match, i) => (
            <span className="text-gray-400 dark:text-gray-500 text-xs">(hidden)</span>
          ))}
        </>)
        continue;
      }

      result.push(line);
      continue;
    }

    const [, indent, key, separator, value] = matches;

    const formattedValue = (() => {
      if ([
        'RCON_PORT',
        'RCON_PASSWORD',
        'DB_PASSWORD',
        'MYSQL_PASSWORD',
        'MYSQL_ROOT_PASSWORD',
        'POSTGRES_PASSWORD',
        'PASSWORD',
        'CF_API_KEY',
      ].includes(key)) {
        return <span className="text-gray-400 dark:text-gray-500 text-xs">(hidden)</span>;
      }

      if (value.match(/^[\d.]+$/)) {
        return <span className="text-blue-700 dark:text-blue-400">{value}</span>;
      }

      if (
        (key === "gamemode" && ["survival", "creative", "spectator", "adventure"].includes(value))
        || (key === "difficulty" && ["peaceful", "easy", "normal", "hard"].includes(value))
      ) {
        return <span className="text-orange-600 dark:text-orange-400">{value}</span>;
      }

      if (["true", "false"].includes(value)) {
        return <span className={`${value.toLowerCase() === "true" ? "text-emerald-500 dark:text-emerald-400" : "text-red-600 dark:text-red-400"} inline-flex items-center gap-0.5`}>{value}{value.toLowerCase() === "true" ? <CheckCircle /> : <XCircle />}</span>;
      }

      return reactStringReplace(value, '********', (match, i) => (
        <span className="text-gray-800 dark:text-gray-300">{match}</span>
      ));

      // return <span className="text-gray-800 dark:text-gray-300">{value}</span>;
    })()

    result.push(<>
      <span className="text-sky-700 dark:text-sky-500">{indent}</span>
      <span className="text-sky-700 dark:text-sky-500">{key}</span>
      <span className="text-gray-500 dark:text-gray-400">{separator}</span>
      {formattedValue}
    </>)
  }
  return result;
}

const LogHighlighter = (lines: string[]) => {
  const result: ReactNode[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const matches = line.match(/^\[(\d{2}:\d{2}:\d{2})] \[(.+)\/([A-Z0-9\-]+)]: (.+)$/);

    if (!matches) {
      result.push(line);
      continue;
    }

    const [, time, source, state, message] = matches;

    if (source.match(/(RCON Listener #\d+)|(RCON Client \/.+ #\d+)/)) {
      continue;
    }

    const colors = {
      INFO: "text-sky-600 dark:text-sky-400",
      WARN: "text-yellow-500 dark:text-yellow-400",
      ERROR: "text-red-600 dark:text-red-400",
      DEBUG: "text-gray-600 dark:text-gray-400"
    }

    // result.push(line);
    result.push(<>
      <span className="text-gray-400">[</span>
      <span className="text-gray-600 dark:text-gray-300">{time}</span>
      <span className="text-gray-400">] [</span>
      <span className="text-gray-600 dark:text-gray-300">{source}</span>
      <span className="text-gray-400">/</span>
      <span className={(colors as any)[state] ?? "text-gray-600 dark:text-gray-300"}>{state}</span>
      <span className="text-gray-400">]: </span>
      <span className="text-gray-900 dark:text-gray-200">{message}</span>
    </>)
  }
  return result;
}

const highlighter = {
  properties: PropertiesHighlighter,
  yaml: YamlHighlighter,
  log: LogHighlighter
}

export type HighlighterLanguage = keyof typeof highlighter;
type Props = {
  lang: HighlighterLanguage
  data: string | string[]
  className?: string
  preClassName?: string
  addon?: ReactNode
}
// eslint-disable-next-line react/display-name
const FileViewer = forwardRef<HTMLPreElement, Props & React.HTMLAttributes<HTMLPreElement>>(({ lang, data, className, preClassName, addon, ...props }, ref) => {
  const formattedLines = useMemo(
    () => highlighter[lang](typeof data === "string" ? data.split("\n") : data),
    [lang, data]
  );

  return (
    <div className={twMerge("relative h-[500px] bg-gray-50 dark:bg-zinc-800 rounded border dark:border-gray-700", className)}>
      <pre ref={ref} className={twMerge("relative p-2 h-full overflow-y-scroll scroll-smooth font-mono text-sm whitespace-pre-wrap break-all select-text", preClassName)} {...props}>
        {formattedLines.map((line: string, index: number) => (
          <React.Fragment key={index}>{line}<br /></React.Fragment>
        ))}
      </pre>
      {addon && addon}
    </div>
  )
})

export default FileViewer
