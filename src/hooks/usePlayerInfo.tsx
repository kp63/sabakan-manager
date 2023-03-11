import useServerInfo from "@/hooks/useServerInfo";
import { ConfigPlayer, normalizePlayerData, Player } from "@/types/Player";
import usePing from "@/hooks/usePing";

const usePlayerInfo = (_player: Player | ConfigPlayer) => {
  const player = normalizePlayerData(_player);
  const { data: ping } = usePing();
  const { data: info } = useServerInfo();

  const avatar = player.id ? `https://mc-heads.net/avatar/${player.id}` : player.name ? `https://mc-heads.net/avatar/${player.name}` : undefined
  const getAvatar = (size: number | `${number}`) => avatar ? `${avatar}/${size}` : undefined;

  const isOnline = ping?.isOnline ? !!ping.data.players.list.find((p) => p.id === player.id) : null;
  const isOperator = !!info?.ops?.find((record) => record.name === player.name || record.uuid === player.id);
  const isWhitelisted = !!info?.whitelist?.find((record) => record.name === player.name || record.uuid === player.id);
  const isBanned = !!info?.bannedPlayers?.find((record) => record.name === player.name || record.uuid === player.id);

  return {
    player,
    avatar,
    getAvatar,
    isOnline,
    isOperator,
    isWhitelisted,
    isBanned,
  }
}

export default usePlayerInfo;
