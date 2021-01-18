//@ts-nocheck
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import {
  Button,
  ActivityIndicator,
  Colors,
  Card,
  Avatar
} from 'react-native-paper';
import Sincronizar from '../service/Sincronizacao';
import {
  readVendas
} from '../storage';
import { appContext } from '../context/useContext'

export default function Home() {
  const [text, setText] = React.useState('Sincronizar')
  const [totalVendasPendente, setTotalVendasPendente] = React.useState(0)
  const { dataUpdated, update } = appContext()

  React.useEffect(() => {
    readVendas().then(result => {
      if (result) {
        setTotalVendasPendente(result.length)
      }
    })
  }, [dataUpdated])

  const sincronizar = React.useCallback(() => {
    Sincronizar(setText)
    setTimeout(() => {
      update()
    }, 5000)
  }, [])

  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} color={Colors.bl} />
      <Card style={styles.card}>
        <Card.Title
          title={`${totalVendasPendente}`}
          subtitle="Vendas Pendentes a sincronização"
          left={(props) => <Avatar.Icon {...props} icon="cloud-sync-outline" />}
        />

      </Card>
      <Button mode="contained" onPress={sincronizar}>
        {text}
      </Button>
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
