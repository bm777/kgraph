import { useState } from 'react';
import dynamic from 'next/dynamic';
import { conversion } from '../lib/api';
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

  export default KGraphTemp