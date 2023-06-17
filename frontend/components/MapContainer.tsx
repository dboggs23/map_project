import React, { useEffect, useState } from 'react'
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core'
import { HexagonLayer } from '@deck.gl/aggregation-layers/typed'
import { HexagonLayerProps } from '@deck.gl/aggregation-layers/hexagon-layer/hexagon-layer'
import { Position } from 'deck.gl'
import dynamic from 'next/dynamic'

const MapComponentDynamic = dynamic(
	() => import('../components/MapComponent'),
	{
		ssr: false,
	}
)

// Data to be used by the LineLayer
const data = [
	{
		sourcePosition: [-122.41669, 37.7853],
		targetPosition: [-122.41669, 37.781],
	},
]

// Source data CSV
const DATA_URL =
	'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv' // eslint-disable-line

const ambientLight = new AmbientLight({
	color: [255, 255, 255],
	intensity: 1.0,
})

const pointLight1 = new PointLight({
	color: [255, 255, 255],
	intensity: 0.8,
	position: [-0.144528, 49.739968, 80000],
})

const pointLight2 = new PointLight({
	color: [255, 255, 255],
	intensity: 0.8,
	position: [-3.807751, 54.104682, 8000],
})

const lightingEffect = new LightingEffect({
	ambientLight,
	pointLight1,
	pointLight2,
})

const material = {
	ambient: 0.64,
	diffuse: 0.6,
	shininess: 32,
	specularColor: [51, 51, 51],
}

export const colorRange: [number, number, number][] = [
	[1, 152, 189],
	[73, 227, 206],
	[216, 254, 181],
	[254, 237, 177],
	[254, 173, 84],
	[209, 55, 78],
]

const mapStyle =
	'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json'
const radius = 200
const upperPercentile = 100
const coverage = 1

// DeckGL react component
export default function MapContainer() {
	const [layersState, setLayers] =
		useState<
			[HexagonLayer<[number, number], HexagonLayerProps<[number, number]>>]
		>()
	const [coordinates, setCoordinates] = useState<[number, number][]>()

	const fetchCSV = async () => {
		const file = await fetch(DATA_URL)
		const reader = file.body?.getReader()
		let decoder = new TextDecoder('utf-8')
		return reader?.read().then(function (result) {
			return decoder.decode(result.value)
		})
	}

	useEffect(() => {
		const coordinates: [number, number][] = []
		const fileString = fetchCSV()
		fileString.then((res) => {
			if (typeof res == 'string') {
				const coordinateEntries = res.split('\n')
				for (let i = 1; i < coordinateEntries.length; i++) {
					const coordinateItems = coordinateEntries[i].split(',')
					if (coordinateItems.length > 1) {
						coordinates.push([
							Number(coordinateItems[0]),
							Number(coordinateItems[1].replace(/\s+/g, ' ').trim()),
						])
					}
				}
			}
		})

		setCoordinates(coordinates)
	}, [])

	useEffect(() => {
		setLayers([
			new HexagonLayer({
				id: 'heatmap',
				colorRange,
				coverage,
				data: coordinates,
				elevationRange: [0, 3000],
				elevationScale: data && data.length ? 30 : 0,
				getPosition: (d: [number, number]): Position => d,
				pickable: true,
				radius,
				upperPercentile,
				//material,
				extruded: true,
			}),
		])
	}, [coordinates])

	return <MapComponentDynamic layers={layersState} mapStyle={mapStyle} />
}
