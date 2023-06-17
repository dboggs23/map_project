'use client'
import React from 'react'
import DeckGL from '@deck.gl/react/typed'
import { Map } from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import { HexagonLayer, PickingInfo } from 'deck.gl/typed'
import { HexagonLayerProps } from '@deck.gl/aggregation-layers/hexagon-layer/hexagon-layer'

interface Props {
	layers:
		| [HexagonLayer<[number, number], HexagonLayerProps<[number, number]>>]
		| undefined
	mapStyle: string
}

const INITIAL_VIEW_STATE = {
	longitude: -1.415727,
	latitude: 52.232395,
	zoom: 6.6,
	minZoom: 5,
	maxZoom: 15,
	pitch: 40.5,
	bearing: -27,
}

function getTooltip({ object }: PickingInfo) {
	if (!object) {
		return null
	}
	const lat = object.position[1]
	const lng = object.position[0]
	const count = object.points.length

	return `\
    latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ''}
    longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ''}
    ${count} Accidents`
}

export default function MapComponent({ layers, mapStyle }: Props) {
	if (!layers) <></>
	return (
		<DeckGL
			layers={layers}
			//effects={[lightingEffect]}
			initialViewState={INITIAL_VIEW_STATE}
			controller={true}
			getTooltip={getTooltip}
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
