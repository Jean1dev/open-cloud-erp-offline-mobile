//@ts-nocheck
import * as React from 'react';
import { readProduto, readCliente } from '../storage';
import { ScrollView, StyleSheet, Image, View } from 'react-native';
import { List, Text, Chip, Divider, useTheme } from 'react-native-paper';

export default function Vendas() {
  const [step, setStep] = React.useState(1)
  const [produtos, setProdutos] = React.useState([])
  const [clientes, setClientes] = React.useState([])
  const [venda, setVenda] = React.useState({})

  const setValues = (propName, propValue) => {
    setVenda({
      ...venda,
      [propName]: propValue
    })

    console.log({
      ...venda,
      [propName]: propValue
    })
  }

  const escolherCliente = React.useCallback((id) => {
    setValues('cliente', id)
    setStep(3)
  }, [venda])

  const addProduto = React.useCallback((prod) => {
    const list = venda.itens ? venda.itens : []
    prod.quantidade = 1
    list.push(prod)
    setValues('itens', list)
  }, [venda])

  React.useEffect(() => {
    readProduto().then(values => setProdutos(values))
  }, [])

  React.useEffect(() => {
    readCliente().then(values => setClientes(values))
  }, [])

  if (step === 1) {
    return (
      <ScrollView style={styles.container}>
        <List.Section>
          <List.Subheader onPress={() => setStep(2)}>Selecionar Cliente</List.Subheader>
          <Divider />
          <List.Subheader>Produtos</List.Subheader>
          {produtos.map(prod => (
            <List.Item
              title={`R$${prod.valorVenda} - ${prod.nome}`}
              key={prod.id}
              onPress={() => addProduto(prod)}
              left={props => <List.Icon {...props} icon="folder" />}
              right={props => <List.Icon {...props} icon="cart" />}
            />
          ))}
        </List.Section>
        <Divider />
      </ScrollView>
    )
  }

  if (step === 2) {
    return (
      <ScrollView style={styles.container}>
        <List.Section>
        <List.Subheader onPress={() => setStep(3)}>Fechar a Venda</List.Subheader>
          <Divider />
          <List.Subheader onPress={() => setStep(1)}>Selecionar Produtos</List.Subheader>
          <Divider />
          <List.Subheader>Clientes</List.Subheader>
          {clientes.map(cliente => (
            <List.Item
              title={cliente.nome}
              key={cliente.id}
              onPress={() => escolherCliente(cliente.id)}
              left={props => <List.Icon {...props} icon="account-plus-outline" />}
            />
          ))}
        </List.Section>
        <Divider />
      </ScrollView>
    )
  }

  return (
    <View></View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 40,
    width: 40,
    margin: 8,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
});
