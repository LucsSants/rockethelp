import { NavigationContainer } from '@react-navigation/native'

import { SignIn } from '../Screens/SignIn'
import { AppRoutes } from './app.routes'

export function Routes() {
  return(
    <NavigationContainer>
      <AppRoutes/>
    </NavigationContainer>
  )
}