import Head from 'next/head'
// import KGraph from './KGraph';
import { getActions, getData } from '../lib/api';
import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });



function KGraph(props) {
  var tmp = JSON.parse(props.values)
  console.log(tmp)
  
  var options = {
    chart: {
    height: 350,
    type: 'area',
    zoom: {
      type: "x",
      enabled: true,
    },
  },
    
  title: {
    text: 'Weather Data'
  },
  dataLabels: {
    enabled: false,
    enabledOnSeries: [1]
  },
  labels: tmp.times,
  xaxis: {
    type: 'datetime'
  },
  yaxis: [{
    title: {
      text: 'Temperature & Humidity',
    },
    labels: {
      formatter: function (val) {
        return (val).toFixed(0);
      },
    }
  }
  
  // {
  //   opposite: true,
  //   title: {
  //     text: 'Humidity'
  //   }
  // }
],
  fill: {
  type: 'gradient',
  gradient: {
    shadeIntensity: 1,
    inverseColors: false,
    opacityFrom: 0.7,
    opacityTo: 0,
    stops: [0, 90, 100]
  }
  }
  }
  var series = [{
    name: 'Temperature',
    type: 'area',
    data: tmp.temperature
  }, {
    name: 'Humidity',
    type: 'area',
    data: tmp.humidity
  }]

  return <ApexCharts width="350%" options={options} series={series} type="area"/>

}

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

