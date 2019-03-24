import axios from 'axios';
import {convert} from './convertTemperature.js'

const apiKey = "64aff70137bc9abe67c79efb84133f54";
const form = document.querySelector('#city-form');
const cityList = document.querySelector('.collection');
const citySearch = document.querySelector('#Search');
const html = '<div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>'


function loadEventListeners() {
  //DOM load event
  document.addEventListener('DOMContentLoaded', getCitiesFromLocalStorage);
  form.addEventListener('submit', addCityToList);
  cityList.addEventListener('click', removeButton);
  document.addEventListener('keypress', function(event){
    if (event.keyCode === 13 || event.which === 13) {
        addCityToList(event);
    } else {
        
    }
    


  });  
}

function apiRequest(city, element){
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}`;
  let results;
  //const td = document.createElement('td');

   function procesRequest () {
     var temperature;
     var humidity;
     var pressure;

     const t = document.createElement('p');
     const h = document.createElement('p');
     const p = document.createElement('p');
    axios.get(url)
      .then((response) => {
        console.log(response);
        if(response.status===200){
          temperature = response.data.main.temp;
          humidity = response.data.main.humidity;
          pressure = response.data.main.pressure;
          t.innerHTML = "Temperature: "+ convert(temperature.toString()) + "&degC";
          h.innerHTML = "Humidity: "+humidity+"%";
          p.innerHTML = "Pressure: "+pressure+" hPa";
          element.appendChild(t);
          element.appendChild(h);
          element.appendChild(p);
          return;
        } else {
          console.log("not working");
        }
 
      })
      //.catch((error) => {
        //console.log(error);
      //});
  }

  procesRequest();

}

//get cities from localStorage
function getCitiesFromLocalStorage(){
  let cities;
  //var domCollection = '.collection-item';
  if(localStorage.getItem('cities') === null){
    cities = [];
  } else {
    cities = JSON.parse(localStorage.getItem('cities'));
  }

  cities.forEach(function(city){
   
    const li = document.createElement('li');
    li.className = 'collection-item';
        //create clouds icon
       const link2 = document.createElement('i');
        link2.className = 'material-icons';
        link2.innerHTML = 'filter_drama';
        li.appendChild(link2);
        
    //create text node and append to li
    li.appendChild(document.createTextNode(city));
   
    //create new link createElement
    const link = document.createElement('a');
    
    //create new p element
    apiRequest(city, li);
    
    link.className = 'delete-item secondary-content';
    link.innerHTML = '<i class="material-icons">delete</i>';
    //append the link to li
    li.appendChild(link);
   
    //append li to ul
    cityList.appendChild(li);
  });

}
//add city by button
  function addCityToList(e) {
    var checkCity = validateCity(citySearch.value);
  if (citySearch.value === '') {
    //change this to toast
    alert("Enter city name");
  }else if(checkCity){
    return;
  } 
  else {
    //create li element

  
        const li = document.createElement('li');
        li.className = 'collection-item';
        const link2 = document.createElement('i');
        link2.className = 'material-icons';
        link2.innerHTML = 'filter_drama';
        li.appendChild(link2);
        
        //create text node and append to li
        li.appendChild(document.createTextNode(" " + citySearch.value.toUpperCase()));
        //create new link createElement
        
         if(apiRequest(citySearch.value, li)!==""){
          //apiRequest(citySearch.value, li);
        const link = document.createElement('a');

        link.className = 'delete-item secondary-content';
        //add icon html
        link.innerHTML = '<i class="material-icons">delete</i>';
        //append the link to li
        li.appendChild(link);
        //append li to ul
        cityList.appendChild(li);
        // store in localStorage
        var cityLocal = " " + citySearch.value.toUpperCase();
       storeInLocalStorage(cityLocal);
        //clear input
        citySearch.value="";
         } else{
          var deleteChild = document.querySelector('collection');
          deleteChild.removeChild(deleteChild.lastChild);  
         }
            
}
e.preventDefault();

}

function storeInLocalStorage(city){
  let cities;
  if(localStorage.getItem('cities') === null){
    cities = [];
  } else {
    cities = JSON.parse(localStorage.getItem('cities'));
  }
  cities.push(city);
  localStorage.setItem('cities', JSON.stringify(cities));
}

function removeFromLocalStorage(cityItem){
  let cities;
  if(localStorage.getItem('cities') === null){
    cities = [];
  } else {
    cities = JSON.parse(localStorage.getItem('cities'));
  }

  cities.forEach(function(city, index){
    //delete is a name of an icon and idk why (recurrence?) but its appended to city name
    if(cityItem.childNodes[1].textContent === city){
      cities.splice(index,1);
    }
  });

  localStorage.setItem('cities', JSON.stringify(cities));
}

function removeButton(e) {
  if (e.target.parentElement.classList.contains('delete-item')) {
    if (confirm('Are You Sure?')) {
      e.target.parentElement.parentElement.remove();
      removeFromLocalStorage(e.target.parentElement.parentElement);
    }
  }
  e.preventDefault();
}
function validateCity(searchCity){
  var bool = false;
  searchCity = " " + searchCity.toUpperCase();
  console.log(searchCity);
  
  var storage = localStorage.cities.split('"');
  for(var i=0; i<storage.length; i++){
    if(searchCity===storage[i]){
      bool=true;
    }
  }
  return bool;
}
loadEventListeners();
