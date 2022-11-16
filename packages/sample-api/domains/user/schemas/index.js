const User = require('./User')
const UserMedia = require('./UserMedia')
const UserProfile = require('./UserProfile')
const Profile = require('./Profile')
const LoginResponse = require('./LoginResponse')
const Login = require('./Login')

module.exports = [ {
  name: 'Profile',
  persistenceName: 'profile',
  schema: Profile
}, {
  name: 'UserMedia',
  persistenceName: 'user_media',
  schema: UserMedia
}, {
  name: 'User',
  persistenceName: 'user',
  schema: User
}, {
  name: 'UserProfile',
  persistenceName: 'user_profile',
  schema: UserProfile
}, {
  name: 'Login',
  schema: Login
}, {
  name: 'LoginResponse',
  schema: LoginResponse
}]
