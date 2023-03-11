import React, { ChangeEvent, Fragment, KeyboardEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import serverUtils from "@/utils/serverUtils";
import Input from "@/components/Input";
import Button from "@/components/Button";
import usePing from "@/hooks/usePing";

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

const SendCommandForm = () => {
  const { data: ping } = usePing();
  const { register, handleSubmit, setValue, getValues } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (ping) {
      document.addEventListener("keydown", handleKeydown)
    } else {
      document.addEventListener("keydown", handleKeydown)
    }
    return () => {
      document.removeEventListener("keydown", handleKeydown)
    }
  }, [ping])

  if (!ping) return <Fragment />

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.match(/^\/+/)) {
      setValue("command", value.replace(/^\/+/, ''));
      return;
    }
  }

  const onSubmit = async () => {
    const command = getValues("command");

    setIsLoading(true);
    await serverUtils.sendCommand(command)
    setIsLoading(false);
    setValue("command", "");
    await mutate("/api/info");
    await mutate("/api/log/latest.log");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-stretch gap-0">
        <span className="flex items-center rounded-l px-2.5 bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 border-r-0">/</span>
        <Input id="command-input" {...register("command", { onChange: handleChange })} placeholder="Type command…" readOnly={isLoading} className="rounded-none flex-1" style={{ imeMode: "disabled" }} />
        <Button type="submit" className="rounded-l-none" disabled={isLoading}>Send</Button>
      </div>
    </form>
  )
}

export default SendCommandForm
