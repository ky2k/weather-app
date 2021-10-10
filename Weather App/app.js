// Geo Location
class GeoLocation{
   getPositon(){
    //Check Browser Support.
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition((data) => {
        //latitude longitude :)
         let lat =  data.coords.latitude;
         let lng = data.coords.longitude;
         console.log(lat);
         let address=`${lat},${lng}`
         let apiURL=`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${address}?key=4F6MKAP2RQE2HYTDH3LTCHXT7`
         let api=new Api(apiURL,'weather data/data.json')
         // :)
         api.getData()
      })
    }else{
      alert("Close Pannitu Vera velya paarunga:(")
    }
  }
}
// // init location
// let loc=new GeoLocation();
// loc.getPositon()
//-----------------------------------------------
//Api Process
class Api{
  constructor(apiURL,iconURL){
    this.apiURL=apiURL
    this.iconURL=iconURL
  }
  //get api data
  async getData() {

    await fetch(this.apiURL).then((responce)=>{
      UI.pageLoader(responce)
      return responce.json()
    }) .then((data)=>{
      //yes i gotta data :)
      // console.log(data);
      // this.weatherIcon(data)
      this.weatherInfo(data)
      this.weatherForecasts(data)
      this.getIconData(data)
    });
  }
  async getIconData(data){
    await fetch(this.iconURL).then((responce)=>{
      return responce.json();
    }).then((icons)=>{
      //gotto :)
      // console.log(data);
      //svg data
      this.weatherIcon(data,icons)
    })
  }
  weatherIcon(data,icons){
    //conditions
    let condition=data.currentConditions.conditions
    //icon case :
    UI.showIcon(condition,icons)
  }
  weatherInfo(data){
    //temp
    let temp=data.currentConditions.temp
    //Condtions info
    let conditions=data.currentConditions.conditions
    //Description
    let description=data.days[0].description
    //UI 3
    UI.currentCon(temp,conditions,description)
  }
  weatherForecasts(data){
    //forecast array
    let fcast=data.days
    const months=["January","February","March","April","May","June","July","August","September","October","November","December"]
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    //get first Seven Day ForeCast
    fcast.slice(1,8).forEach((value)=>{
      let d=new Date(value.datetime)
      //Mm gotta :)
      let fcastcon=value.conditions
      let ftdays=days[d.getDay()].slice(0,3)
      UI.showForecast(fcastcon,ftdays)

    })
    //Current date time year
    let m=new Date(fcast[0].datetime)
    let d=new Date(fcast[0].datetime)
    let month=months[m.getMonth()]
    let day=days[d.getDay()]
    let date=d.getDate()
    let year=d.getFullYear()
    //dom 1
    UI.dateTime(day,date,month,year)

  }
}

// let api=new Api('res data.json','weather data/data.json')
// // :)
// api.getData()

//DOM
class DomFetch extends Api{
  dateTime(day,date,month,year){
    let datetime=document.querySelector('.dym p')
    //Tuesday 1 October 2021 :)
    datetime.innerText=`${day} ${date} ${month} ${year}`
  }
  showIcon(condition,icons){
    //icon div 
    let icon=document.querySelector(".weather_condition")
    //for regEx
    let spl=condition.split(' ')
    let reg=spl.join('')
    //selection
    Object.keys(icons).forEach((key)=>{
      if(reg==key){
        icon.innerHTML=icons[key]
        icon.firstElementChild.style.width='300px'
        icon.firstElementChild.style.height='180px'
      }
    })
    UI.pageLoader(icons)
  }

  currentCon(temp,conditions,description){
    //temperature
    let tem=document.querySelector('.temp')
    tem.innerHTML=`${temp}<sup>O</sup>`
    //wheather Condition
    let con=document.querySelector('.weather_info h3')
    con.innerText=conditions
    //Description
    let des=document.querySelector('.weather_info p')
    des.innerText=description
  }
  showForecast(fcastcon,ftdays){
    let forecasts=document.querySelector(".forecasts")
    forecasts.innerHTML+=`<div class="list"><span class="day">${ftdays}</span><span class="point"></span><span class="f_info">${fcastcon}</span></div>`
  }
  pageLoader(icons) {
    let homePage=document.querySelector('.container')
    let homePage1=document.querySelector('.home')
    if(typeof icons=='object'){
      homePage.classList.remove('hide_home')
      homePage1.classList.add('hide_home')
    }else{
      homePage.classList.add('hide_home')
      homePage1.classList.remove('hide_home')
    }
  }
  home(){
    
    //home
    let homePage=document.querySelector('.container')
    let h_clk=document.querySelector('.home_icon')
    let home_page=document.querySelector(".home")
    home_page.classList.forEach((cls)=>{
      if(cls=="hon"){
        console.log(cls);
        home_page.classList.add('hoff')
        home_page.classList.remove('hon')
      }else if(cls=="hoff"){
        home_page.classList.remove('hoff')
        home_page.classList.add('hon')
      }
    })
  
  }
}
let UI=new DomFetch();
//Click Events 
//menu 
let m_icon=document.querySelector('.open_icon')
let menu_click=document.querySelector('.menu_icon')
let menu=document.querySelector('.menu')

menu_click.addEventListener('click',(e)=>{
m_icon.classList.forEach((item)=>{
  if('open_icon'==item){
    console.log()
    m_icon.classList.add('b-back')
    menu.classList.add('b-front')
    m_icon.previousElementSibling.classList.add('b-front')
    m_icon.classList.remove('open_icon')
  }else{
    m_icon.classList.remove('b-back')
    menu.classList.remove('b-front')
    m_icon.previousElementSibling.classList.remove('b-front')
    m_icon.classList.add('open_icon')
  }
}) 
})


//Location Switch
let swtch=document.querySelector('.btn')
let on=document.querySelector('.switch')
let off=document.querySelector('.switch1')
swtch.addEventListener('click',(e)=>{
 swtch.classList.forEach((item)=>{
        navigator.permissions.query({ name: 'geolocation' })
      .then((d)=>{
      if(d.state=='granted'){
        //blink
        on.classList.add('blink')
        off.style.display='none';
        let loc=new GeoLocation();
        loc.getPositon()
        }else{
          //grey
          off.style.display='inline';
          navigator.geolocation.getCurrentPosition(()=>{})
          console.log('Please Allow Location');
          }
      })
  // }
 })
})
//search click
let s_click=document.querySelector('.s-icon')
s_click.addEventListener('click',()=>{
  s_click.classList.forEach((item)=>{
    if(item=='0'){
      s_click.classList.add('sca-e')
      s_click.classList.remove('sca-e1')
      s_click.classList.add('1')
      s_click.classList.remove('0')
    }else if(item=='1'){
      s_click.classList.remove('sca-e')
      s_click.classList.add('sca-e1')
      s_click.classList.remove('1')
      s_click.classList.add('0')
    }
  })
})



