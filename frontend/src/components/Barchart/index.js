
import './index.css'

import {Bar} from 'react-chartjs-2'

import {
  Chart as ChartJs,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend

}
 from 'chart.js'

 ChartJs.register(

  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
 )



const BarChart = (props)=>{
  const {barChartData}=props
  console.log("bar chart data",props)

  const data ={
    labels: barChartData.map(each=>each.priceRange),
    datasets:[
      {
        label: "price range",
        data:barChartData.map(each=>each.numberOfItems),
        backgroundColor:"aqua",
        borderColor: "Black",
        borderWidth:1,
      }
    ]
  }

  const options = {

  }

  return(
    <>
      
      <div
  className='bar-chart-container'
      
      >
        <Bar
        data ={data}
        options={options}
        
        >

        </Bar>
      </div>
    </>
  
)
  }
export default BarChart