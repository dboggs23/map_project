import React, { useEffect, useState } from 'react'
import { AmbientLight, PointLight, LightingEffect } from '@deck.gl/core'
import { HexagonLayer } from '@deck.gl/aggregation-layers/typed'
import { HexagonLayerProps } from '@deck.gl/aggregation-layers/hexagon-layer/hexagon-layer'
import { Position } from 'deck.gl'
import dynamic from 'next/dynamic'
import {
	MostRecentPrices,
	MostRecentPricesRoot,
	PropertyResult,
} from './MostRecentPriceInterface'

const MapComponentDynamic = dynamic(() => import('./PriceMapComponent'), {
	ssr: false,
})

// Data to be used by the LineLayer
const data = [
	{
		sourcePosition: [-122.41669, 37.7853],
		targetPosition: [-122.41669, 37.781],
	},
]

// Source data JSON
const DATA_URL = 'https://localhost:7046/api/Properties' // eslint-disable-line

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
export default function PriceMapContainer() {
	const [layersState, setLayers] = useState<
		[
			HexagonLayer<
				[number, number],
				{
					id: string
					data: MostRecentPricesRoot[]
					elevationRange: [number, number]
					elevationScale: number
					getPosition: (d: MostRecentPricesRoot) => Position
					pickable: boolean
					radius: number
					upperPercentile: number
					extruded: boolean
				}
			>
		]
	>()
	const [results, setResults] = useState<MostRecentPricesRoot[]>()
	const [coordinates, setCoordinates] = useState<[number, number][]>()

	const fetchPriceData = async () => {
		const priceData = await fetch(DATA_URL)
		const jsonData = (await priceData.json()) as MostRecentPricesRoot[]

		const coordsArr = jsonData.map((obj) => {
			return [
				Number(obj.propertyResult.latitude),
				Number(obj.propertyResult.longitude),
			] as [number, number]
		})
		setCoordinates(coordsArr)
		setResults(jsonData)
	}

	useEffect(() => {
		fetchPriceData()
	}, [])

	useEffect(() => {
		setLayers([
			new HexagonLayer({
				id: 'heatmap',
				//colorRange,
				//coverage,
				data: results,
				elevationRange: [0, 3000],
				elevationScale: data && data.length ? 7 : 0,
				getPosition: (d: MostRecentPricesRoot): Position => {
					return [d.propertyResult.longitude, d.propertyResult.latitude]
					//return [d.propertyResult.latitude, d.propertyResult.longitude]
				},
				pickable: true,
				radius,
				upperPercentile,
				//material,
				getElevation: (v: MostRecentPricesRoot[]): number => {
					const avg =
						v.reduce((acc, b) => acc + Number(b.mostRecentHomePrice), 0) /
						v.length
					return avg * 5
				},
				extruded: true,
			}),
		])
	}, [coordinates])

	return <MapComponentDynamic layers={layersState} mapStyle={mapStyle} />
}
