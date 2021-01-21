//@ts-nocheck
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import {
  Button,
  Card,
  Avatar,
  Divider
} from 'react-native-paper';
import Sincronizar from '../service/Sincronizacao';
import {
  readVendas
} from '../storage';
import { appContext } from '../context/useContext'

export default function Home() {
  const [text, setText] = React.useState('Sincronizar')
  const [totalVendasPendente, setTotalVendasPendente] = React.useState(0)
  const [vendas, setVendas] = React.useState([])
  const { dataUpdated, update } = appContext()

  React.useEffect(() => {
    readVendas().then(result => {
      if (result) {
        setVendas(result || [])
        setTotalVendasPendente(result.length)
      }
    })
  }, [dataUpdated])

  const sincronizar = React.useCallback(() => {
    Sincronizar(setText)
    setTimeout(() => {
      console.log('foi')
      update()
    }, 5000)
  }, [])

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={`${totalVendasPendente}`}
          subtitle="Vendas Pendentes a sincronização"
          left={(props) => <Avatar.Icon {...props} icon="cloud-sync-outline" />}
        />

      </Card>
      <Divider />
      <Button mode="contained" onPress={sincronizar}>
        {text}
      </Button>
      <Divider />
      {vendas.map(venda => (
        
        <Card 
          onPress={() => console.log(venda.uuid)}
          style={styles.card} 
          key={venda.uuid}>
          <Card.Title
            title={`Venda para o cliente ${venda.cliente?.nome}`}
            subtitle={`Valor total da venda ${venda.totalVenda}`}
            left={(props) => <Avatar.Icon {...props} icon="cart" />}
          />

        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
