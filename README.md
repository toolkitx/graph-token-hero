## Graph Token Hero

A light weight toolkit to help you obtain Graph token with specified permission.


### Prerequisite

Before using this toolkit, follow the instructions:
1. [Register your application](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-integrating-applications) on the Azure portal.
2. Make sure to enable the [OAuth 2.0 implicit flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v1-oauth2-implicit-grant-flow) by setting the property `oauth2AllowImplicitFlow` to true by editing your application manifest on the portal. Implicit flow is used by ADAL JS to get tokens.
3. Add Redirect URI `http://graph-token-hero.toolkitx.net` to the app your created in step 1.


### Usage

1. Enter your client id and click `Request Token`.
2. Enter your credentials, then you will be redirected back to home page, please wait a few second while obtaining token from AAD. 

