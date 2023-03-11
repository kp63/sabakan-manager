import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      permanent: false, // 永続的なリダイレクトかどうか
      destination: '/dashboard', // リダイレクト先
    },
  }
}

export default function Page() {}
