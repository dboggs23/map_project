import { useAppContext } from '@/context/main-context'
import { useEffect, useState } from 'react'
import { BarDatum, ResponsiveBar } from '@nivo/bar'

interface PropByYear extends BarDatum {
	year: number
	count: number
}

function PropertiesByYear() {
	const { context } = useAppContext()
	const DATA_URL = `${context.apiUrl}/api/Properties/PropertiesByYear`

	const [results, setResults] = useState<PropByYear[]>([])

	const fetchPropsByYear = async () => {
		const propData = await fetch(DATA_URL)

		const jsonData = (await propData.json()) as PropByYear[]

		if (jsonData?.length) {
			jsonData.shift()
			setResults(jsonData)
		}
	}

	useEffect(() => {
		fetchPropsByYear()
	}, [])

	return (
		<div style={{ height: '70vh' }}>
			<ResponsiveBar
				data={results}
				indexBy='year'
				keys={['count']}
				colors={{ scheme: 'nivo' }}
				enableGridY={true}
				margin={{ top: 50, right: 130, bottom: 60, left: 60 }}
				enableLabel={false}
				axisBottom={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 45,
					legend: 'Year',
					legendPosition: 'middle',
					legendOffset: 32,
				}}
				axisLeft={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Properties Built',
					legendPosition: 'middle',
					legendOffset: -40,
				}}
				legends={[
					{
						dataFrom: 'keys',
						anchor: 'bottom-right',
						direction: 'column',
						justify: false,
						translateX: 120,
						translateY: 0,
						itemsSpacing: 2,
						itemWidth: 100,
						itemHeight: 20,
						itemDirection: 'left-to-right',
						itemOpacity: 0.85,
						symbolSize: 20,
						effects: [
							{
								on: 'hover',
								style: {
									itemOpacity: 1,
								},
							},
						],
					},
				]}
				ariaLabel='Properties built in st. Louis, Mo. within a given year'
			></ResponsiveBar>
		</div>
	)
}

export default PropertiesByYear
