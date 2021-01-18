import AsyncStorage from '@react-native-async-storage/async-storage';

const CLIENTE_STORAGE_KEY = '@erp_storage_cliente_key'
const PRODUTO_STORAGE_KEY = '@erp_storage_produto_key'
const VENDAS_STORAGE_KEY = '@erp_storage_vendas_key'
//AsyncStorage.clear().then(() => console.log('limpo'))
export const storeCliente = async (cliente: any) => {
    await store(CLIENTE_STORAGE_KEY, cliente)
}

export const readCliente = async () => {
    return read(CLIENTE_STORAGE_KEY)
}

export const storeProduto = async (produto: any) => {
    await store(PRODUTO_STORAGE_KEY, produto)
}

export const readProduto = async () => {
    return read(PRODUTO_STORAGE_KEY)
}

export const storeVendas = async (venda: any) => {
    const vendas = await readVendas() || []
    vendas.push(venda)
    await store(VENDAS_STORAGE_KEY, vendas)
}

export const overwriteVendas = async (vendas: [any]) => {
    await store(VENDAS_STORAGE_KEY, vendas)
}

export const readVendas = async () => {
    return read(VENDAS_STORAGE_KEY)
}

const store = async (key: string, data: any) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(data))
    } catch (error) {

    }
}

const read = async (key: string) => {
    try {
        const values = await AsyncStorage.getItem(key)
        return values != null ? JSON.parse(values) : null
    } catch (error) {

    }
}