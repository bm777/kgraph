import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });


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

  export default KGraphHum