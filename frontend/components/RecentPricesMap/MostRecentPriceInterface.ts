export interface MostRecentPrices {
	results: MostRecentPricesRoot[]
}

export interface MostRecentPricesRoot {
	propertyResult: PropertyResult
	mostRecentHomePrice: number
}

export interface PropertyResult {
	id: number
	address: string
	city: string
	state: string
	zipcode: number
	beds: number
	baths: number
	location: string
	squareFootage: number
	lotSize: number
	yearBuilt: number
	url: string
	latitude: number
	longitude: number
	propertyEvents: any[]
}
