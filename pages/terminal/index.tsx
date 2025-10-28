import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TerminalMain() {
  const router = useRouter();

  useEffect(() => {
    // /terminal にアクセスしたら /terminal/login にリダイレクト
    router.replace('/terminal/login');
  }, [router]);

  return null;
}
