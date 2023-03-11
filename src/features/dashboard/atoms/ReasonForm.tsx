import React, { ChangeEvent, Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import serverUtils from "@/utils/serverUtils";
import Input from "@/components/Input";
import Button from "@/components/Button";
import usePing from "@/hooks/usePing";
import { PlayerControlType } from "@/pages/api/action/player-control";

type Props = {
  type: "ban" | "ip-ban" | "kick";
  playerName: string;
}
const ReasonForm = ({ type, playerName }: Props) => {
  const { data: ping } = usePing();
  const { register, handleSubmit, setValue, getValues } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  if (!ping) return <Fragment />

  const onSubmit = async () => {
    const reason = getValues("reason");

    setIsLoading(true);
    await serverUtils.playerControl(playerName, type as PlayerControlType, reason)
    setIsLoading(false);
    setValue("reason", "");
    await mutate("/api/info");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-stretch gap-0">
        <span className="flex items-center rounded-l px-2.5 bg-gray-200 dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 border-r-0">
          Because
        </span>
        <Input {...register("reason")} placeholder="Type reason…" readOnly={isLoading} className="rounded-none flex-1" />
        <Button variant="danger" type="submit" className="rounded-l-none capitalize" disabled={isLoading}>{type}</Button>
      </div>
    </form>
  )
}

export default ReasonForm
