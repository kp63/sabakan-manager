import { ButtonListItem, List, ListItem } from "@/components/List";
import React from "react";
import useServerInfo from "@/hooks/useServerInfo";
import BoxGroup from "@/components/BoxGroup";
import { EraserFill, FileEarmark, FileEarmarkCode, Gear, XCircle, XLg } from "react-bootstrap-icons";
import Tooltip from "@/components/Tooltip";
import { useTheme } from "next-themes";
import Modal from "@/components/Modal";
import useSWR from "swr";
import { textFetcher } from "@/utils/fetcher";
import { Close } from "@radix-ui/react-dialog";
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
import FileViewer, { HighlighterLanguage } from "@/components/FileViewer";

const gamemodes = {
  survival: "サバイバル",
  creative: "クリエイティブ",
  adventure: "アドベンチャー",
  spectator: "スペクテーター"
}

const Preferences = () => {
  const { data: info } = useServerInfo();

  if (!info?.properties) return <React.Fragment />

  const gamemode = typeof info.properties.gamemode === "string" && Object.keys(gamemodes).includes(info.properties.gamemode)
    // @ts-ignore
    ? gamemodes[String(info.properties.gamemode)]
    : info.properties.gamemode

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
          <ListItem>スポーン保護: <span className="text-orange-400">{info.properties.spawnProtection}</span></ListItem>
          <ListItem>コマンドブロック: {bool(info.properties.pvp)}</ListItem>
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
  const { data, error } = useSWR<string>("/api/get-raw-file/docker-compose.yml", textFetcher);

  if (typeof data !== "string" || error) {
    return <React.Fragment />
  }

  return <EditorModal filename="Docker Compose 構成ファイル (docker-compose.yml)" language="yaml" defaultValue={data} />
}

const ShowServerProperties = () => {
  const { data, error } = useSWR<string>("/api/get-raw-file/server.properties", textFetcher);

  if (typeof data !== "string" || error) {
    return <React.Fragment />
  }

  return <EditorModal filename="サーバー構成ファイル (server.properties)" language="properties" defaultValue={data} />
}

const ShowBukkitConfig = () => {
  const { data, error } = useSWR<string>("/api/get-raw-file/bukkit.yml", textFetcher);

  if (typeof data !== "string" || error) {
    return <React.Fragment />
  }

  return <EditorModal filename="Bukkit 構成ファイル (bukkit.yml)" language="yaml" defaultValue={data} />
}

const ShowSpigotConfig = () => {
  const { data, error } = useSWR<string>("/api/get-raw-file/spigot.yml", textFetcher);

  if (typeof data !== "string" || error) {
    return <React.Fragment />
  }

  return <EditorModal filename="Spigot 構成ファイル (spigot.yml)" language="yaml" defaultValue={data} />
}

const EditorModal = ({ filename, language, defaultValue }: { filename: string, language: HighlighterLanguage, defaultValue: string }) => {
  const data = AES.decrypt(defaultValue, key).toString(encUtf8);

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
        <FileViewer className="h-[500px] rounded-none border-none" data={data} lang={language} />
      </div>
    </Modal>
  );
}

export default Preferences;