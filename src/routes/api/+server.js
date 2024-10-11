import { json } from '@sveltejs/kit';
//  import { ECO_COUNTER_API } from "$env/static/private";

export async function POST({ request }) {

	const {a} = await request.json()

	const options = {
		method: 'GET',
		headers: {accept: 'application/json', 'X-API-KEY': process.env.ECO_COUNTER_API}
	  };

		let t = new Date();
		const date = ('0' + t.getDate()).slice(-2);
		const month = ('0' + (t.getMonth() + 1)).slice(-2);
		const year = t.getFullYear();
		let dd = `${year}-${month}-${date}`

		var delta = t.getTime() - (30 * 24 * 60 * 60 * 1000);
		t.setTime(delta)
		const date2 = ('0' + t.getDate()).slice(-2);
		const month2 = ('0' + (t.getMonth() + 1)).slice(-2);
		const year2 = t.getFullYear();
		let dd2 = `${year2}-${month2}-${date2}`

		t = new Date();
		
		delta = t.getTime() - (90 * 24 * 60 * 60 * 1000);
		t.setTime(delta)
		const date3 = ('0' + t.getDate()).slice(-2);
		const month3 = ('0' + (t.getMonth() + 1)).slice(-2);
		const year3 = t.getFullYear();
		let dd3 = `${year3}-${month3}-${date3}`


		t = new Date();
		
		delta = t.getTime() - (364 * 24 * 60 * 60 * 1000);
		t.setTime(delta)
		const date4 = ('0' + t.getDate()).slice(-2);
		const month4 = ('0' + (t.getMonth() + 1)).slice(-2);
		const year4 = t.getFullYear();
		let dd4 = `${year4}-${month4}-${date4}`

		t = new Date();
		
		delta = t.getTime() - (364 * 3 * 24 * 60 * 60 * 1000);
		t.setTime(delta)
		const date5 = ('0' + t.getDate()).slice(-2);
		const month5 = ('0' + (t.getMonth() + 1)).slice(-2);
		const year5 = t.getFullYear();
		let dd5 = `${year5}-${month5}-${date5}`

	let url = await 'https://api.eco-counter.com/api/v2/history/traffic/raw?siteId='+a+'&include=&startDate='+dd2+'&endDate='+dd+'&startTime=00%3A00&endTime=00%3A00&granularity=P1D&gapFilling=false&travelModes=bike&travelModes=pedestrian'
	let url2 = await 'https://api.eco-counter.com/api/v2/history/traffic/aggregated?siteId='+a+'&include=&startDate='+dd3+'&endDate='+dd+'&startTime=00%3A00&endTime=00%3A00&granularity=P1W&groupBy=travelMode&gapFilling=false&travelModes=pedestrian&travelModes=bike' 
	let url3 = await 'https://api.eco-counter.com/api/v2/history/traffic/aggregated?siteId='+a+'&include=&startDate='+dd4+'&endDate='+dd+'&startTime=00%3A00&endTime=00%3A00&granularity=P1W&groupBy=travelMode&gapFilling=false&travelModes=pedestrian&travelModes=bike' 
	let url4 = await 'https://api.eco-counter.com/api/v2/history/traffic/aggregated?siteId='+a+'&include=&startDate='+dd5+'&endDate='+dd+'&startTime=00%3A00&endTime=00%3A00&granularity=P1M&groupBy=travelMode&gapFilling=false&travelModes=pedestrian&travelModes=bike' 

	const lastMonth = await fetch(url, options)
	 	.then(response => response.json())

	const sixMonths = await fetch(url2, options)
		.then(response => response.json())

	const sixMonths_weekly = await fetch(url3, options)
		.then(response => response.json())

	const sixMonths_yearly = await fetch(url4, options)
	.then(response => response.json())

	const resp = { "lastMonth":lastMonth, "sixMonths":sixMonths,"sixMonths_weekly":sixMonths_weekly, "sixMonths_yearly":sixMonths_yearly };

	return json(resp)

}