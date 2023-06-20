import dynamic from 'next/dynamic'

const PropYearDynamic = dynamic(
	() => import('../components/charts/PropertiesByYear'),
	{
		ssr: false,
	}
)

const PropYear = () => {
	return (
		<div>
			<PropYearDynamic />
		</div>
	)
}

export default PropYear
