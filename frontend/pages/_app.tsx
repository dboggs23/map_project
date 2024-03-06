import * as React from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import theme from '../styles/theme'
import createEmotionCache from '../styles/createEmotionCache'
import { AppContextProvider } from '@/context/main-context'

const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
	emotionCache?: EmotionCache
}

export default function App({
	Component,
	pageProps,
	emotionCache = clientSideEmotionCache,
}: MyAppProps) {
	return (
		<AppContextProvider>
			<CacheProvider value={emotionCache}>
				<Head>
					<meta name='viewport' content='initial-scale=1, width=device-width' />
				</Head>
				<ThemeProvider theme={theme}>
					{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
					{/* <CssBaseline /> */}
					{/* <GlobalStyles /> */}
					<Component {...pageProps} />
				</ThemeProvider>
			</CacheProvider>
		</AppContextProvider>
	)
}
