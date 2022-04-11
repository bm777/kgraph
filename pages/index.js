import Head from 'next/head'
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { getActions } from '../lib/api';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });


function KGraph({values}) {
  var tmp = JSON.parse(values)
  
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


export default function Home({data}) {
  const router = useRouter()
  

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

  const data = JSON.stringify(parsed)
  return {
    props: {
      data: data || JSON.stringify({})
    }
  }
}

// get all the timeseries & data related to timeseries inside the json response
function getData(bunk, devname) {
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