import Head from 'next/head'
import KGraph from './KGraph';
import { getActions, getData } from '../lib/api';



export default function Home({data}) {
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
          
          <KGraph values={data}/>
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
  let start = "2022-03-20T09:38:42.500";
  const _devname = context.query.sensor
  
  // get the response data
  const res = await getActions( start )
  
  // parse into json format
  const json = await res.json()
  const _actions = json.actions

  const parsed = getData(_actions, _devname)  
  // console.log(parsed)

  const _data = JSON.stringify(parsed)

  return {
    props: {
      data: _data || JSON.stringify({})
    }
  }
}

