import React, { Component } from 'react';
import logo from './logo.svg';
import { Col,Button, Form, FormGroup, Label, Input, FormText,Card,CardBody,CustomInput, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './App.css';
import DatePicker from "react-datepicker";
//import Autocomplete from "./Autocomplete";
import Autosuggest from 'react-autosuggest';
import cities from './cities'

//autocomplete methods
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  
  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return cities.filter(language => regex.test(language));
}

function getSuggestionValue(suggestion) {
  return suggestion;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion}</span>
  );
}

//class starts here
class App extends Component {
  constructor(props)
  {
    super(props)
    this.state = {
      value: '',
      slotData : {
        location: this.value,
        date : new Date().toISOString().substring(0, 10),
        time : new Date().toISOString().substring(11, 16),
        type : "",
        email: ""
      },
      modal: false,
      suggestions: []
    }

    this.toggle = this.toggle.bind(this);
    console.log(this.state.slotData.date,this.state.slotData.time)
  }

  changeHandler(data,event)
  {
    const {property} = event.target.dataset;
    const value =  event.target.value;
    this.setState((preState) => {
      preState.slotData[property] = value;
      return {"slotData":preState.slotData};
    })
    console.log(value,property);
  }

  handler(property,event)
  {
    const value =  event.target.value;
    this.setState((preState) => {
      preState.slotData[property] = value;
      return {"slotData":preState.slotData};
    })
    console.log(value,property);
  }

  async callUpdate()
  {
    
    let data = this.state.slotData;
    this.toggle.call(this);
    console.log("data",JSON.stringify(data))
    var post = {
        mode: 'no-cors',
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    }
    
    var response = await fetch('http://localhost:3001/save',post);
    if(response.ok)
    {
      //var resData = await response.json();
    }
    else
    {
      console.log(response.status);
    }
    
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
      value: '',
      slotData : {
        location: this.value,
        date : new Date().toISOString().substring(0, 10),
        time : new Date().toISOString().substring(11, 16),
        type : ""
      }
    });
  }

  //autocomplete
  onChange = (event, { newValue, method }) => {
    this.setState((preState) => {
      preState.value = newValue;
      preState.slotData["location"] = newValue;
      return {"slotData":preState.slotData};
    });
  };
  
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  
  render() {
    
    let submitForm = (event)=>{
      event.preventDefault();
      console.log(event);
      const data = new FormData(event.target);
      console.log(data.get('author'));
      console.log(data.get('datTo'));
      console.log(data.get('dateFrom'));    
    }
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Ex:Bengaluru",
      value,
      onChange: this.onChange
    };
    return (
      
      <div className="SlotBooking">
        
        <img style={{width: '100%', height: '100px'}} src={require("./images/banner.jpg")}></img>
        <center>
          <div></div>
        <Col sm={8}>
        <Card>
        <CardBody>
        <form>
          <FormGroup row>
            <Label for="location" sm={2}>Location</Label>
            <Col sm={8}>
                <Autosuggest 
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps} />
              {/* <Input type="text" name="text" id="location" data-property='location' value={this.state.slotData.location} onChange={this.changeHandler.bind(this,{})} placeholder="Ex: Bangalore" /> */}
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="date" sm={2}>Date</Label>
            <Col sm={8}>
              <Input type="date" name="date" id="date" min={new Date().toISOString().substring(0, 10)} data-property='date' defaultValue={this.state.slotData.date} onChange={this.changeHandler.bind(this,{})} placeholder="date placeholder" />
            </Col>
          </FormGroup>
          
          <FormGroup row>
            <Label for="time" sm={2}>Time</Label>
            <Col sm={8}>
              <Input type="time" step="900" name="time" id="time" data-property='time' defaultValue={this.state.slotData.time} onChange={this.changeHandler.bind(this,{})} placeholder="time placeholder" />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="email" sm={2}>Email</Label>
            <Col sm={8}>
            <Input type="email" name="email" id="email" data-property='email' value={this.state.slotData.location} onChange={this.changeHandler.bind(this,{})} placeholder="Enter your email address" />
            </Col>
          </FormGroup>
          <FormGroup row  onChange={this.changeHandler.bind(this,{})}>
            <Col sm={2}>
              <Label for="exampleCheckbox">Type</Label>
            </Col>
            <Col sm={8}>
              <CustomInput data-property='type' type="radio" id="type1" name="type" label="type1" inline />
              <CustomInput data-property='type' type="radio" id="type2" name="type" label="type2" inline />
              <CustomInput data-property='type' type="radio" id="type3" name="type" label="type3" inline/>
            </Col>
          </FormGroup>
          <FormGroup check row>
            <Col sm={{ size: 10}}>
              <Button color="primary" onClick={this.callUpdate.bind(this)}>Book</Button>
            </Col>
          </FormGroup>
          
        </form>
        </CardBody>
        </Card>
        </Col>
        <Modal isOpen={this.state.modal} toggle={this.toggle.bind(this)}>
          <ModalBody>
            Your slot is booked successfully!
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle.bind(this)}>Ok</Button>{' '}
          </ModalFooter>
        </Modal>
        </center>
      </div>
    );
  }
}

export default App;
