import Image from 'next/image'
import Header from '../Header'
import styled from '@emotion/styled'

export default function FunHomePage() {
	const HomeStyled = styled.div`
  background: background-color: silver;
        background-image: linear-gradient(335deg, #b00 23px, transparent 23px),
        linear-gradient(155deg, #d00 23px, transparent 23px),
        linear-gradient(335deg, #b00 23px, transparent 23px),
        linear-gradient(155deg, #d00 23px, transparent 23px);
        background-size: 58px 58px;
        background-position: 0px 2px, 4px 35px, 29px 31px, 34px 6px;
        background-height: 100%;
        font-family: "Comic Sans MS", "Comic Sans", cursive;
        `

	const ClippyContainer = styled.div`
		display: flex;
		flex-direction: row;
		padding: 40px;

		.h1box {
			background: white;
		}
		#shadowBox {
			background-color: rgb(0, 0, 0);
			/* Fallback color */
			background-color: hsla(
				56.12903225806453,
				18.562874251496993%,
				67.25490196078432%,
				0.959
			);
			/* Black w/opacity/see-through */
			border: 3px solid;
		}

		.rainbow {
			text-align: center;
			text-decoration: underline;
			font-size: 32px;
			font-family: monospace;
			letter-spacing: 5px;
		}
		.rainbow_text_animated {
			background: linear-gradient(
				to right,
				#6666ff,
				#0099ff,
				#00ff00,
				#ff3399,
				#6666ff
			);
			-webkit-background-clip: text;
			background-clip: text;
			color: transparent;
			animation: rainbow_animation 6s ease-in-out infinite;
			background-size: 400% 100%;
		}

		@keyframes rainbow_animation {
			0%,
			100% {
				background-position: 0 0;
			}

			50% {
				background-position: 100% 0;
			}
		}

		.meow {
			display: block;
			margin: auto;
			margin-bottom: 30px;
		}

		.clippy {
			max-width: 30%;
			margin-left: auto;
		}
	`
	return (
		<HomeStyled>
			<ClippyContainer>
				<div id='shadowBox'>
					<h1 className='rainbow rainbow_text_animated'>Welcome to my page!</h1>
					<img
						className='meow'
						src='/kitten.gif'
						alt='animation of a kitten sleeping on a couch'
					/>
				</div>
				<img
					className='clippy'
					src='/Clippy.jpg'
					alt='Clippy is a friendly, talking paperclip who will help you navigate the internet.'
				/>
			</ClippyContainer>
		</HomeStyled>
	)
}
