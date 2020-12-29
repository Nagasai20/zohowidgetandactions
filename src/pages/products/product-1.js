import React from "react";
import ReactDOM from "react-dom";
import "./product-1.css";
import { makeRequestAuth } from "../../global";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Base64 from 'react-native-base64';
import config from '../../../config'


import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "reactstrap";
import NativeSelect from "@material-ui/core/NativeSelect";
import ImageLoader from "./ImageLoader";

// import  {Row, Col, Modal} from "reactstrap";
// import 'bootstrap/dist/css/bootstrap.css';

const DEFAULT_TEMPLATE = {
  image_id: 1,
  heading: "You have received Plum E-Gift Card. Congratulations!",
  subject: "You have been rewarded!",
  album_name: "Default",
  logo:
    "https://res.cloudinary.com/dyyjph6kx/image/upload/v1502969304/webui/eng/icons/favicon-96x96.png",
  image_url:
    "http://xoxoday-testing.s3.amazonaws.com/store/template/default/e-gift-card-default.jpg",
  company_id: "",
};
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Contact extends React.Component {
  state = {
    step: 1,
    points_name: "",
    points_email: "",
    points_value: "",
    subject: "",
    description: "",
    BannerImage: "",
    sendVoucher: false,
    error_points_name: false,
    error_points_email: false,
    error_points_value: false,
    error_selected_campaign: false,
    campaignList: [],
    selectedCampaign: "",
    selectedCampaignId: 0,
    DefaultCards: [],
    user_details: {},
    showModal: false,
    imageUrl: "",
    imageName: " ",
    imageId: "",
    balance: 0,
    loader: false,
    token_error: false,
    token_desc: ''

  };

  redirectToEditCampaign = () => {

    console.log (this.state.selectedCampaignId , "selectedCampaignId 76" )
      
    console.log(this.state.selectedCampaign, "selectedCampaign 77 ")

    console.log(this.state.token + 'token 80')


    let siteId = '&id='+this.state.selectedCampaign[0].template_id+'&name='+ this.state.selectedCampaign[0].label

    console.log(siteId + 'siteId' )

    let encryptSiteId = Base64.encode(siteId)
    
     fetch(config.auth_url+'/v1/oauth/sso/stores/user', {
        "method": "POST",
           "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+ this.state.token
            },
          "body": JSON.stringify({
            "landing_page_custom": "/admin/campaign/?"+ encryptSiteId
          })
        })
        .then(response => response.json())
        .then(response => {
              console.log("edit response",response)
               window.location.href(config.auth_url+"/v1/oauth/redirect/stores/"+response.data.ssoToken);
        })
        .catch(err => {
          console.log(err,"error");
        });
} 


  validateTokenValue = (response) => {

    if (response && response.error){
      this.setState({
        token_error: true,
        token_desc: response.error_description
      })
    return;
    }else{
      this.setState({
        token:response.access_token
      })
    }

      

  }

  getCampaignResponse = (data) => {

    if (data && data.error) {
      this.setState({
        token_error: true,
        token_desc: data.error_description
      })
      return;
    }

    if(data && data.data){
      var campaignList = []
      console.log('lis print',data.data )
      campaignList = data.data.fetchSite.data.map((item) => {
        return {
          label: item.name,
          value: item.id,
          template_id: item.template_id,
        };
      });
    }
    

    this.setState({
      campaignList: campaignList
    })

  }

  getAlbumResponse= (data) => {

    if (data && data.error) {
      this.setState({
        token_error: true,
        token_desc: data.error_description
      })
      return;
    }

  if(data && data.data){
    var Defaultcards = []
    console.log('fes print',data.data )

   const  Default_card_new = data.data.fetchAlbumList.data
    Defaultcards = data.data.fetchAlbumList.data.map((item) => {
      return {
        imageUrl: item.image_url,
        imageId: item.image_id,
        imageName: item.album_name,
      };
    });
  }
    

    this.setState({
      Defaultcards: Defaultcards
    })


  }

  getuserRespDetails = (data) => {

    if (data && data.error) {
      this.setState({
        token_error: true,
        token_desc: data.error_description
      })
      return;
    }

    this.setState({
      user_details: data.data.fetchUserDetails
    })


  }

  getBalance = (data) =>{

    if (data && data.error) {
      this.setState({
        token_error: true,
        token_desc: data.error_description
      })
      return;
    }

    this.setState({
      balance: data.data.getVoucherBalance.data.balance,
      currencyCode:
        data.data.getVoucherBalance.data.formatted["currencyCode"],
      currencyValue:
         data.data.getVoucherBalance.data.formatted["currencyValue"],
    })

  }

  getTempDetails = (data,Defaultcards) =>{

    console.log('def cards' + Defaultcards)

    console.log(data.data.getTemplateDetails.data.album_img_id +'subject')

    if(data && data.data){
      console.log("i am 1 ")
      this.setState({
        subject: data.data.getTemplateDetails.data.subject,
        description: data.data.getTemplateDetails.data.heading,
        image_selected: data.data.getTemplateDetails.data.logo,
        temp_album_img_id: data.data.getTemplateDetails.data.album_img_id
      })
      console.log("i am 2 ")

     // console.log(Default_card_new,"Default_card_new")
      //const DefaultCards =  Default_card_new ? Default_card_new : [];

     

      if (Defaultcards && Defaultcards.length) {
        console.log("i am 3")
        
      let temp_album_img_id = data.data.getTemplateDetails.data.album_img_id ? data.data.getTemplateDetails.data.album_img_id : 0;

      console.log(temp_album_img_id,"temp_album_img_id 239")



      let obj = [];
      obj = Defaultcards.filter(
        (item) => item.album_id == temp_album_img_id
      );

      console.log(obj,"objj 246")

      let geturl = obj[0].imageUrl;
      let image_id_new = obj[0].imageId;
      console.log(geturl, image_id_new,"geturl............");
      this.setState({
        image_id: image_id_new,
        image_selected: geturl,
      })
    }
  }

  }

  getTemplateDetailsBased = () =>{
    var selfthis = this

    console.log(selfthis,"selfthis 274")

    var DefCards = selfthis.state.Defaultcards
    

    console.log(this.state.selectedCampaign + 'this.state.selectedCampaign.id')

    

    const dynamic_map ={
     "user_token": this.state.token,
     "template_id": this.state.selectedCampaign[0].template_id
  
    }

    console.log(dynamic_map,'dynamic_map')

    console.log(this.state.token,'user_token')



    ZOHO.CRM.CONNECTOR.invokeAPI("plumrewardingtest.rewardthroughplum.getCampaignheaderDetails",dynamic_map)
    .then(function (response){

      console.log( response + 'logo response')
      selfthis.getTempDetails(JSON.parse(response['response']),DefCards)
    })


  } 


  submitXoxoVoucher = () =>{




    const send_voucher_map_data ={
      "user_token": this.state.token,
      "album_img_id": this.state.image_id ? this.state.image_id: DEFAULT_TEMPLATE.image_id,
      "heading": this.state.description  ? this.state.description  : DEFAULT_TEMPLATE.heading,
      "logo": this.state.image_selected  ? this.state.image_selected : DEFAULT_TEMPLATE.logo,
      "subject": this.state.subject  ? this.state.subject : DEFAULT_TEMPLATE.subject,
      "is_bulk": false,
        "schedular_batch_id": "",
        "schedule_type": 1,
        "site_id": this.state.selectedCampaign[0].template_id,
         "user_message": "",
            "to_name": this.state.points_name,
            "denomination": this.state.points_value,
            "notes": "",
            "quantity": 1,
            "to_email": this.state.points_email,
            "to_phone_code": "",
            "to_phone_number": "",
   
     }




    // let mail_details = {

    //   album_img_id: this.state.image_id ? this.state.image_id: DEFAULT_TEMPLATE.image_id,
    //   heading: this.state.description  ? this.state.description  : DEFAULT_TEMPLATE.heading,
    //   logo: this.state.image_selected  ? this.state.image_selected : DEFAULT_TEMPLATE.logo,
    //   subject: this.state.subject  ? this.state.subject : DEFAULT_TEMPLATE.subject,
    
    //   }

    

    // const send_voucher_map_data ={
    //   "create_send_input": {
    //     "is_bulk": false,
    //     "mail_details": mail_details,
    //     "schedular_batch_id": "",
    //     "schedule_type": 1,
    //     "site_id": this.state.selectedCampaign[0].template_id,
    //     "vouchers": [
    //       {
    //         "user_message": "",
    //         "to_name": this.state.points_name,
    //         "denomination": this.state.points_value,
    //         "notes": "",
    //         "quantity": 1,
    //         "to_email": this.state.points_email,
    //         "to_phone_code": "",
    //         "to_phone_number": "",
    //       },
    //     ],
    //   },

    // }

    console.log(send_voucher_map_data, 'send_voucher_map_data')

    
    


    ZOHO.CRM.CONNECTOR.invokeAPI("plumrewardingtest.rewardthroughplum.getCampaignheaderDetails", send_voucher_map_data)
    .then(function (response){

      console.log( JSON.parse(response['response']) , 'xoxo response')
     
    })


  } 






  componentDidMount = () => {
    var self = this
    ZOHO.embeddedApp.on("PageLoad", function (data) {
      ZOHO.CRM.CONFIG.getCurrentUser()
        .then(function (data) {
          var usersData = '';
          usersData = data.users && data.users.length ? data.users[0] : []

          ZOHO.CRM.CONNECTOR.invokeAPI("plumrewardingtest.rewardthroughplum.getusertoken", { email: JSON.stringify(usersData.email) })
            .then(function (response) {
              console.log("token details ", response)

              var tokenValue = ''

              tokenValue = JSON.parse(response['response']).access_token

              console.log(tokenValue)

              self.validateTokenValue(JSON.parse(response['response']))


              ZOHO.CRM.CONNECTOR.invokeAPI("plumrewardingtest.rewardthroughplum.getuserdetails", { user_token:  tokenValue })

              .then(function (response) {

                console.log("user details ", response)

                //console.log('loggined',JSON.parse(response['response']).data.fetchUserDetails.email)



                //loggined_email = JSON.parse(response['response']).data.fetchUserDetails.email

                self.getuserRespDetails(JSON.parse(response['response']))

              })

              ZOHO.CRM.CONNECTOR.invokeAPI("plumrewardingtest.rewardthroughplum.getdefaultalbumlist",{ user_token: tokenValue })

                .then(function (response) {

                  console.log("album details ", response)

                  //console.log('loggined',JSON.parse(response['response']).data.fetchUserDetails.email)



                  //loggined_email = JSON.parse(response['response']).data.fetchUserDetails.email

                  self.getAlbumResponse(JSON.parse(response['response']))

                })

              ZOHO.CRM.CONNECTOR.invokeAPI("plumrewardingtest.rewardthroughplum.getXoxoCodeBalance", {user_token: tokenValue })

              .then(function (response) {

                console.log("user details ", response)

                //console.log('loggined',JSON.parse(response['response']).data.fetchUserDetails.email)



                //loggined_email = JSON.parse(response['response']).data.fetchUserDetails.email

                self.getBalance(JSON.parse(response['response']))

              })




              ZOHO.CRM.CONNECTOR.invokeAPI("plumrewardingtest.rewardthroughplum.getcampaignslist", { user_token:  tokenValue })

                .then(function (response) {

                  console.log("getcampaigns response", response)



                  self.getCampaignResponse(JSON.parse(response['response']))

                  //self.getRewardsList(rewardsList)





                })


            

                






            })
        })





    })



    ZOHO.embeddedApp.init();



  }
  

  handleClickOpen = () => {
    this.setState({ showModal: true });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  handleSubmit = () => {
    const { selectedImage } = this.state;
    if (!selectedImage) {
      // NotificationManager.error('Please Select An Image.', 'Error');
    } else {
      // this.props.callbackMethod ? this.props.callbackMethod() : null
      this.props.callbackMethod();
      this.props.updateState({ selectedTemplate: selectedImage });
      this.setState({ showModal: false });
    }
  };

  handleChange = (event) => {
    this.setState({
      [name]: event.target.value,
      error_selected_campaign: false,
    });
    let filterCampaign = "";

    this.state.campaignList && this.state.campaignList.length
      ? (filterCampaign = this.state.campaignList.filter(
        (item) => item.label == event.target.value
      ))
      : null;
    // selected_campaign_label
    console.log(event.target.value + " filter campaign ");

    this.setState({
      selectedCampaign: filterCampaign,
    });
  };

 

  // getTemplateSub() {
  //   const query = "storesAdmin.mutation.get_template_details";
  //   const request_data = {
  //     query: query,
  //     tag: "storeAdmin",
  //     variables: {
  //       add_data: {
  //         template_id: this.state.selectedCampaign
  //           ? this.state.selectedCampaign.id
  //           : 0,
  //       },
  //     },
  //   };
  //   console.log(request_data);
  //   makeRequestAuth(
  //     request_data,
  //     function (response) {
  //       if (
  //         response &&
  //         response.data &&
  //         response.data.getTemplateDetails &&
  //         !response.data.getTemplateDetails.error
  //       ) {
  //         let sub = response.data.getTemplateDetails.data;
  //         if (sub) {
  //           this.setState({
  //             receipt_subject: sub.subject,
  //             temp_heading: sub.heading,
  //             temp_message: sub.message,
  //             primaryLogo: sub.logo,
  //             temp_album_img_id: sub.album_img_id,
  //           });
  //           const DefaultCards =
  //             this.state &&
  //               this.state.DefaultCards &&
  //               this.state.DefaultCards.length
  //               ? this.state.DefaultCards
  //               : [];

  //           if (DefaultCards && DefaultCards.length) {
  //             let temp_album_img_id = sub.album_img_id ? sub.album_img_id : 0;

  //             let obj = [];
  //             obj = DefaultCards.filter(
  //               (item) => item.image_id === temp_album_img_id
  //             );

  //             let geturl = obj[0].image_url;
  //             let image_id_new = obj[0].image_id;
  //             console.log(geturl, image_id_new);
  //             this.setState({
  //               image_id: image_id_new,
  //               coverImage: geturl,
  //             });
  //           }
  //         }
  //       }
  //     }.bind(this)
  //   );
  // }

  // getcurrencyvalues = () => {
  //   const query = "storesAdmin.query.voucher_balance";
  //   const request_data = {
  //     query: query,
  //     tag: "storeAdmin",
  //   };
  //   makeRequestAuth(
  //     request_data,
  //     function (response) {
  //       if (
  //         response &&
  //         response.data &&
  //         response.data.getVoucherBalance.error === false
  //       ) {
  //         this.setState({
  //           balance: response.data.getVoucherBalance.data.balance,
  //           currencyCode:
  //             response.data.getVoucherBalance.data.formatted["currencyCode"],
  //           currencyValue:
  //             response.data.getVoucherBalance.data.formatted["currencyValue"],
  //         });
  //         // let data ={
  //         //          currencySymbol : response.getVoucherBalance.data.formatted["currencySymbol"],
  //         //          userBalance : response.getVoucherBalance.data.formatted["balance"],
  //         //          companyBalance : response.getVoucherBalance.data.formatted["companyBalance"],
  //         //          currencyValue : response.getVoucherBalance.data.formatted["currencyValue"],
  //         //          currencyCode :response.getVoucherBalance.data.formatted["currencyCode"]

  //         //      }
  //       }
  //     }.bind(this)
  //   );
  // };

  

  imageSelected = (event) => {
    //  console.log(event && event.target && event.target.currentSrc)
    this.setState({
      primaryLogo: event && event.target && event.target.currentSrc,
    });
  };

  

  saveTextValue = (name) => (event) => {
    if (name && event && event.target) {
      if (name == "points_name") {
        event && event.target.value && event.target.value.length <= 2
          ? this.setState({
            error_points_name: false,
          })
          : null;
      }
      if (name == "points_value") {
        event && Boolean(event.target.value)
          ? this.setState({
            error_points_value: false,
          })
          : null;
      }
      if (name == "points_email") {
        this.setState({
          error_points_email: false,
        });
      }
    }

    this.setState({
      [name]: event && event.target ? event.target.value : event,
    });
  };

  nextstep = () => {
    const { points_name, points_value, points_email } = this.state;
    let error_points_name = !Boolean(points_name);
    let error_points_email = !Boolean(points_email) || !re.test(points_email);
    let error_points_value = !Boolean(points_value);
    //let error_selected_campaign = !Boolean(selectedCampaign);
    this.setState({
      error_points_name,
      error_points_email,
      error_points_value,
    });

    if (!error_points_name && !error_points_email && !error_points_value) {
      this.setState({
        step: 2,
      });
      this.getTemplateDetailsBased()
    }
  };

  stepone = () => {
    this.setState({ step: 1 });
  };

  sendVoucher = () => {
    this.setState({
      loader: true,
    });

    let mail_details = {
      album_img_id: DEFAULT_TEMPLATE.image_id,
      heading: this.state.subject
        ? this.state.subject
        : DEFAULT_TEMPLATE.heading,
      logo: this.state.image_selected
        ? this.state.image_selected
        : DEFAULT_TEMPLATE.logo,
      subject: this.state.description
        ? this.state.subject
        : DEFAULT_TEMPLATE.subject,
    };

    const request_data = {
      query: "storesAdmin.mutation.createSendVoucher",
      tag: "storeAdmin",
      variables: {
        create_send_input: {
          is_bulk: false,
          mail_details: mail_details,
          schedular_batch_id: "",
          schedule_type: 1,
          site_id: "570",
          vouchers: [
            {
              user_message: this.state.description,
              to_name: this.state.points_name,
              denomination: this.state.points_value,
              notes: "",
              quantity: 1,
              to_email: this.state.points_email,
              to_phone_code: "",
              to_phone_number: "",
            },
          ],
        },
      },
    };

    makeRequestAuth(
      request_data,
      function (response) {
        if (response && response.data && response.data.createSendVoucher) {
          debugger;
          console.log("xoxovoucher response", response);
          if (response.data.createSendVoucher.error == false) {
            this.setState({
              //success:true,
              step: 3,
              message: response.data.createSendVoucher.message[0],
              points_name: "",
              points_email: "",
              points_value: "",
              loader: false,
            });
            //this.props.condPages(8)
          } else if (response.data.createSendVoucher.error == true) {
            this.setState({
              loader: false,
              //submit_loader:false,
              //submit_button_disabled:true,
              message: response.data.createSendVoucher.message[0]
                ? response.data.createSendVoucher.message[0]
                : "something went wrong.",
            });
          }
        }
      }.bind(this)
    );
  }

  render() {

    console.log(this.state.user_details + 'render user detils')

    const {
      campaignList,
      selectedCampaign,
      selectedCampaignId,
      user_details,
    } = this.state;
    let step = this.state.step;
    if (step && step == 1) {
      var renderStep = (
        <div className="form-wrapper">
          <div style={{ textAlign: "center" }}>

          {this.state.token_error ? (
              <span style={{ color: "red", marginLeft: "14px" }}>
                {this.state.token_desc}
              </span>
            ) : (
                ""
              )}

            {this.state.user_details  && !this.state.token_error ? (
              <p style={{ marginTop: "-26px", marginRight: "-207px" }}>
                Welcome ,{" "}
                <strong style={{ color: "green" }}>
                  {" "}
                  {this.state.user_details.first_name ? this.state.user_details.first_name : this.state.user_details.email}{" "}
                </strong>
              </p>
            ) : (
                <ImageLoader />
              )}
            {this.state.balance && !this.state.token_error ? (
              <p style={{ marginRight: "-217px" }}>
                XoxoFoundsBalance: &nbsp;{" "}
                <strong style={{ color: "green" }}>
                  {this.state.currencyCode} &nbsp; {this.state.balance}{" "}
                </strong>
              </p>
            ) : (
                ""
              )}
          </div>

          <form>
            <div
              style={{
                marginLeft: "10px",
                paddingRight: "7px",
                marginright: "150px",
              }}
              className="fullName"
            >
              <label>Name*</label>
              <br />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                type="text"
                name="points_name"
                value={this.state.points_name}
                onChange={this.saveTextValue("points_name")}
                required
              />
            </div>
          </form>
          {this.state.error_points_name ? (
            <span style={{ color: "red", marginLeft: "14px" }}>
              Please enter Name
            </span>
          ) : (
              ""
            )}

          <form>
            <div
              style={{
                marginLeft: "10px",
                paddingRight: "7px",
                marginright: "150px",
              }}
              className="fullEmail"
            >
              <label> Email*</label>
              <br />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                type="text"
                value={this.state.points_email}
                onChange={this.saveTextValue("points_email")}
                name="points_email"
                required
              />
            </div>
          </form>
          {this.state.error_points_email ? (
            <span style={{ color: "red", marginLeft: "14px" }}>
              Please enter email
            </span>
          ) : (
              ""
            )}

          <form>
            <div
              style={{
                marginLeft: "10px",
                paddingRight: "7px",
                marginright: "150px",
              }}
              className="fullEmail"
            >
              <label>Enter Reward Points </label>
              <br />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                type="number"
                name="points_value"
                SelectProps={{
                  native: true,
                }}
                onChange={this.saveTextValue("points_value")}
                value={this.state.points_value}
                required
              />
            </div>
          </form>
          {this.state.error_points_value ? (
            <span style={{ color: "red", marginLeft: "14px" }}>
              Please enter points
            </span>
          ) : (
              ""
            )}

          <div
          className="form-group"
          style={{marginTop:'11px'}}
          >
           

           
            <label style={{paddingTop:'48px',marginLeft:'6px'}} >Select Campaign</label>
            <div>
            <select
              style={{width:'407px',height:'52px',borderRadius:'4px', marginLeft:'8px',marginTop:'20px'}}
              variant="outlined"
              margin="normal"
              fullWidth
              select
              value={this.state.selected_campaign_label}
              options={campaignList}
              name="campaign"
              placeholder=''
              onChange={this.handleChange}
            >
              {campaignList.map((option) => (
                <option key={option.label} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            </div>
          </div>




          <div style={{marginTop:'20px'}}className="mt-0 edit-campaign"> 
          <span style={{cursor:"pointer", paddingTop:'10px',marginLeft:'12px'}} onClick={this.redirectToEditCampaign}>Edit Campaign</span></div>

          {this.state.error_selected_campaign ? (
            <span style={{ color: "red", marginLeft: "14px" }}>
              Please Select Campaign
            </span>
          ) : (
              ""
            )}

          <div
            style={{
              marginRight: "50px",
              marginLeft: "10px",
              marginTop: "25px",
            }}
            class="custom-button"
          >

          
            <Button disabled={this.state.token_error} onClick={this.nextstep} variant="contained" color="primary">
              Next
            </Button>
          </div>
        </div>
      );
    } else if (this.state.step == 2) {
      var renderStep = (
        <div className="form-wrapper">
          {/* <form>
            <div
              style={{
                marginLeft: "10px",
                paddingRight: "53px",
                marginright: "150px",
              }}
              className="fullName"
            >
              <label>Email Receiver*</label>
              <br />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                disabled
                type="text"
                name="points_email"
                value={this.state.points_email}
                onChange={this.saveTextValue("points_name")}
                required
              />
            </div>
          </form> */}

          <form>
            <div
              style={{
                marginLeft: "10px",
                paddingRight: "26px",
                marginright: "150px",
              }}
              className="fullEmail"
            >
              <label>Enter Subject</label>
              <br />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                type="text"
                onChange={this.saveTextValue("subject")}
                value={
                  this.state.subject
                    ? this.state.subject
                    : DEFAULT_TEMPLATE.subject
                }
                name="subject"
                required
              />
            </div>
          </form>

          <form>
            <div
              style={{
                marginLeft: "10px",
                paddingRight: "26px",
                marginright: "150px",
              }}
              className="fullEmail"
            >
              <label>Enter Description</label>
              <br />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                type="text"
                name="points_value"
                SelectProps={{
                  native: true,
                }}
                onChange={this.saveTextValue("description")}
                value={
                  this.state.description
                    ? this.state.description
                    : DEFAULT_TEMPLATE.heading
                }
                required
              />
            </div>
          </form>

          <div style={{ marginLeft: "190px", marginTop: "30px" }}>
            <img
              height="170px"
              width="435px"
              style={{
                cursor: "pointer",
                marginTop: "-13px",
                marginLeft: "-215px",
              }}
              onClick={this.handleClickOpen}
              src={
                this.state.image_selected
                  ? this.state.image_selected
                  : DEFAULT_TEMPLATE.image_url
              }
            />
          </div>

          <div
            style={{
              marginRight: "50px",
              marginLeft: "10px",
              marginTop: "25px",
            }}
            class="custom-button"
          >
            <Button
              onClick={this.stepone}
              style={{
                marginRight: "50px",
                marginLeft: "10px",
                marginTop: "6px",
              }}
              variant="contained"
              color="default"
            >
              Back
            </Button>

            {this.state.loader ? (
              <ImageLoader />
            ) : (
                <Button
                  onClick={this.submitXoxoVoucher}
                  style={{ marginLeft: "74px" }}
                  variant="contained"
                  color="primary"
                >
                  Send Voucher
                </Button>
              )}
          </div>

          <Dialog
            open={this.state.showModal}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Select Image</DialogTitle>
            <Button style ={{marginTop:'-39px', marginLeft:'301px'}}onClick={this.handleClose} color="primary" autoFocus>
              Cancel
            </Button>

            <Button style ={{marginTop:'-33px', marginLeft:'463px'}}  
                  color="primary" onClick={this.handleClose} color="primary" autoFocus>
              Save
            </Button>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <div className="rewardImageIcon row mt-3">
                  <Card
                    className="voucher-card-campaign"
                    style={{
                      color: "#000000",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    <CardTitle>
                      <div className="col-sm-12 pr-0 pt-0">
                        {/* discount ?
<div className="float-right discount">
{discount}
</div> : null
*/}
                      </div>
                    </CardTitle>
                    {this.state.Defaultcards.map((item, i) => {
                      return (
                        <CardBody key={i} style={{ padding: "0.25rem" }}>
                          <img
                            style={{
                              cursor: "pointer",
                              height: "152px",
                              width: "260px",
                            }}
                            onClick={this.imageSelected}
                            value={item}
                            className=""
                            src={item.imageUrl}
                          />
                        </CardBody>
                      );
                    })}
                  </Card>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {/*<Button onClick={this.handleClose} color="primary">
Disagree
</Button>*/}
              <Button onClick={this.handleClose} color="primary" autoFocus>
                USE
              </Button>
            </DialogActions>
          </Dialog>

          {/* <div >
            <button type="button" >
              Next
            </button>
          </div> */}
        </div>
      );
    } else if (this.state.step == 3) {
      var renderStep = (
        <div className="form-wrapper">
          <form>
            <div
              style={{
                marginLeft: "10px",
                paddingRight: "53px",
                marginright: "150px",
              }}
              className="fullName"
            >
              <h2 style={{ color: "green" }}>Reward Sent Successfully.</h2>

              <Button
                onClick={this.stepone}
                style={{
                  marginRight: "50px",
                  marginLeft: "10px",
                  marginTop: "6px",
                }}
                variant="contained"
                color="default"
              >
                Home
              </Button>
            </div>
          </form>
        </div>
      );
    }

    return <div className="wrapper">{renderStep}</div>;
  }
}

ReactDOM.render(<Contact />, document.getElementById("menu"));
