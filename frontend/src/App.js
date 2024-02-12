
import {Component} from 'react'
import BarChart from './components/Barchart';
import './App.css';


class App extends Component {

  state = {selectedMonth:"2",allTransactionList:[],pageNumber:1,searchText:'',statisticsData:[],barData:[]}

  componentDidMount(){
    this.getData()
    
    
    this.getStatistics()
    
  }




  getStatistics = async()=>{
    const {selectedMonth} = this.state
    const parsedMonth = parseInt(selectedMonth)
    const response1 = await fetch(`http://localhost:4001/statistics/${parsedMonth+1}`)
    const response2 = await fetch(`http://localhost:4001/barChart/${parsedMonth}`)
    const data2 = await response2.json()
    
    const data1 = await response1.json()
    if (response1.ok === true){
      const newData = {
        totalPrice: data1.total_price,
        totalSoldItems :data1.total_sold_items,
        totalNotSoldItems:data1.total_not_sold_items
      }

      const newDataBar = data2.map(each=>
        ({
          priceRange: each.price_range,
          numberOfItems:each.number_of_items
        })
        )
        console.log('data2',newDataBar)

      this.setState({
        statisticsData: newData,
        barData:newDataBar
      })
    }

  }

  getData = async()=>{
    const {pageNumber} = this.state
    
    const response = await fetch(`http://localhost:4001/allTransactions/?page=${pageNumber}&perPage=${10}`)
    const data = await response.json()
    
    if (response.ok === true){
      this.setState({
        allTransactionList: data
      })
    }

  }





  onChangeOption =(event)=>{
    
    this.setState({
      selectedMonth: (event.target.value)
    },this.getStatistics)
  }

  onClickPrev = ()=>{
    const {pageNumber,pagination} = this.state
    if (pagination>10 && pageNumber >0){
      this.setState({
        pagination: pagination-10,
        pageNumber: pageNumber-1,
        searchText:''
      },this.getData)
    }
  }


  onClickNext =()=>{
    const {pageNumber,pagination} = this.state
    this.setState({
      pagination: pagination+10,
      pageNumber: pageNumber+1 ,
      searchText:''
    },this.getData)
  }


  onChangesearch = async(event)=>{
    const {allTransactionList,searchText,pageNumber} = this.state
    if (searchText === ''){
      const response = await fetch(`http://localhost:4001/allTransactions?page=${pageNumber}&perPage=${10}`)
      const data = await response.json()

      this.setState({
        allTransactionList:data
      },this.getData)
    }
    this.setState({
      searchText: event.target.value,
      allTransactionList: allTransactionList.filter(each=>
      each.title.includes(event.target.value) ||
      each.description.includes(event.target.value) ||
      String(each.price).includes(event.target.value))
      })
    
  }  


    returnMonth = (month)=>{
    if (month==="0"){
        return "January"
    }
    else if (month==="1"){
      return "Febraury"
    }
    else if(month==="2"){
      return "March"
    }
    else if(month==="3"){
      return "April"
    }
    else if(month==="4"){
      return "May"
    }
    else if(month==="5"){
      return "June"
    }
    else if (month==="6"){
      return "July"
    }
    else if(month==="7"){
      return "August"
    }
    else if(month==="8"){
      return 'September'
    }
    else if(month==="9"){
      return "October"
    }
    else if(month==="10"){
      return "November"
    }
    else if(month==="11"){
      return 'December'
    }

  }

  render(){

    let {allTransactionList,selectedMonth,pageNumber,statisticsData,barData} = this.state
    

    allTransactionList = allTransactionList.filter(each=>{
      const {dateOfSale} = each
      const newDate = new Date(dateOfSale)
      const month = newDate.getMonth()
      
      if (month===parseInt(selectedMonth)){
        return true
      }
      return ''
      

    })



  return (
    <div className="bg-container">
        <h1 className='transaction-heading'>Transaction <br/>Dashboard</h1>
        <div className='search-month-container'>
            <input type='search' className='search-input' placeholder='Search transaction' onChange={this.onChangesearch}/>
             

            
    <select value={selectedMonth} id="months" name="months" className='selection-container' onChange={this.onChangeOption}>
        <option value={0}>January</option>
        <option value={1}>February</option>
        <option value={2} selected>March</option>
        <option value={3}>April</option>
        <option value={4}>May</option>
        <option value={5}>June</option>
        <option value={6}>July</option>
        <option value={7}>August</option>
        <option value={8}>September</option>
        <option value={9}>October</option>
        <option value={10}>November</option>
        <option value={11}>December</option>
    </select>

    </div>
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Title</th>
          <th>Description</th>
          <th>Price</th>
          <th>Category</th>
          <th>Sold</th>
          <th>image</th>
        </tr>

      </thead>
      <tbody>
        {allTransactionList.map(each=>
        <tr>
          <th>{each.id}</th>
          <th>{each.title}</th>
          <th>{each.description}</th>
          <th>{each.price}</th>
          <th>{each.category}</th>
          <th>{each.sold}</th>
          <th><img src={each.image} alt='product_image'/></th>
          
          </tr>
          )}
      </tbody>
    </table>
    <div className='buttons-container'>
      <p>page: {pageNumber}</p>
      <div className='previous-next-button'>
        <button type='button' className='nav-button' onClick={this.onClickPrev}>Previous</button>
        <button type='button' className='nav-button' onClick={this.onClickNext}>Next</button>
      </div>
      <p>Per Page: 10</p>
    </div>
      <div className='bottom-container'>
      <div className='statistics-container'>
        <h1 className='statistics-heading'>Statistics- {this.returnMonth(selectedMonth)}</h1>
        <div className='stats-bt-container'>
        <div className='stats-container'>
          <p className='sales-title'>Total Sale</p>
          <p>{statisticsData.totalPrice}</p>
        </div>
        <div className='stats-container'>
          <p  className='sales-title'>Total Sold Items</p>
          <p>{statisticsData.totalSoldItems}</p>
        </div>
        <div className='stats-container'>
          <p  className='sales-title'>Total not Sold Items</p>
          <p>{statisticsData.totalNotSoldItems}</p>
        </div>
          </div>
      </div>

          <div className='bar-chart-home-container'>
            <h1 className='bar-chart-heading'>Bar chart stats - {this.returnMonth(selectedMonth)}</h1>
            <BarChart barChartData= {barData}/>
          </div>
          </div>
        </div>
      
    
  )
}
}


export default App;
