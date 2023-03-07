import React, { useEffect, useState } from 'react';
import { VStack, Text, HStack, useTheme, ScrollView} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import { Header } from '../components/Header';
import { ORderProps } from '../components/Order';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormat';
import { Loading } from '../components/Loading';
import { CircleWavyCheck, Clipboard, DesktopTower, Hourglass } from 'phosphor-react-native'
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';

type RouteParams = {
  orderId:string;
}

type OrderDetails = ORderProps & {
  description: string;
  solution?:string;
  closed: string
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true)
  const [solution, setSolution] = useState('')
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails)

  const navigation = useNavigation()

  const {colors} = useTheme()

  const route = useRoute()
  const { orderId } = route.params as RouteParams;
  
  function handleOrderClose() {
    if (!solution) {
      return Alert.alert('Solicitação', 'Informe a solução para encerrar a solicitação')
    }

    firestore() 
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .update({
      status: 'closed',
      solution,
      closed_at: firestore.FieldValue.serverTimestamp()
    })
    .then(()=> {
      navigation.goBack()
      return Alert.alert('Solicitação', 'Solicitação Encerrada')
    })
    .catch((error) => {
      console.log(error)
    })
  } 

  useEffect(()=> {
    firestore()
    .collection<OrderFirestoreDTO>('orders')
    .doc(orderId)
    .get()
    .then((doc) => {
      const {patrimony, description, status, created_at, closed_at, solution} = doc.data();

      const closed = closed_at ? dateFormat(created_at) : null;
      
      setOrder({
        id: doc.id,
        patrimony,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed,
      })

      setIsLoading(false)
    }
    )
  }, [])

  if(isLoading) {
    return <Loading/>
  }

  return (

    <VStack flex={1} bg="gray.700" >
      <Header title='Solicitação' p={5}/>
      <HStack bg="gray.500" justifyContent="center" p={4}>
      {
        order.status === 'closed' ?
        <CircleWavyCheck color={colors.green[300]} size={22} />
        :
        <Hourglass color={colors.secondary[700]} size={22} />
      }
      <Text
      fontSize="sm"
      color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
      ml={2}
      textTransform="uppercase"
      >
        {order.status === 'closed' ? 'finalizado' : 'em andamento'}

      </Text>
      </HStack>
      
      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails 
          title="Equipamento"
          description={`Partrimônio: ${order.patrimony}`}
          icon={DesktopTower}
          footer={order.when}
          
        />
        <CardDetails 
          title="Descrição do problema" 
          description={order.description}
          icon={Clipboard} 
        />
        <CardDetails 
          title="Solução" 
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em: ${order.closed}`}
        >
          {
            order.status === 'open' &&
            <Input
            placeholder='Descrição da solução'
            onChangeText={setSolution}
            textAlignVertical="top"
            multiline={true}
            h={24}
          />
          }
        </CardDetails>
      </ScrollView>

      {order.status === 'open'  && 
      <Button 
        title="Encerrar Solititação"
        m={5}
        onPress={handleOrderClose}
      />
      }
    </VStack>
  );
} 