/** @type { import("drizzle-kit").Config} */
export default{
    schema:"./utils/schema.js",
    dialect:'postgresql',
    dbCredentials:{
        url: 'postgresql://testapp_owner:e1souvchdfX4@ep-twilight-brook-a52sanoh.us-east-2.aws.neon.tech/mock-ai?sslmode=require'
    }
}