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