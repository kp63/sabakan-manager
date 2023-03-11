import React, { Fragment } from "react";

import { Terminal } from "react-bootstrap-icons";
import usePing from "@/hooks/usePing";
import BoxGroup from "@/components/BoxGroup";
import SendCommandForm from "@/features/dashboard/atoms/SendCommandForm";

const SendCommand = () => {
  const { data: ping } = usePing();

  if (!ping?.isOnline) return <Fragment />

  return (
    <BoxGroup title="Send Command" icon={Terminal}>
      <SendCommandForm />
    </BoxGroup>
  )
}

export default SendCommand
