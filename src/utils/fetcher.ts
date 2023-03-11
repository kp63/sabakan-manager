const fetcher = (url: string) => fetch(url).then(res => res.json())
export const textFetcher = (url: string) => fetch(url).then(res => res.text())
export default fetcher
