var config={}
//staging environment
// config.auth_url= "http://localhost:4003"
 // config.auth_url= 'https://stagingaccount.xoxoday.com/chef/v1/oauth/api'
 // config.clientId = '7af1d60ac3b6b0b1d440cc04190a0ec5'
 // config.clientId = '4048d4e0aa2ac22f9529e92941535f15'
 // config.client_secret = 'gZT0Ac3yo7SIjrX3J6uWgQiE8B1OSRwC4Fi9GfyK'
 // config.auth_url_login = 'https://stagingaccount.xoxoday.com/v1/oauth/authorize?client_id='
 // config.oauth_url = 'https://stagingaccount.xoxoday.com/chef/v1/oauth/token/user'
 // config.redirect_url = 'https://stagingstores.xoxoday.com/admin'
 // config.redirect_url_email = 'https://stagingstores.xoxoday.com/admin'

 //testing
 // config.redirect_url = 'https://stagingstores.xoxoday.com/admin'
 // config.redirect_url_email = 'https://s100.xoxoday.com/admin'

//QA environment
 config.redirect_url = 'https://s100.xoxoday.com/admin'
 // config.redirect_url_email = 'https://s100.xoxoday.com/admin'
 // config.auth_url= 'https://empulsqaenv.xoxoday.com:8005/chef/v1/oauth/api'
 config.auth_url= 'https://empulsqaenv.xoxoday.com:8005/chef'
 // config.auth_url1= 'https://empulsqaenv.xoxoday.com:8005/chef'
 config.clientId = 'e422b6d533c3c29e1390b01b0b7e6e68'
 config.client_secret = 'gZT0Ac3yo7SIjrX3J6uWgQiE8B1OSRwC4Fi9GfyK'
 config.auth_url_login = 'https://empulsqaenv.xoxoday.com:8005/v1/oauth/authorize?client_id='
 config.oauth_url = 'https://empulsqaenv.xoxoday.com:8005/chef/v1/oauth/token/user'

//production
 // config.redirect_url = 'https://stores.xoxoday.com/admin'
 // config.redirect_url_email = 'https://stores.xoxoday.com/admin' //no need
 // config.auth_url= 'https://accounts.xoxoday.com/chef/v1/oauth/api' //no need
 // config.auth_url= 'https://accounts.xoxoday.com/chef'
 // config.clientId = '7589b428c0cf9fc6a2cace60c8529cd7'
 // config.client_secret = 'CFE6R3KF6EM5S98C541LPPD6767UOTG9Q5AAAJKLYA5K0TL2BQ6ELDHA2IFM1234'
 // config.auth_url_login = 'https://accounts.xoxoday.com/chef/v1/oauth/authorize?client_id='
 // config.oauth_url = 'https://accounts.xoxoday.com/chef/v1/oauth/token/user'


module.exports = config
