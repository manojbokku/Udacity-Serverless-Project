import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

// import { verify, decode } from 'jsonwebtoken'
import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = ''
const cert = `-----BEGIN CERTIFICATE-----
MIIDCTCCAfGgAwIBAgIJN+N45N+gSqawMA0GCSqGSIb3DQEBCwUAMCIxIDAeBgNV
BAMTF21hbm9qLXVkYWNpdHkuYXV0aDAuY29tMB4XDTIwMDQxOTIxMjUyMloXDTMz
MTIyNzIxMjUyMlowIjEgMB4GA1UEAxMXbWFub2otdWRhY2l0eS5hdXRoMC5jb20w
ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDKeU1UlXQ2U96yJ3SGMkpu
eviuKzTwAB6YkZ4YFJOTDeUgRnex2fVDEvgVNKCx6i+WBIBnwoojh9cVGBKqpBhs
remTyMxq1HpmHPp/oaXWGbQFt6swIVJWHrNM7lNyx2L5W1ljXStT1EbWrAGSdPVz
ISsGvkLcrIacoLinIcvbpGaxsQwzQURgcbzO/752BwY+BjVxmspIqiS8sJb6H+Xs
55UC8NlFgsc8zsB5VYgRK69+IpEYFL3DtGSrTAK+vQdkxgpwe5L9drVM/woawH5X
2xVgAhuDWy3VkL52JORoaM3gHN81x02veU3kPbdbutXmoiwGBtlOiDKJvS/SRwE1
AgMBAAGjQjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFOuxBqjRbjl6ikhQ
n2eBjZhaQeHHMA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEAB0lT
p4BHmQpQskcLOCgl65+7uOxzutL/Zx8cJT8VwzYMa4yrNzZM4Utf82kzpwlO+844
BNIeLeTDvoDY81eOonE4zbV+ManYLFoR/8ht6sh0gUtwj3gwOjpbTgRPz6dENeE8
jYYAiEu7DMV4pPfiqCW3OsaBXsc++xfmJ1gQVaFZ35Vhnp9IB7MCAwJc1tXcpZbX
lxzKLTTHtH8ZI2rU31vI8t77/s+wwtjWAVZ7UNnGDtcwesvqYTBlQTBNACiNTwd3
NbYaJD8h9vDNGvmwUbLgyln/cSE2WDp2ATSVQ1ZSA0tMqIX5HE1aS5RVbBTTF8YV
UCedIAAneBFmnRDyMw==
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return  verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
