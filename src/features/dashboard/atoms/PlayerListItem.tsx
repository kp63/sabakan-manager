import { ConfigPlayer, normalizePlayerData, isConfigPlayer, Player } from "@/types/Player";
import usePlayerInfo from "@/hooks/usePlayerInfo";
import DropdownMenuTrigger, { MenuItem } from "@/components/DropdownMenuTrigger";
import React, { useMemo, useState } from "react";
import { BackspaceReverseFill, Clipboard, PersonDashFill, PersonPlusFill, PersonX } from "react-bootstrap-icons";
import serverUtils from "@/utils/serverUtils";
import { ListItem } from "@/components/List";
import Image from "next/image";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import { AnimatePresence, motion } from "framer-motion";
import ReasonForm from "@/features/dashboard/atoms/ReasonForm";

const PlayerListItem = ({ player: _player }: { player: Player | ConfigPlayer }) => {
  const player = normalizePlayerData(_player);

  const { getAvatar, isOperator, isWhitelisted, isBanned, isOnline } = usePlayerInfo(player);
  const [isOpenKickModal, setIsOpenKickModal] = useState(false);
  const [isOpenBanModal, setIsOpenBanModal] = useState(false);

  const menuItems: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [
      { title: player.name },
      { type: "sep" },
      {
        label: "名前をコピー",
        icon: Clipboard,
        onClick: () => copyPlayerName(player.name)
      },
      { type: "sep" },
    ];

    if (!isBanned) {
      items.push(
        {
          label: isWhitelisted ? "ホワイトリストから削除" : "ホワイトリストに追加",
          variant: isWhitelisted ? "danger" : "primary",
          icon: isWhitelisted ? PersonDashFill : PersonPlusFill,
          onClick: () => isWhitelisted ? serverUtils.whitelistRemove(player) : serverUtils.whitelistAdd(player),
        },
        {
          label: isOperator ? "OP権限を剥奪" : "OP権限を付与",
          variant: isOperator ? "danger" : "primary",
          icon: isOperator ? PersonDashFill : PersonPlusFill,
          onClick: () => isOperator ? serverUtils.deop(player) : serverUtils.op(player),
        }
      )
    }

    if (isOnline) {
      items.push(
        {
          label: "キック",
          variant: "danger",
          icon: BackspaceReverseFill,
          onClick: () => setIsOpenKickModal(true),
        }
      )
    }

    items.push(
      { type: "sep" },
      {
        label: isBanned ? "ブラックリスト解除" : "サーバーから追放",
        variant: "danger",
        icon: isBanned ? PersonDashFill : PersonX,
        onClick: () => isBanned ? serverUtils.pardon(player) : setIsOpenBanModal(true),
      }
    )

    return items;
  }, [isBanned, isOnline, isOperator, isWhitelisted, player]);

  return (
    <>
      <ListItem className="flex flex-col items-stretch p-0">
        <DropdownMenuTrigger
          className="flex items-center px-2.5 py-1.5 gap-1.5 border-b last:border-b-0 border-b-gray-200 dark:border-b-gray-600"
          items={menuItems}
        >
          <div className="flex items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image
              unoptimized
              className="rounded pointer-events-none bg-gray-300 dark:bg-zinc-800"
              src={getAvatar(32) ?? ""}
              width={32} height={32}
              alt={player.name}
            />
            <span className="cursor-pointer" onClick={() => copyPlayerName(player.name)}>{player.name}</span>
          </div>
        </DropdownMenuTrigger>
      </ListItem>
      {isOpenKickModal && (
        <Modal forceMount onClose={() => setIsOpenKickModal(false)}>
          <ReasonForm type="kick" playerName={player.name} />
        </Modal>
      )}
      {isOpenBanModal && (
        <Modal forceMount onClose={() => setIsOpenBanModal(false)}>
          <ReasonForm type="ban" playerName={player.name} />
        </Modal>
      )}
    </>
  );
}

const copyPlayerName = (name: string) =>
  toast.promise(navigator.clipboard.writeText(name), {
    loading: 'コピー中…',
    success: 'コピーされました',
    error: 'コピーに失敗しました',
  });

export default PlayerListItem;
