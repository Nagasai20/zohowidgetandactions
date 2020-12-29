// if(!getCookie('pltfm')) setCookie('pltfm','4')
import config from '../config';

const auth_url = config['auth_url'];

export const uploadRequest=(data,callback,url) =>{

    // componentWillMount = () => {
    //     ZOHO.embeddedApp.on("PageLoad", function(data) {
    //     ZOHO.CRM.CONFIG.getCurrentUser()
    //    .then(function(data){ 
    //       var usersData='';
    //       usersData = data.users && data.users.length ? data.users[0] : []
    //       console.log(usersData.email  + 'email .....')
    //       ZOHO.CRM.CONNECTOR.invokeAPI("plumrewardingtest.rewardthroughplum.getusertoken",{email:JSON.stringify(usersData.email)}) 
    //       .then(function(response){ 
    //         tokenValue = JSON.parse(response['response']).access_token
    //         console.log(tokenValue +'token data....')
    //       })
   


    //     })
      

    //   })

     
 
      
     
    //    ZOHO.embeddedApp.init();
    
    // }

    if(!url) url = auth_url+'/api/graph'

    if(!callback){
        callback = function(response){
            // applog(event,response)
        }
    }

    if(url.indexOf(auth_url) == -1) url = auth_url+url //`${auth_url}${url}`
    try{

        var request_data = JSON.parse(data.get('request_data'))

        if(request_data && request_data.query){ //for mod security
            request_data.query = request_data.query.replace(new RegExp('\n', 'g'), '')
        }
        
        var tag = request_data.tag
        if(tag) url = url+'/'+tag//`${url}/${tag}`

        data.set('request_data',JSON.stringify(request_data))

    }catch(e){
        console.log('Exception',e)
        // applog('Exception',e)
    } 
   
    fetch(url, {
        method: 'POST',
        body: data,
        credentials:'include',
        headers:{
            pltfm:4,
            lng:getCookie('lng') ? getCookie('lng')
 : 'en'
        }
    }).then(function(res){
        return res.json()
    })
    .catch(function(error){
        callback({error:1,error_msg:error})
    })
    .then(function(response){
        callback(response)
    })
}

export const makeRequestAuth = (data, callback, extra_headers, url) => {
    

    // storetokenvalue =(data) =>{
    //       var tokenValuestored=''
    //          tokenValuestored = data

    // }

    

    // componentWillMount = () => {

    //     ZOHO.embeddedApp.on("PageLoad", function(data) {
     
    //         ZOHO.CRM.CONFIG.getCurrentUser()
    //               .then(function(data){ 
    //                   var usersData='';
    //                   usersData = data.users && data.users.length ? data.users[0] : []
    //                   console.log(usersData.email  + 'email .....')
    //                   ZOHO.CRM.CONNECTOR.invokeAPI("plumrewardingtest.rewardthroughplum.getusertoken",{email:JSON.stringify(usersData.email)}) 
    //                   .then(function(response){ 

    //                       this.storetokenvalue(JSON.parse(response['response']).access_token)
    //                      // tokenValue = JSON.parse(response['response']).access_token
    //                     //console.log(tokenValue +'token data....')
    //                   })
    //             })
    //         })
    //                  ZOHO.embeddedApp.init();
        
        
        
    // }

   
   
    if(!extra_headers) extra_headers = {

    }

    if(!url) {
        //debugger
        //url = auth_url+'/v1/oauth/api';
      // url ='https://x100.xoxoday.com/chef/api/graph/storeAdmin';
      // url ='https://stagingaccount.xoxoday.com/chef/v1/oauth/api'
      //url =  'http://localhost:4003/v1/oauth/api';
       url= 'https://empulsqaenv.xoxoday.com/v1/oauth/api';
    } 

    if( !data) {
        data = {}
    }
    // else
    //     data.query = eval("graphql."+data.query)

    // if(url.indexOf(auth_url) == -1) {
    //     url = auth_url+url //`${auth_url}${url}`
    // } 

    // if(data.tag) {
    //     url = url+'/'+data.tag//`${url}/${data.tag}` 
    // } 

    if(!callback){
        callback = function(response){
            //console.log(response,"response 4000")
        }
    }

   // chrome.storage.sync.get(['token'], function (result){
     //let result =  function (result) {
        // console.log(result,"response 4555555")

    //console.log('token value....', tokenValuestored ? tokenValuestored :'null')
        let headers = {
         'Content-Type': 'application/json',
         'Access-Control-Allow-Origin' : '*',
         'Authorization': 
         'Bearer '
        }
        


    if(!extra_headers) extra_headers = {}

    for (var i = 0; i < Object.keys(extra_headers).length; i++) {
        var key = Object.keys(extra_headers)[i]
        headers[key] = extra_headers[key]
    }

    if(data.query){ //for mod security
        data.query = data.query.replace(new RegExp('\n', 'g'), '')
    }


    fetch(url, {
      method: 'POST', 
      body: JSON.stringify(data), 
      headers:headers,
      credentials: 'include'
    }).then(function(res){
        return res.json()
    })
    .catch(function(error){
        callback({error:1,error_msg:error})
    })
    .then(function(response){
      
          if(response && response.error_message_id && response.success == 0){
           
             callback({success:0,error_msg:" Token error "})

         }else{
             callback(response)

         }
        
      
        }) 
  //  }
}

function getCookie(name) {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (match) return match[2]
}


