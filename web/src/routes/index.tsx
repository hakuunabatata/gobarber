import React from 'react'
import { Switch } from 'react-router-dom'
import Route from './routes'

import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" component={SignUp} />
    <Route path="/forgot_password" component={ForgotPassword} />
    <Route path="/reset_password" component={ResetPassword} />
    <Route path="/dashboard" component={Dashboard} isPrivate={true} />
    <Route path="/profile" component={Profile} isPrivate={true} />
  </Switch>
)

export default Routes
