import { ButtonListItem, List, ListItem } from "@/components/List";
import React from "react";
import useServerInfo from "@/hooks/useServerInfo";
import BoxGroup from "@/components/BoxGroup";
import { EraserFill, FileEarmark, FileEarmarkCode, Gear, XCircle, XLg } from "react-bootstrap-icons";
import Tooltip from "@/components/Tooltip";
import Modal from "@/components/Modal";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { Close } from "@radix-ui/react-dialog";
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
import encLatin1 from 'crypto-js/enc-latin1';
import encBase64 from 'crypto-js/enc-base64';
import FileViewer, { HighlighterLanguage } from "@/components/FileViewer";

const gamemodes = {
  survival: "サバイバル",
  creative: "クリエイティブ",
  adventure: "アドベンチャー",
  spectator: "スペクテーター"
}

const difficulties = {
  peaceful: <span className="text-green-600 dark:text-green-400">ピースフル</span>,
  easy: <span className="text-green-600 dark:text-green-400">イージー</span>,
  normal: <span className="text-yellow-600 dark:text-yellow-400">ノーマル</span>,
  hard: <span className="text-red-600 dark:text-red-400">ハード</span>,
}

const Preferences = () => {
  const { data: info } = useServerInfo();

  if (!info?.properties) return <React.Fragment />

  const gamemode = typeof info.properties.gamemode === "string" && Object.keys(gamemodes).includes(info.properties.gamemode)
    // @ts-ignore
    ? gamemodes[String(info.properties.gamemode)]
    : info.properties.gamemode

  const difficulty = typeof info.properties.difficulty === "string" && Object.keys(difficulties).includes(info.properties.difficulty)
    // @ts-ignore
    ? difficulties[String(info.properties.difficulty)]
    : info.properties.difficulty

  const bool = (value: any) =>
    typeof value === "boolean"
    ? value
      ? <span className="text-green-400">有効</span>
      : <span className="text-red-400">無効</span>
    : <span className="text-gray-500">不明</span>
  ;

  return (
    <>
      <BoxGroup title="Preferences" icon={Gear}>
        <List>
          <ListItem>MOTD: {info.properties.motd}</ListItem>
          <ListItem>PvP: {bool(info.properties.pvp)}</ListItem>
          <ListItem>ゲームモード: {gamemode} {info.properties.forceGamemode && (
            <Tooltip label="ゲームモードの変更は維持されません" placement="right">
              <EraserFill className="text-red-400" />
            </Tooltip>
          )}</ListItem>
          <ListItem>難易度: {difficulty}</ListItem>
          <ListItem>スポーン保護: <span className="text-orange-400">{info.properties.spawnProtection}</span></ListItem>
          <ListItem>コマンドブロック: {bool(info.properties.enableCommandBlock)}</ListItem>
        </List>
      </BoxGroup>
      <BoxGroup className="mt-3" title="Show Raw Files" icon={FileEarmark}>
        <List>
          <ShowServerProperties />
          <ShowBukkitConfig />
          <ShowSpigotConfig />
          <ShowDockerComposeConfig />
        </List>
      </BoxGroup>
    </>
  )
}

const key = "placebo-security";

const ShowDockerComposeConfig = () => {
  const { data, error } = useSWR("/api/get-raw-file/docker-compose.yml", fetcher);

  if (error || !data?.data) {
    return <React.Fragment />
  }

  const decrypted = decrypt(data?.data);

  if (!decrypted) {
    return <React.Fragment />
  }

  return <EditorModal filename="Docker Compose 構成ファイル (docker-compose.yml)" language="yaml" defaultValue={decrypted} />
}

const ShowServerProperties = () => {
  const { data, error } = useSWR("/api/get-raw-file/server.properties", fetcher);

  if (error || !data?.data) {
    return <React.Fragment />
  }

  const decrypted = decrypt(data?.data);

  if (!decrypted) {
    return <React.Fragment />
  }

  return <EditorModal filename="サーバー構成ファイル (server.properties)" language="properties" defaultValue={decrypted} />
}

const ShowBukkitConfig = () => {
  const { data, error } = useSWR("/api/get-raw-file/bukkit.yml", fetcher);

  if (error || !data?.data) {
    return <React.Fragment />
  }

  const decrypted = decrypt(data?.data);

  if (!decrypted) {
    return <React.Fragment />
  }

  return <EditorModal filename="Bukkit 構成ファイル (bukkit.yml)" language="yaml" defaultValue={decrypted} />
}

const ShowSpigotConfig = () => {
  const { data, error } = useSWR("/api/get-raw-file/spigot.yml", fetcher);

  if (error || !data?.data) {
    return <React.Fragment />
  }

  const decrypted = decrypt(data?.data);

  if (!decrypted) {
    return <React.Fragment />
  }

  return <EditorModal filename="Spigot 構成ファイル (spigot.yml)" language="yaml" defaultValue={decrypted} />
}

const EditorModal = ({ filename, language, defaultValue }: { filename: string, language: HighlighterLanguage, defaultValue: string }) => {
  return (
    <Modal
      title={`${filename}`}
      superChild
      wideModal
      trigger={<ButtonListItem className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"><FileEarmarkCode className="text-gray-800 dark:text-gray-100" />{filename}</ButtonListItem>}
    >
      <div className={`w-full max-w-2xl rounded-md overflow-hidden border dark:border-gray-600 transform bg-white dark:bg-[#232324] text-left align-middle shadow-xl transition-all`}>
        <div className="flex justify-between border-b dark:border-gray-700">
          <span className="py-1 px-3.5">{filename}</span>
          <Close className="px-4 bg-red-500/10 text-red-400 hover:bg-red-500/40 dark:hover:bg-red-500/30"><XLg size={14} /></Close>
        </div>
        <FileViewer className="h-[500px] rounded-none border-none" data={defaultValue} lang={language} />
      </div>
    </Modal>
  );
}

const decrypt = (data?: string | null): string | null => {
  if (!data) {
    return null;
  }

  const encrypted = encBase64.parse(data).toString(encLatin1);
  return AES.decrypt(encrypted, key).toString(encUtf8);
}

export default Preferences;
