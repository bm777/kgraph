import dynamic from 'next/dynamic';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });



export default function KGraph(props) {
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