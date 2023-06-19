import { SetStateAction, createContext, useContext, useState } from 'react'

type ContextTypes = {
	context: {
		apiUrl: string
	}
}

const AppContext = createContext<ContextTypes | null>(null)

export function AppContextProvider({ children }) {
	const [context, setContext] = useState({
		apiUrl: '',
	})

	if (process.env.NEXT_PUBLIC_NODE_ENV == 'development') {
		context.apiUrl = 'https://localhost:7046'
	} else {
		context.apiUrl = 'http://134.209.116.223'
	}

	return (
		<AppContext.Provider
			value={{
				context,
			}}
		>
			{children}
		</AppContext.Provider>
	)
}

export function useAppContext() {
	const context = useContext(AppContext)

	if (!context)
		throw new Error('useContext must be used inside a `contextProvider`')

	return context
}
