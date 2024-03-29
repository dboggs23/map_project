import React from 'react'
import dynamic from 'next/dynamic'

type Props = {}

const MapDynamic = dynamic(
	() => import('../components/RecentPricesMap/PriceMapContainer'),
	{
		ssr: false,
	}
)

const Map = (props: Props) => {
	return (
		<div>
			<MapDynamic />
		</div>
	)
}

export default Map
