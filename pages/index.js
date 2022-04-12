import Head from 'next/head'
import KGraph from './KGraph';
import { getActions, getData } from '../lib/api';



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
          Pulled data from the  <code>Telos Blockchain</code>
        </p>

        {/* Adding the chart */}
        <div className='kgraph'>
          {
            props.existing_data ? 

            <KGraph values={props.data}/> : "No data was collected on that period or the given sensor doesn't exist"

          }
          
          {/* <KGraph /> */}
            
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
  const _before = context.query.before
  d.setDate(d.getDate() - _before);
  
  // set the day to today - 'before' days
  let start = d.toISOString()
 
  // get the response data
  const res = await getActions( start )

  // parse into json format
  const json = await res.json()
  const _actions = json.actions
   

  const parsed = getData(_actions, _devname)
  // console.log(parsed)

  const _data = JSON.stringify(parsed)
  
  // check result of _data
  let existing_data = false
  if(_data == JSON.stringify({temperature:[],humidity:[],times:[]})){
    existing_data = false
  }else{
    existing_data = true
  }

  return {
    props: {
      data: _data || JSON.stringify({}),
      existing_data
    }
  }
}

