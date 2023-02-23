import {useState, useEffect}  from 'react' 
import {  NavigationContainer } from '@react-navigation/native'

import { SignIn } from '../Screens/SignIn'
import { AppRoutes } from './app.routes'

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { Loading } from '../components/Loading'
import { VStack } from 'native-base'


export function Routes() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<FirebaseAuthTypes.User>()

useEffect(()=>{
  const subscriber = auth()
    .onAuthStateChanged(response=> {
      setUser(response);
      setLoading(false)
    })

    return subscriber;
}, [])

  if(loading) {
    return(
      <Loading/>
    )
  }
 
  return(
    <VStack flex={1} bg="gray.600">
      <NavigationContainer>
        {user ? <AppRoutes/> : <SignIn/>}
      </NavigationContainer>
    </VStack>
  )
}