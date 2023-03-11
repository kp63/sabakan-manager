import { ReactNode, useState } from "react";
import {
  Activity,
  ArrowClockwise,
  BoxArrowRight, BoxFill, Bug, Moon, PauseCircle, PersonCircle,
  PlayCircle, Sun
} from "react-bootstrap-icons";
import { signOut, useSession } from "next-auth/react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import MenuTriggerButton from "@/components/MenuTriggerButton";
import Button from "@/components/Button";
import usePing from "@/hooks/usePing";
import useServerInfo from "@/hooks/useServerInfo";
import Head from "next/head";
import toast from "react-hot-toast";
import { getConfig, clipboardCopy } from "@/utils/utils";
import Tooltip from "@/components/Tooltip";
import { dockerInspectHealthStatusColors, dockerInspectStateStatusColors } from "@/types/DockerInspect";
import { SendSignalType, SignalResponse } from "@/pages/api/signal/[signal]";

type Props = {
  children?: ReactNode;
  panelName?: string;
}

const loadingTexts: { [key in SendSignalType]: string } = {
  start: "起動シグナルを送信中…",
  restart: "再起動シグナルを送信中…",
  stop: "サーバーを停止中…"
}

export default function ManagerLayout({ children, panelName = "Sabakan Manager" }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session } = useSession({ required: true });
  const { data: ping, error: pingError, mutate: mutatePing } = usePing();
  const { data: info, error: infoError, mutate: mutateInfo } = useServerInfo();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const mutate = () => {
    if (isMutating) return;

    setIsMutating(true);
    return toast.promise(mutatePing(), {
      loading: "サーバーの状態を再確認中…",
      success: "サーバーの状態を再確認しました",
      error: "サーバーの状態取得に失敗しました",
    })
      .finally(() => setIsMutating(false));
  }

  const handleSendSignalServer = (type: SendSignalType) =>
    toast.promise(
      new Promise(async (resolve, reject) => {
        setIsSubmitting(true);
        const res = await fetch(`/api/signal/${type}`);
        const data = await res.json() as SignalResponse;

        if (!res.ok)
          return reject(data);

        return resolve(data.message);
      }),
      {
        loading: loadingTexts[type] ?? "シグナルを送信中…",
        success: (message: string) => message ?? 'シグナルを送信しました',
        error: (res: SignalResponse) => (
          typeof res.stderr === "string" ? (
            <div>
              <span className="block">{res.message ?? "シグナルの送信に失敗しました"}</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400 break-all font-mono cursor-pointer" onClick={() => clipboardCopy(res.stderr!)}>{res.stderr}</span>
            </div>
          ) : (res.message ?? "シグナルの送信に失敗しました")
        ),
      }
    )
      .then(() => mutatePing())
      .finally(() => setIsSubmitting(false))

  const handleStartServer = () => handleSendSignalServer("start");
  const handleRestartServer = () => handleSendSignalServer("restart");
  const handleStopServer = () => handleSendSignalServer("stop");

  if (pingError) {
    return (
      <>
        <Head>
          <title>{panelName}</title>
        </Head>
        <div className="h-screen flex flex-col justify-center items-center gap-3">
          <Bug size={32} className="text-danger" />
          <span className="text-xl font-medium flex items-center gap-2 text-danger">APIサーバーに接続できませんでした</span>
          <Button onClick={() => mutatePing()}>再試行</Button>
        </div>
      </>
    )
  }

  if (infoError || info?.message) {
    return (
      <>
        <Head>
          <title>{panelName}</title>
        </Head>
        <div className="h-screen flex flex-col justify-center items-center gap-3">
          <Bug size={32} className="text-danger" />
          <span className="text-lg font-medium flex items-center gap-2 text-danger">サーバー情報を読み込めませんでした。</span>
          <Button onClick={() => mutateInfo()}>再試行</Button>
        </div>
      </>
    )
  }

  if (!ping || !info) {
    return (
      <>
        <Head>
          <title>{panelName}</title>
        </Head>
        <div className="h-screen flex flex-col justify-center items-center gap-2">
          <span className="text-2xl font-medium animate-[wiggle_1s_ease-in-out_infinite]">{panelName}</span>
          <span className="text-md text-gray-500 animate-[wiggle_1s_ease-in-out_infinite]">サーバーに接続しています…</span>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{panelName}</title>
      </Head>
      <div className="max-w-4xl p-3 pb-20 mx-auto animate-[popupFadeIn_.5s_ease-in-out]">
        <div className="flex justify-between items-center pb-2">
          <span className="ml-3">{panelName}</span>
          <MenuTriggerButton
            className={'w-[40px] h-[40px] flex justify-center items-center ring-1 ring-gray-400 dark:ring-gray-500 rounded-xl'}
            openedClassName={'ring-offset-2 ring-2 ring-blue-500 ring-offset-gray-100 dark:ring-offset-[#282c34]'}
            items={[
              { title: session?.user?.name ?? 'Anonymous' },
              { type: 'sep' },
              {
                icon: resolvedTheme === 'dark' ? Sun : Moon,
                label: resolvedTheme === 'dark' ? 'ライトテーマに変更' : 'ダークテーマに変更',
                onClick: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
              },
              {
                icon: BoxArrowRight,
                label: 'ログアウト',
                variant: 'danger',
                onClick: () => signOut(),
              },
            ]}
          >
            <PersonCircle/>
          </MenuTriggerButton>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2 py-3 px-4 rounded-2xl shadow bg-gray-200 dark:bg-gray-600">
            {ping.inspect ? (
              <h2 className={clsx('flex gap-1 text-xl font-medium capitalize', ping.isOnline && ping.inspect.health === "healthy" ? 'text-green-400' : 'text-red-500')} style={{ color: dockerInspectStateStatusColors[ping?.inspect?.state] }} onClick={mutate}>
                {ping.inspect.state === "running" ? ping.inspect.health : ping.inspect.state}
                <span className="flex items-center text-sm font-normal text-gray-600 dark:text-gray-200">
                  <Tooltip label={(
                    <>
                      Container State: {ping?.inspect?.state}<br/>
                      {ping.inspect.state === "running" && <>
                        Container Health: {ping?.inspect?.health}
                      </>}
                    </>
                  )}>
                    <div className="flex gap-1 p-1">
                      <BoxFill style={{ color: dockerInspectStateStatusColors[ping?.inspect?.state] }} />
                      {ping.inspect.state === "running" && <>
                        <Activity style={{ color: dockerInspectHealthStatusColors[ping?.inspect?.health] }} />
                      </>}
                    </div>
                  </Tooltip>
                </span>
              </h2>
            ) : (
              <h2 className={clsx('flex gap-1 text-xl font-medium capitalize', ping.isOnline ? 'text-green-400' : 'text-red-500')} onClick={mutate}>
                {ping.status}
                <span className="flex items-center text-sm font-normal text-gray-600 dark:text-gray-200">
                  <Tooltip label="Dockerに接続できません">
                    <div className="flex gap-1 p-1">
                      <BoxFill style={{ color: "#7c4747" }} />
                    </div>
                  </Tooltip>
                </span>
              </h2>
            )}
            {ping.inspect ? (
              <div className="flex gap-1">
                {((ping.inspect.state === "running" && ping.inspect.health === "starting") || ping.inspect.state === "restarting") ? (
                  <span className="text-gray-600 dark:text-gray-400">サーバーを起動中…</span>
                ) : ping.isOnline ? (
                  <>
                    <Button className="gap-1" variant="warning" onClick={handleRestartServer} disabled={isSubmitting}><ArrowClockwise size={18} />再起動</Button>
                    <Button className="gap-1" variant="danger" onClick={handleStopServer} disabled={isSubmitting}><PauseCircle size={18} />停止</Button>
                  </>
                ) : (
                  <Button className="gap-1" onClick={handleStartServer} disabled={isSubmitting}><PlayCircle size={18} />起動</Button>
                )}
              </div>
            ) : (
              <div className="flex gap-1">
                {ping.isOnline ? (
                  <Button className="gap-1" variant="danger" onClick={handleStopServer} disabled={isSubmitting}><PauseCircle size={18} />停止</Button>
                ) : (
                  <Button className="gap-1" onClick={handleStartServer} disabled={isSubmitting}><PlayCircle size={18} />起動</Button>
                )}
              </div>
            )}
          </div>

          {children}
        </div>
      </div>
    </>
  )
}
