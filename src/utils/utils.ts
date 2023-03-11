import toast from "react-hot-toast";
import fetcher from "@/utils/fetcher";

export const clipboardCopy = (string: string) =>
  toast.promise(navigator.clipboard.writeText(string), {
    loading: 'コピー中…',
    success: 'コピーされました',
    error: 'コピーに失敗しました',
  });

export const dashUuid = (uuid: string) =>
  uuid.includes('-') ? uuid :
    uuid.substring(0, 8) + "-" +
    uuid.substring(8, 12) + "-" +
    uuid.substring(12, 16) + "-" +
    uuid.substring(16, 20) + "-" +
    uuid.substring(20);

export const undashUuid = (uuid: string) =>
  uuid.replaceAll('-', '');

let _config: any = null;
export const getConfig = async () => {
  if (_config) {
    return _config;
  }

  _config = await fetcher("/api/get-config");
  return _config;
}
