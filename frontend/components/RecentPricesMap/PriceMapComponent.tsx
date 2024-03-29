'use client'
import React from 'react'
import DeckGL from '@deck.gl/react/typed'
import { Map } from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import { HeatmapLayer } from 'deck.gl/typed'
import { PriceLayer } from './MostRecentPriceInterface'

interface Props {
	layers: [HeatmapLayer<PriceLayer>] | undefined
	mapStyle: string
}

const INITIAL_VIEW_STATE = {
	longitude: -90.199402,
	latitude: 38.627003,
	zoom: 6.6,
	minZoom: 5,
	maxZoom: 50,
	pitch: 40.5,
	bearing: -27,
}

// function getTooltip({ object }: PickingInfo) {
// 	if (!object) {
// 		return null
// 	}
// 	const lat = object.position[1]
// 	const lng = object.position[0]
// 	const count = object.points.length

// 	let addressString = ''

// 	Object.keys(object.points).map((key) => {
// 		if (!isNaN(Number(key))) {
// 			addressString += `${object.points[key].source?.propertyResult.address} - $${object.points[key].source?.mostRecentHomePrice} \n`
// 		}
// 	})

// 	return `\
// 		latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ''}
// 		longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ''}
// 		${addressString} `
// }

export default function PriceMapComponent({ layers, mapStyle }: Props) {
	if (!layers) <></>
	return (
		<DeckGL
			layers={layers}
			initialViewState={INITIAL_VIEW_STATE}
			controller={true}
		>
			<Map
				reuseMaps
				mapLib={maplibregl}
				mapStyle={mapStyle}
				styleDiffing={true}
			/>
		</DeckGL>
	)
}
