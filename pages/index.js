import Head from 'next/head'
import { getActions, getData, compare } from '../lib/api';
import KGraphTemp from '../components/KGraphTemp';
import KGraphHum from '../components/KGraphHum';


export default function Home(props) {
  return (
    <div className="container">
      <Head>
        <title>Sensor Data</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main>
        <h1 className="title">
          Kanda Weather Station <a href="http://kandaweather.org/">data</a>
        </h1>

        <p className="description">
          {
            props.existing_sensor ? 
            (
              <>
                Pulled data from the <code>Telos Blockchain</code>
              </> 
            )
            :
            !props.is_data_collected ?
            (
              <>
                <code>Data wasn't collected on that period </code>

              </>
            ):
            (
              <>
                <code>Sensor doesn't exist</code>
              </>
            )
          } 
        </p>

        {/* Adding the chart */}
        <div className='kgraph'>
          {
            (props.existing_sensor && props.is_data_collected)?
              (
                <>
                  <KGraphTemp values={props.data}/> 
                  <KGraphHum values={props.data}/>
                </> 
              ) 
            :
              ( <>
                <KGraphTemp values={JSON.stringify({temperature:[],humidity:[],times:[]})}/> 
                <KGraphHum values={JSON.stringify({temperature:[],humidity:[],times:[]})}/> 
              </>
              )
          }       
        </div>
    

        {/* End of the the chart */}        
      </main>

    </div>
  )
}

// getServerSideProps from external sources
export async function getServerSideProps(context) {

  // get the start time and the name of the device sensor
  let d = new Date();
  
  // let start = "2022-03-10T09:38:42.500Z";
  
  const _devname = context.query.sensor
  var _before = context.query.before

  /////////////////////////////
  if(!_before) _before = 5
  /////////////////////////////

  d.setDate(d.getDate() - _before);
  
  // set the day to today - 'before' days
  let start = d.toISOString()
 
  // get the response data
  const res = await getActions( start )

  // parse into json format
  const json = await res.json()
  const _actions = json.actions

  const parsed = getData(_actions, _devname)
  console.log(parsed)

  const _data = JSON.stringify(parsed)
  
  // check result of _data
  let existing_sensor = false
  if(_data == JSON.stringify({temperature:[],humidity:[],times:[]})){
    existing_sensor = false
  }else{
    existing_sensor = true
  }

  // is data collected statement ?
  const size = parsed.times.length
  let is_data_collected = true

  if(size == 0){
    is_data_collected = false
  }else{
    
    is_data_collected = true
  }
  
 
  return {
    props: {
      data: _data || JSON.stringify({}),
      existing_sensor,
      is_data_collected,

    }
  }
}

