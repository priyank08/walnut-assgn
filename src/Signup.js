import React, { Component } from 'react';
import Anime from './pixpixate.gif';
import moment from "moment";
import { FormGroup,FormControl, InputGroup,Radio,ButtonGroup,Button ,Checkbox} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import $ from 'jquery';
import "react-datepicker/dist/react-datepicker.css";
import validator from 'validator';
import _ from 'underscore';
import ReactSliderNativeBootstrap from 'react-bootstrap-native-slider';
import Select from 'react-select';
import fetchJsonp from 'fetch-jsonp';
import Tick from './tick.png';
import './Signup.css';
import 'react-select/dist/react-select.css';
import {reactLocalStorage} from 'reactjs-localstorage';


class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      salary_step: 5000,
      min_value : 20000,
      max_value : 200000,
      first_name: '',
      birth_date: moment(),
      phone: '',
      gender: null,
      genderValue: '',
      error: {},
      currentValue:110000,
      selectedOption: '',
      selectedState:'',
      selectedCity :'',
      states:[],
      cities:[],
      ismodal : false,
      isdisabled : true,
    }
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.handlePersonalDetails = this.handlePersonalDetails.bind(this);
    this.addFirstName = this.addFirstName.bind(this);
    this.addPhoneNumber = this.addPhoneNumber.bind(this);
    this.addEmail = this.addEmail.bind(this);
    this.submitRegistrationDetails = this.submitRegistrationDetails.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.getStates = this.getStates.bind(this);

  }

  componentDidMount(){
    fetchJsonp('https://battuta.medunes.net/api/region/IN/all/?key=94c9e2a436810559a857776bb70ec849')
      .then((response) => {
      return response.json();
      }).then((json) => {
      let temp = [];
      json.forEach(function(value){
      temp.push({'value' : value.region, 'label' : value.region })
      })
      this.setState({states : temp});
      });

  }

  // postCall(){
  //   fetch(API-URL, {
  //         method:'POST',
  //         body: user
  //       });
  // }

  addFirstName(e) {
    var updatedError = "";
    const regEx = /^[a-zA-Z_ ]+$/;

    if(!regEx.test(e.target.value)){
      updatedError = 'Please enter Letters only';
    }
    if(updatedError){
      this.setState({
        error: {
          first_name : updatedError
        }
      });
    } else {
      updatedError = ""
      this.setState({
        first_name : e.target.value,
        error: {
          first_name : updatedError
        }
      });

    }


    this.setState({
      first_name: e.target.value
    });
    console.log("Name", this.state.first_name);
  }

  addEmail(e){
    var updatedError = "";
    if (!validator.isEmail(e.target.value)) {
       updatedError = 'Please enter a valid email address';
     }
     if(updatedError){
       this.setState({
         error: {
           email : updatedError
         }
       });
     } else {
       updatedError = ""
       this.setState({
         email : e.target.value,
         error: {
           email : updatedError
         }
       });
     }

  }

  addPhoneNumber(e) {

    var updatedError = "";
    console.log("phone",e.target.value);
    if (!validator.isNumeric(e.target.value)) {
      updatedError = 'Please enter a valid Phone number';
    }
    if(_.indexOf([7,8,9], parseInt(e.target.value[0])) == -1){
            updatedError = 'Please enter a valid Phone number';
    }

    this.setState({
      error: {
        phone : updatedError
      }
    });
    if(e.target.value.length < 11){
      this.setState({
        phone: e.target.value
      });
    }
  }

  handleGenderChange(e) {
      this.setState({
        genderValue: e.target.value,
      });
  }


  checkEmptyBirthdayChild() {
    let {  birth_date } = this.state;
    console.log("date",birth_date);
    if( _.isEmpty(birth_date)) {
      return true;
    } else {
      return false;
    }
  }

  handlePersonalDetails(isNext) {
    if(isNext) {
      let { first_name, phone, genderValue,email, birth_date } = this.state;
      var updatedError = {};
      let birth_date_empty = this.checkEmptyBirthdayChild();

      if(!first_name) {
        updatedError.first_name = 'Please fill in your First Name';
      } else if (!email) {
          updatedError.email = "Please Enter Email Id";
      }else if (!phone) {
        updatedError.phone = 'Please enter your Phone number';
      } else if (phone.length < 10){
        updatedError.phone = 'Phone number should be 10 digits';
      } else if (!genderValue) {
        updatedError.genderValue = 'Please select your Gender';
      }  else if ( birth_date_empty) {
        updatedError.kids_date_gender = 'Please select Birth Date';
      }
      this.setState({
        error: updatedError
      });
      console.log("error",this.state.error);
    //  console.log("ERR",updatedError);
      if(!(_.isEmpty(updatedError))) {
        return
      } else {
        this.nextStep();
      }
    }
  }

  handleBirthDate(date) {
    this.setState({ birth_date: date });
    }

  getStates() {

  }

  nextStep() {

  //  console.log(this.getStates());
    this.setState({
      step: this.state.step + 1
    })
    // console.log("syates",this.state.states);
  }

  prevStep() {
    this.setState({
      step: this.state.step - 1
    })
  }

  showStep() {
    switch (this.state.step) {
      case 1:
        return this.renderPersonalDetails();
      case 2:
        return this.renderServiceCategory();
      case 3:
        return this.renderThankYou();
    }
  }

  renderPersonalDetails(){
    const genderOptions = [
      { id: 2, label: "Male" },
      { id: 1, label: "Female" },
    ];
    return(
      <div className="">
              <form id="msform">
                <fieldset>
                  <h2 className="fs-title">Create your account</h2>
                  <FormGroup>
                    <InputGroup>
                      <InputGroup.Addon><i className="fa fa-user-o"></i></InputGroup.Addon>
                      <FormControl type="text" placeholder="Enter Your Name"
                      name="user[name]"
                      value={ this.state.first_name ? this.state.first_name : ''}
                      onChange={this.addFirstName}
                      required
                      />
                    </InputGroup>
                    <span className='errorMsg'>{this.state.error.first_name}</span>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <InputGroup.Addon><i className="fa fa-at"></i></InputGroup.Addon>
                      <FormControl type="text" placeholder="Enter Your Email"
                      name="company[email]"
                      onChange={this.addEmail}
                      value={this.state.email}
                      required
                       />
                    </InputGroup>
                    <span className='errorMsg'>{this.state.error.email}</span>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <InputGroup.Addon><i className="fa fa-mobile"></i></InputGroup.Addon>
                      <InputGroup.Addon><span>+91</span></InputGroup.Addon>
                      <FormControl type="text"
                      name="company[mobile]"
                      maxLength="10"
                      value={this.state.phone}
                      onChange={this.addPhoneNumber}
                      required
                      />
                    </InputGroup>
                    <span className='errorMsg'>{this.state.error.phone}</span>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <InputGroup.Addon><i className="fa fa-birthday-cake"></i></InputGroup.Addon>
                      <DatePicker
                       className = "date"
                       dateFormat="DD/MM/YYYY"
                       placeholdertext="Date of Birth"
                       maxDate={moment()}
                       selected={this.state.birth_date}
                       onChange={this.handleBirthDate.bind(this)}
                       />
                    </InputGroup>
                  </FormGroup>

                  <FormGroup>

                  <Radio name="groupOptions" value="Male" onChange={this.handleGenderChange}>Male</Radio>
                  <Radio name="groupOptions" value="Female" onChange={this.handleGenderChange}>Female</Radio>
                 <span className='errorMsg'>{this.state.error.genderValue}</span>
                 </FormGroup>
                  <a className="submitReg-btn btn" onClick={this.handlePersonalDetails}>
                    <span className='displayInline'>Next</span>
                 </a>
                </fieldset>
              </form>
      </div>
    )
  }

  handleChange = (selectedOption) => {

      this.setState({selectedState : selectedOption});
      fetchJsonp('https://battuta.medunes.net/api/city/in/search/?region=' + selectedOption.value + '&key=94c9e2a436810559a857776bb70ec849')
      .then((response) => {
      return response.json();
      }).then((json) => {
      console.log('Cities',json);
      let temp = [];
      json.forEach(function(value){
      temp.push({'value' : value.city, 'label' : value.city })
      })
      this.setState({cities : temp});
      });
      }

  changeValue(e){
      console.log("e",e.target.value);
      this.setState({
        currentValue : e.target.value
      })
  }

  handleCityChange = (selectedOption) => {
   this.setState({selectedCity : selectedOption});
  }
  handleStateChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Selected: ${selectedOption.label}`);
  }

  handleChecked(e){
    console.log("e",e.target.value);
    if(e.target.value == "on"){
        this.setState({
          isdisabled :!this.state.isdisabled
        })
        console.log("if");}
    // }else if (e.target.value == "off"){
    //   console.log("else");
    //   $('button').prop('disabled', true);
    // }
  }

  renderServiceCategory(){
    const { selectedState, selectedCity } = this.state;
    let options = this.state.states
    const value = selectedState && selectedState.value;
    const value1 = selectedCity && selectedCity.value;
    return(
      <div className="">
               <form id="msform">
                 <fieldset>
                   <h3 className="fs-subtitle">Tell us more about you</h3>
                   <FormGroup className="text-left">
                     <InputGroup className="slider-span">
                       <label>Salary</label>
                        <ReactSliderNativeBootstrap
                        value={this.state.currentValue}
                        handleChange={this.changeValue}
                        step={this.state.salary_step}
                        max={this.state.max_value}
                        min={this.state.min_value}
                        disabled="abled"
                         />
                     </InputGroup>
                     <label className="value-label">{this.state.currentValue}</label>
                   </FormGroup>
                   <FormGroup>
                   <label>Select State</label>
                   <Select
                    name="form-field-name"
                    value={value}
                    onChange={this.handleChange}
                    options={this.state.states}
                    />
                    </FormGroup>
                    <FormGroup>
                    <label>Select City</label>
                    <Select
                    name="form-field-name1"
                    value={value1}
                    onChange={this.handleCityChange}
                    options={this.state.cities}
                    />
                    </FormGroup>
                   <FormGroup>
                     <div className="Checkbox-label clearfix">
                       <Checkbox onChange={this.handleChecked.bind(this)}>
                            I agree to the Terms and Conditions
                        </Checkbox>
                     </div>

                   </FormGroup>
                   <FormGroup>
                    <input type="button" name="Submit" className={this.state.isdisabled ? "inactive" : "Submit"}  value="Submit" onClick={this.submitRegistrationDetails.bind(this)} disabled={this.state.isdisabled}/>
                    </FormGroup>
                 </fieldset>
               </form>
       </div>
    )
  }

  setComponentState = (stateData) => {
    this.setState(stateData);
  }

  submitRegistrationDetails() {

      console.log("hi");
      let { first_name,phone,genderValue,email, birth_date,salary,state,city,currentValue,selectedState,selectedCity} = this.state;

      // let newGender = _.omit(genderValue, ['label']);
      let user = {};
      user.first_name = first_name;
      user.phone = phone;
      user.gender = genderValue;
      user.email = email;
      user.birth_date = birth_date;
      user.salary = currentValue;
      user.selectedState = selectedState.value;
      user.selectedCity = selectedCity.value;
      // console.log("user",user);
      let usrs = reactLocalStorage.getObject('users');
      usrs.users.push(user);
      reactLocalStorage.setObject('users', usrs);
      console.log(reactLocalStorage.getObject('users'));
      if(user){
        this.nextStep();
      }

  }

  renderThankYou(){
    return(
      <div className="">
              <form id="msform">
                <fieldset>
                  <img src={Tick} className="text-center" className="img-responsive tick" />
                  <h2 className="success">You have successfully signed up!!!</h2>

                </fieldset>
              </form>
      </div>
    )
  }


  render() {
      let currentStep = this.state.step;
      const steps = [
        { name:  'About You', value: 1 },
        { name: 'Interests', value: 2 }
      ];

    return (
      <div className="signup__container container">
            <div className="row">
              <div className="col-md-6 col-md-offset-3">
                  <img src={Anime} className="text-center" className="img-responsive logo" />
              </div>
            <div className="col-md-6 col-md-offset-3 col-xs-12">
                {this.showStep()}
            </div>
        </div>
      </div>
    );
  }
}

export default Signup;
