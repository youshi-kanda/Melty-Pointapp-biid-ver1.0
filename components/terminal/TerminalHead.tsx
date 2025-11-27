import Head from 'next/head'

interface TerminalHeadProps {
  title?: string
  description?: string
}

export default function TerminalHead({ 
  title = 'Melty+ 決済端末',
  description = 'Melty+ QRコード決済端末アプリ（タブレット専用）'
}: TerminalHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* PWA設定 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="theme-color" content="#667eea" />
      <link rel="manifest" href="/manifest-terminal.json" />
      
      {/* iOS Safari */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="apple-mobile-web-app-title" content="Melty決済" />
      <link rel="apple-touch-icon" href="/icons/terminal-192x192.png" />
      
      {/* Android Chrome */}
      <meta name="mobile-web-app-capable" content="yes" />
    </Head>
  )
}
