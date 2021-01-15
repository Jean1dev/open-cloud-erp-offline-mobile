import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import { Button, } from 'react-native-paper';
import api from '../service/api';
import { storeCliente, storeProduto } from '../storage';

export default function Home() {
  const [text, setText] = React.useState('Sincronizar')

  const sincronizar = React.useCallback(() => {
    setText('Sincronizando clientes...')
    api.get('cliente').then(async (result) => {
      await storeCliente(result.data)

      setText('Sincronizando produtos...')

      api.get('produto').then(async (result) => {
        await storeProduto(result.data)
        setText('Concluido')
      })
    })
  }, [])

  return (
    <View style={styles.container}>
      <Button icon="loading" mode="contained" onPress={sincronizar}>
        {text}
      </Button> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
