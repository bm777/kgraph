import { account, actionName, history_endpoint, limit } from "./constant"

export async function getActions( begin_time_iso_date ) {
    let url = history_endpoint + "/v2/history/get_actions?"
        +"account="+account
        +"&act.name="+actionName
        +"&after="+begin_time_iso_date
        +"&limit="+limit;

    const fetchPromise = fetch(url);

    return fetchPromise

}

// get all the timeseries & data related to timeseries inside the json response
export function getData(bunk, devname) {
    let _temperature = []
    let _humidity = []
    let _times = []
    for(let row of bunk){
      if(row.act.data.devname == devname) {
        _temperature.push(row.act.data.temperature_c)
        _humidity.push(row.act.data.humidity_percent)
        _times.push(row.timestamp)
      }
      
    }
  
    return {
      temperature: _temperature,
      humidity: _humidity,
      times: _times
    }
  }