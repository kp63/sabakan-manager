import { getCsrfToken } from "next-auth/react"
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/router";
import Head from "next/head";
import { config } from "@/utils/serverside";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      panelName: config.panelName,
      csrfToken: await getCsrfToken(context),
    },
  }
}

type Props = {
  csrfToken: string;
  panelName: string;
}
export default function Login({ csrfToken, panelName }: Props) {
  const { error } = useRouter().query

  return (
    <>
      <Head>
        <title>Login - {panelName}</title>
      </Head>
      <div className="h-screen flex justify-center items-center select-none">
        <div className="max-w-md">
          <div className="p-5 border dark:border-gray-600 dark:bg-[#24272e] shadow-lg rounded-xl">
            <form method="POST" action="/api/auth/callback/credentials" className="flex flex-col gap-3">
              <h2 className="font-medium text-center">{panelName}</h2>

              <hr className="dark:border-t-gray-700" />

              {error === 'CredentialsSignin' && <div className={"text-red-500 text-sm mb-2 px-3 py-3.5 rounded bg-red-500/20 border border-red-500/30"}>ログインID又はパスワードが間違っています。</div>}

              <input type="hidden" name="csrfToken" defaultValue={csrfToken} />
              <Input label="Username" name="username" className="w-full" required />
              <Input label="Password" name="password" className="w-full" type="password" required />
              {/*<Checkbox label="Remember me" name="remember" />*/}


              <Button className="mt-3" type="submit">Login</Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

