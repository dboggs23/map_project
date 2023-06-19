import React, { useEffect, useState } from 'react'
import { HeatmapLayer } from '@deck.gl/aggregation-layers/typed'
import dynamic from 'next/dynamic'
import { MostRecentPricesRoot, PriceLayer } from './MostRecentPriceInterface'
import { useAppContext } from '@/context/main-context'

const MapComponentDynamic = dynamic(() => import('./PriceMapComponent'), {
	ssr: false,
})

const mapStyle =
	'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json'

// DeckGL react component
export default function PriceMapContainer() {
	const { context } = useAppContext()
	// Source data JSON
	const DATA_URL = `${context.apiUrl}/api/Properties`

	const [layersState, setLayers] = useState<[HeatmapLayer<PriceLayer>]>()

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

	const heatmap: PriceLayer = {
		id: 'heatmap-layer',
		data: results,
		getPosition: (d: any): [number, number] => {
			return [d.propertyResult.longitude, d.propertyResult.latitude]
		},
		getWeight: (d: any) => {
			return d.mostRecentHomePrice * 20
		},
		aggregation: 'MEAN',
		radiusPixels: 80,
	}

	useEffect(() => {
		fetchPriceData()
	}, [])

	useEffect(() => {
		setLayers([new HeatmapLayer(heatmap)])
	}, [coordinates])

	return <MapComponentDynamic layers={layersState} mapStyle={mapStyle} />
}
