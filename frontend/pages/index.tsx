import Image from 'next/image'
import Header from '@/components/Header'
import styled from '@emotion/styled'
import FunHomePage from '@/components/home/FunHomePage'
import SeriousHome from '@/components/home/SeriousHomePage'
import { useTheme } from '@emotion/react'

export default function Home(props) {
	const theme = useTheme()
	const HomeStyled = styled.div``

	return (
		<HomeStyled>
			<style global jsx>{`
				html,
				body,
				body > div:first-child,
				div#__next,
				div#__next > div {
					height: 100%;
				}
			`}</style>
			{}

			{/* <Header></Header> */}
			{/* <FunHomePage /> */}
			<SeriousHome {...props} />
		</HomeStyled>
	)
}
