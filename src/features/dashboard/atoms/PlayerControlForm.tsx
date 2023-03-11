import React, { ChangeEvent, Fragment, KeyboardEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { mutate } from "swr";
import serverUtils from "@/utils/serverUtils";
import Input from "@/components/Input";
import Button from "@/components/Button";
import usePing from "@/hooks/usePing";
import { PlayerControlType } from "@/pages/api/action/player-control";

const placeholders: { [key in PlayerControlType]?: string } = {
  op: "Add operator",
  deop: "Remove operator",
  "whitelist add": "Add whitelist player",
  "whitelist remove": "Remove whitelist player",
  ban: "Ban player",
  pardon: "Unban player",
}

type Props = {
  type: PlayerControlType;
}
const PlayerControlForm = ({ type }: Props) => {
  const { data: ping } = usePing();
  const { register, handleSubmit, setValue, getValues } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .replace(' ', '_')
      .replace(/(\s|[^a-zA-Z0-9\-_.])/g, '');

    setValue("playerName", value);
  }

  const onSubmit = async () => {
    const playerName = getValues("playerName");

    setIsLoading(true);
    await serverUtils.playerControl(playerName, type)
    setIsLoading(false);
    setValue("playerName", "");
    await mutate("/api/info");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-stretch gap-0">
        <Input {...register("playerName", { onChange: handleChange })} placeholder={typeof placeholders[type] === "string" ? `${placeholders[type]}…` : undefined} readOnly={isLoading} className="rounded-r-none flex-1" style={{ imeMode: "disabled" }} />
        <Button type="submit" className="rounded-l-none" disabled={isLoading}>Add</Button>
      </div>
    </form>
  )
}

export default PlayerControlForm
