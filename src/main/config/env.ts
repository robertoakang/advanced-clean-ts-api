export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '',
    clientTestToken: process.env.FB_ACCESS_TOKEN ?? ''
  },
  port: process.env.PORT ?? 6969,
  jwtSecret: process.env.JWT_SECRET ?? ''
}
