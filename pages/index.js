import Head from 'next/head'
import { getActions, getData, conversion, compare } from '../lib/api';
import dynamic from 'next/dynamic';
import { useState } from 'react';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });



function KGraphTemp(props) {
  var tmp = JSON.parse(props.values)
  const [celcius, setCelcius] = useState(true);

  
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
    text: ''
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
      text: celcius? "Temperature  (°C)" : " Temperature (°F)",
    },
    labels: {
      formatter: function (val) {
          return (val).toFixed(2)
      }
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
  // Converted value to Fahrenheit unit
  var series_fah = conversion(tmp.temperature)

  var series = [{
    name: 'Temperature',
    type: 'area',
    data: celcius ? tmp.temperature : series_fah
  }]
  

  return (
    <>
      <div className='addButton'>
        {/* <MDBBtn>to Fahrenheit</MDBBtn> */}
        <button className='btn' onClick={() => { setCelcius(!celcius)}}>
          {
            celcius ? "to Fahrenheit" : "to Celcius"
          }
        </button>
        <ApexCharts width="300%" options={options} series={series} type="area"/>
      </div>
      
      
    </>
  )

}


function KGraphHum(props) {
  var tmp = JSON.parse(props.values)
  
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
    text: ''
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
      text: 'Humidity (%)',
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
  legend: {
    show: false
  },
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
    name: 'Humidity',
    type: 'area',
    data: tmp.humidity
  }]
  return (
    <div className='addButton'>
      <br />
      <ApexCharts width="300%" options={options} series={series} type="area"/>
    </div>
  )

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
          {
            props.existing_sensor && props.is_data_collected? 
            (
              <>
                Pulled data from the <code>Telos Blockchain</code>
              </> 
            )
            :
            props.is_data_collected ?
            (
              <>
                <code>Sensor doesn't exist</code>
              </>
            ):
            (
              <>
                <code>Data wasn't collected on that period</code>
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
  // if (!parsed.temperature){
  //   const size = parsed.times.length
  // } else {
  //   const size = parsed.times.length
  // }
    
  
 

  const _data = JSON.stringify(parsed)
  
  // check result of _data
  let existing_sensor = false
  if(_data == JSON.stringify({temperature:[],humidity:[],times:[]})){
    existing_sensor = false
  }else{
    existing_sensor = true
  }
  // is data collected statement
  const size = parsed.times.length
  let is_data_collected = true

  if(size == 0){
    is_data_collected = true
  }else{
    const from = new Date(parsed.times[size-1]).toISOString()
    const day_threshold = start
    is_data_collected = compare(from, day_threshold)
  }
  

  


  return {
    props: {
      data: _data || JSON.stringify({}),
      existing_sensor,
      is_data_collected
    }
  }
}

