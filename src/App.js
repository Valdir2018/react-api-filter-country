import React, { Component } from 'react';
import Countries from './components/countries/Countries';
import Header from './components/countries/header/Header';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      allCountries: [],
      filteredCountries: [],
      filteredPopulation: 0,
      filter: '',
    };
  }

  async componentDidMount() {
      const res =  await fetch('https://restcountries.eu/rest/v2/all');
      const json = await res.json();
      
      const allCountries = json.map(({ name, numericCode, flag, population}) => {
          return {
            id: numericCode,
            name,
            filterName: name.toLowerCase(),
            flag,
            population,
           } 
      });

      const filterPopulation = this.calculateTotalPopulation(allCountries);

      this.setState({
        allCountries,
        filteredCountries: Object.assign([], allCountries),
        filterPopulation,
      });
  }

  calculateTotalPopulation = (countries) => {    
      const totalPopulation = countries.reduce((accumulator, current) => {
         return accumulator + current.population;
      }, 
      0);

      return totalPopulation;
  }

  handleChangeFilter = (newText) => {
     this.setState({
       filter: newText,
     });

     const filterLowerCase = newText.toLowerCase();

     const filteredCountries = this.state.allCountries.filter((country) => {
          return country.filterName.includes(filterLowerCase);
     });

     const filterPopulation = this.calculateTotalPopulation(filteredCountries);

     this.setState({
        filteredCountries,
        filterPopulation,
     });
  };
  
  render() {
    const { filteredCountries, filter, filterPopulation } = this.state;
    
    return (
    <div className="container">
        <h1 style={styles.centeredTitle} > React Countries</h1>
        <Header  
          filter={filter}
          totalPopulation={filterPopulation} 
          countryCount={filteredCountries.length} 
          onChangeFilter={this.handleChangeFilter} 
         />
        
        <Countries countries={filteredCountries} />
    </div>
    );
  }
}


const styles = {
  centeredTitle: {
     textAlign: 'center',
  },
}