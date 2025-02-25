export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    mondodb: process.env.MONGODB,
    port: process.env.PORT || 3000,
    defaultLimit: process.env.DEFAULT_LIMIT || 10
})