'use client'
import React from 'react'
import styled from '@emotion/styled'
import { SocialIcon } from 'react-social-icons'
import { InterestsIcons, FleurDeLis } from './InterestsIcons'
import { useTheme } from '@emotion/react'

const HomeStyled = styled.div`
	animation: FadeIn 0.9s 1;
	width: 500px;
	margin: 0 auto;
	@font-face {
		font-family: 'EB Garamond';
		src: url('/fonts/EBGaramond-Regular.ttf');
	}

	@keyframes FadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@media only screen and (max-width: 600px) {
		width: 250px;
		margin: 0 auto;
	}
`

function SeriousHome() {
	const theme = useTheme()
	console.log(theme)
	const StyledContainer = styled.div`
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 30px;
		h1 {
			margin: 10px 0;
			text-decoration: underline;
			text-decoration-thickness: 2px;
			text-decoration-line: solid;
			text-decoration-color: #8ee4af;
		}
		h3 {
			margin-top: 30px;
			align-self: baseline;
		}
		h5 {
			margin: 30px 0;
		}
		img {
			margin-left: 5px;
			margin-bottom: 2.5px;
			width: 30px;
			height: auto;
		}
		.archHolder {
			display: flex;
			align-items: 'flex-start';
		}
	`

	return (
		<HomeStyled theme={theme}>
			<StyledContainer theme={theme}>
				<h1>I&apos;m Dalton.</h1>
				<div className='archHolder'>
					<h3>I&apos;m a developer who lives in St. Louis.</h3>
					<FleurDeLis />
				</div>

				<InterestsIcons />
				<div
					className='icons'
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						width: '30%',
						marginTop: '30px',
					}}
				>
					<SocialIcon
						url='https://www.linkedin.com/in/dalton-boggs/'
						bgColor='black'
					/>
					<SocialIcon url='https://github.com/dboggs23' bgColor='black' />
				</div>
			</StyledContainer>
		</HomeStyled>
	)
}

export default SeriousHome
