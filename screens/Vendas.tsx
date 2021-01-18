//@ts-nocheck
import * as React from 'react';
import { readProduto, readCliente, storeVendas } from '../storage';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  List,
  IconButton,
  Avatar,
  Divider,
  Card,
  Button,
  TextInput,
  Portal,
  Dialog,
  Paragraph
} from 'react-native-paper';
import { appContext } from '../context/useContext'

export default function Vendas() {
  const [step, setStep] = React.useState(1)
  const [produtos, setProdutos] = React.useState([])
  const [clientes, setClientes] = React.useState([])
  const [venda, setVenda] = React.useState({})
  const [alreadyLoad, setAlreadyLoad] = React.useState(false)
  const { dataUpdated, update } = appContext()
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const setValues = (propName, propValue) => {
    setVenda({
      ...venda,
      [propName]: propValue
    })
  }

  const escolherCliente = React.useCallback((cliente) => {
    setValues('cliente', cliente)
    setStep(3)
  }, [venda])

  const addProduto = React.useCallback((prod) => {
    const list = venda.itens || []
    function getQuantidade() {
      return prod.customizado ? prod.quantidade : 1
    }

    if (list.length) {
      const produtoJaAdicionado = list.filter(produtos => produtos.id === prod.id)

      if (produtoJaAdicionado[0]) {
        const noCarrinho = list.filter(produtos => produtos.id != prod.id)
        prod.quantidade = produtoJaAdicionado[0].quantidade + getQuantidade()
        noCarrinho.push(prod)
        setValues('itens', noCarrinho)
        return
      }
    }
    prod.quantidade = getQuantidade()
    list.push(prod)
    setValues('itens', list)
  }, [venda])

  const onLongPressButton = React.useCallback((prod) => {
    setValues('produtoSelecionado', prod)
    showDialog()
  }, [])

  const plusProduto = React.useCallback((prod) => {
    prod.quantidade++
    const carrinho = venda.itens.filter(produto => produto.id != prod.id)
    carrinho.push(prod)
    setValues('itens', carrinho)
  }, [venda])

  const minusProduto = React.useCallback((prod) => {
    prod.quantidade--
    const carrinho = venda.itens.filter(produto => produto.id != prod.id)
    if (prod.quantidade <= 0) {
      setValues('itens', carrinho)
      return
    }
    carrinho.push(prod)
    setValues('itens', carrinho)
  }, [venda])

  const doVenda = React.useCallback(() => {
    const vendaCopy = venda
    vendaCopy.uuid = Math.random()
    vendaCopy.valorRecebido = venda.valorRecebido || totalVenda
    storeVendas(vendaCopy).then(() => {
      setStep(1)
      setVenda({})
      update()
    })
  }, [venda])

  const inserirCustomProduto = React.useCallback(() => {
    const produto = venda.produtoSelecionado
    produto.quantidade = venda.quantidadeAlterada
    produto.customizado = true
    addProduto(produto)
    hideDialog()
  }, [venda])

  const totalVenda = React.useMemo(() => {
    if (venda.itens) {
      return venda.itens.reduce((sum, item) => sum + (item.quantidade * item.valorVenda), 0)
    }

    return 0
  }, [venda])

  React.useEffect(() => {
    readProduto().then(values => {
      setProdutos(values || [])
      setAlreadyLoad(true)
    })
  }, [alreadyLoad, dataUpdated])

  React.useEffect(() => {
    readCliente().then(values => setClientes(values || []))
  }, [alreadyLoad, dataUpdated])

  if (alreadyLoad && produtos.length === 0) {
    setAlreadyLoad(false)
  }

  if (step === 1) {
    return (
      <ScrollView style={styles.container}>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Alterar quantidade do Produto</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Quantidade"
                keyboardType="numeric"
                value={venda.quantidadeAlterada}
                onChangeText={val => setValues('quantidadeAlterada', val)}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={inserirCustomProduto}>Inserir</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <List.Section>
          <List.Subheader onPress={() => setStep(2)}>Selecionar Cliente</List.Subheader>
          <Divider />
          <List.Subheader>Produtos</List.Subheader>
          {produtos.map(prod => (
            <List.Item
              title={`R$${prod.valorVenda} - ${prod.nome}`}
              key={prod.id}
              onLongPress={() => onLongPressButton(prod)}
              onPress={() => addProduto(prod)}
              left={props => <List.Icon {...props} icon="folder" />}
              right={props => <List.Icon {...props} icon="plus" />}
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
              onPress={() => escolherCliente(cliente)}
              left={props => <List.Icon {...props} icon="account-plus-outline" />}
            />
          ))}
        </List.Section>
        <Divider />
      </ScrollView>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={`Total da venda R$: ${totalVenda}`} />
        <Card.Content>
          <Divider />
          <TextInput
            label="Valor recebido"
            keyboardType="numeric"
            value={venda.valorRecebido}
            onChangeText={val => setValues('valorRecebido', val)}
          />
          <Divider />
          <Button icon="cart" mode="contained" onPress={doVenda}>
            Vender
        </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title
          title={venda?.cliente?.nome}
          subtitle="Cliente Selecionado"
          left={(props) => <Avatar.Icon {...props} icon="account" />}
        />

      </Card>


      {venda?.itens?.map(produto => (
        <Card key={produto.id}>
          <Card.Title
            title={produto.nome}
            subtitle={`Quantidade: ${produto.quantidade} - R$: ${produto.valorVenda}`}

            right={(props) => (
              <View>
                <IconButton {...props} icon="plus-circle-outline" onPress={() => plusProduto(produto)} />
                <IconButton {...props} icon="tray-remove" onPress={() => minusProduto(produto)} />
              </View>
            )}
          />
          <Divider />
        </Card>
      ))}

    </ScrollView>
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
  card: {
    margin: 4,
  },
});
