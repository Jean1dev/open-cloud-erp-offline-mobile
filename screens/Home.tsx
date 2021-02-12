//@ts-nocheck
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import {
  Button,
  Card,
  Avatar,
  Divider,
  Snackbar
} from 'react-native-paper';
import Sincronizar, { removeVenda } from '../service/Sincronizacao';
import {
  readVendas
} from '../storage';
import { appContext } from '../context/useContext'

export default function Home() {
  const [text, setText] = React.useState('Sincronizar')
  const [totalVendasPendente, setTotalVendasPendente] = React.useState(0)
  const [vendas, setVendas] = React.useState([])
  const { dataUpdated, update } = appContext()
  const [removerEssaVenda, setRemover] = React.useState({})
  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const removerVenda = () => {
    removeVenda(removerEssaVenda)
    onDismissSnackBar()
    setTimeout(() => update(), 2000)
  }

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

  const perguntaSeQuerRemoverVenda = React.useCallback((venda) => {
    console.log(venda.uuid)
    setTimeout(() => onDismissSnackBar(), 3000)
    onToggleSnackBar()
    setRemover(venda)
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
          onPress={() => perguntaSeQuerRemoverVenda(venda)}
          style={styles.card}
          key={venda.uuid}>
          <Card.Title
            title={`Venda para o cliente ${venda.cliente?.nome}`}
            subtitle={`Valor total da venda ${venda.totalVenda}`}
            right={(props) => <Avatar.Icon {...props} icon="cart" />}
          />

        </Card>
      ))}
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Sim',
          onPress: () => removerVenda()
        }}>
        Remover essa venda.
      </Snackbar>
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
