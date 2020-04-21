//  API id used by the frontend to interact with the backend
const apiId = 'q55umn7b96'
export const apiEndpoint = `https://${apiId}.execute-api.us-west-2.amazonaws.com/dev`

export const authConfig = {
  //Auth0 application values
  domain: 'manoj-udacity.auth0.com',            // Auth0 domain
  clientId: '61MxgnjcA1pqCSlFeYbAnSS0hleMtIUO',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
