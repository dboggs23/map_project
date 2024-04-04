import React from 'react'
import styled from '@emotion/styled'
// import bike from '../../assets/bike.svg'
// import books from '../../assets/books.svg'
// import coffee from '../..//assets/coffee.svg'
// import airplane from '../../assets/airplane.svg'
// import mountains from '../../assets/mountains.svg'
// import fleur from '../../assets/Fleur-de-lis-fill.svg'
import { SocialIcon } from 'react-social-icons'

const IconsContainer = styled.div`
	.interests-container {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin: 10px 0;

		.bike,
		.coffee,
		.plane,
		.mountains {
			position: relative;
		}
		.bike {
			top: 9px;
		}
		.coffee {
			bottom: 2px;
		}
		.plane {
			top: 1px;
		}
		.mountains {
			top: 2px;
		}
	}
	.interests {
		width: 50px;
	}
	.icons {
		display: flex;
		justify-content: space-between;
	}

	@media only screen and (max-width: 600px) {
		.interests-container {
			padding: 3px;
		}
		.interests {
			width: 30px;
		}
	}
`

const Flower = styled.img`
	width: auto;
	height: 50px;
	//aspect-ratio: 1/1;
	//object-fit: none;
`

function InterestsIcons() {
	return (
		<IconsContainer
		// isChecked={context.isChecked}
		>
			<h5>Minimalist clip art that represent my interests:</h5>
			<div className='interests-container'>
				<img
					className='interests books'
					src='/home_business/books.svg'
					alt='A bookshelf.'
				/>
				<img
					className='interests bike'
					src='/home_business/bike.svg'
					alt='A neat bicycle'
				/>
				<img
					className='interests coffee'
					src='/home_business/coffee.svg'
					alt='A piping cup of joe'
				/>
				<img
					className='interests plane'
					src='/home_business/airplane.svg'
					alt='A jet airliner'
				/>
				<img
					className='interests mountains'
					src='/home_business/mountains.svg'
					alt='Idyllic mountains that remind me of those in Colorado. '
				/>
			</div>
		</IconsContainer>
	)
}

function FleurDeLis() {
	return (
		<Flower
			//isChecked={context.isChecked}
			//className='interests'
			src='/home_business/Fleur-de-lis-fill.svg'
			alt='A fleur de lis, which symbolizes the confluence of the Missouri and Mississippi rivers north of St. Louis, Missouri.'
		/>
	)
}

function Links() {
	return (
		<div className='contacts'>
			<SocialIcon
				url='https://www.linkedin.com/in/dalton-boggs/'
				//bgColor={context.isChecked ? 'white' : 'black'}
			/>
			<SocialIcon
				url='https://github.com/dboggs23'
				//bgColor={context.isChecked ? 'white' : 'black'}
			/>
		</div>
	)
}

export { InterestsIcons, FleurDeLis, Links }
