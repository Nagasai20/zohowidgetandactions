import React from "react";
import ReactDOM from "react-dom";
import { makeRequestAuth } from "../global";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import NativeSelect from '@material-ui/core/NativeSelect';
import ImageLoader          from "./products/ImageLoader";



class Contact extends React.Component {

  constructor(props) {
    super(props);

    this.state ={
   
    users:[],
    step: 1,
    points_name: "",
    points_email: "",
    points_value: "",
    subject: "",
    description: "",
    BannerImage: "",
    sendVoucher: false,
    users:[],
    RewardAutomationsList: [],
    loggined_email:'',
    selected:'',
    token_error:false
    
    }
    
  }

  
   getRewardsList = (data) => {
   
    if(data && data.error){
      this.setState({
        token_error:true,
        token_desc:response.error_description
      })
      return;
    }

    this.setState({
      RewardAutomationsList:data.data.getRewardsList.reward_automations_list
    })

  }

  validateTokenValue = (response) =>{

    if(response && response.error)
    this.setState({
      token_error:true,
      token_desc:response.error_description
    })
      return ;
      
    

  }

  getuserDetails =(email) =>{
    this.setState({
      loggined_email: email
    })
  }


  submitReward = () =>{

   console.log(this.state.selected)

    let automated_id_selected = this.state.selected
    let loggined_email = this.state.loggined_email

    console.log('sending details', automated_id_selected,loggined_email)
  
    
    ZOHO.CRM.ACTION.setConfig (
      {
     reward_automation_id :JSON.stringify(automated_id_selected),
     logged_in_user_email : JSON.stringify(loggined_email)
    })

  }
  


   componentDidMount = () => {

           var self = this
         
            ZOHO.embeddedApp.on("PageLoad", function(data) {
            ZOHO.CRM.CONFIG.getCurrentUser()
                  .then(function(data){ 
                      var usersData='';
                      usersData = data.users && data.users.length ? data.users[0] : []
                      console.log(usersData.email  + 'email .....')
                      ZOHO.CRM.CONNECTOR.invokeAPI("plumrewardingtest.rewardthroughplum.getusertoken",{email:JSON.stringify(usersData.email)}) 
                      .then(function(response){ 
                        console.log("token details ", response)
                        var tokenValue =''
                        tokenValue = JSON.parse(response['response']).access_token

                        self.validateTokenValue(JSON.parse(response['response']))
                        
                        console.log(tokenValue)
                       
                       ZOHO.CRM.CONNECTOR.invokeAPI("plumrewardingtest.rewardthroughplum.getrewardautomations",{user_token:tokenValue}) 
                        .then(function(response){
                          console.log("getrewardautomations", response)

                          //var rewardsList = []
                          //rewardsList = JSON.parse(response['response']).data.getRewardsList.reward_automations_list

                          self.getRewardsList(JSON.parse(response['response']))

                          
                          


                        })
                         

                        ZOHO.CRM.CONNECTOR.invokeAPI("plumrewardingtest.rewardthroughplum.getuserdetails",{user_token: tokenValue}) 
                        .then(function(response){
                          console.log("user details ", response)

                          console.log('loggined',JSON.parse(response['response']).data.fetchUserDetails.email)

                          var loggined_email = '',

                          loggined_email = JSON.parse(response['response']).data.fetchUserDetails.email

                          self.getuserDetails(loggined_email)

                        })


                        
                        
                      })
                })
                
              
                
                

            })
         

           
                 ZOHO.embeddedApp.init();
        
        
        
    }

  
 
  

  

 

 

    handleChange = event => {

      console.log(event.target.name)
      console.log(event.target.value)

      this.setState({selected : event.target.value })
    };
  

  
  

  


      

 
        

  render() {


    var { RewardAutomationsList } = this.state;


    
   
    
      var renderStep = (
       
          <div className="form-wrapper">
        

            {/* <div style={{ textAlign: "center" }}>
            {this.state.user_details.first_name  ?  <p style={{marginRight:'-207px'}}>Welcome , <strong style={{color:'green'}}> {this.state.user_details.first_name} </strong></p> : <ImageLoader />}
             {this.state.balance ?  <p style={{marginRight:'-217px'}}>XoxoFoundsBalance: &nbsp; <strong  style={{color:'green'}} >{this.state.currencyCode} &nbsp; {this.state.balance} </strong></p> :''}
            </div> */}
          
          <form
            style={{
              maxWidth: "535px",
              marginTop: "23px",
              marginLeft: "10px",
            }}
          >
            <label>Select Reward Automation</label>
            <NativeSelect
              variant="outlined"
              margin="normal"
              fullWidth
              select
              value={this.state.selected}
              options={RewardAutomationsList}
              name="selected"
              onChange={this.handleChange}
            >
              {RewardAutomationsList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </NativeSelect>
          </form>
       

          <div
            style={{
              marginRight: "50px",
              marginLeft: "10px",
              marginTop: "25px",
            }}
            class="custom-button"
          >
            <Button  disabled ={this.state.token_error} onClick={this.submitReward} variant="contained" color="primary">
              Submit
            </Button>

            {this.state.token_error ? this.state.token_desc : null}


          </div>
        </div>
      );
    

    return <div className="wrapper">{renderStep}</div>;
  }
}

ReactDOM.render(<Contact />, document.getElementById("menu"));
