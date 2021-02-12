//@ts-nocheck
import api from './api';
import {
    storeCliente,
    storeProduto,
    readVendas,
    overwriteVendas
} from '../storage';

export function removeVenda(venda) {
    readVendas().then(vendas => {
        const restantes = vendas.filter(element => element.uuid != venda.uuid)
        overwriteVendas(restantes).then(() => console.log('venda removida ', venda.uuid))
    })
}

export default async (callback: Function) => {
    callback('Sincronizando clientes...')

    api.get('cliente').then(resultado => {

        storeCliente(resultado.data).then(() => {
            callback('Sincronizando produtos...')

            api.get('produto').then(resultado => {

                storeProduto(resultado.data).then(() => {
                    callback('Carregando vendas ...')

                    readVendas().then(vendas => {
                        if (!vendas || vendas == undefined) return

                        let total = vendas.length
                        if (total == 0) {
                            callback('não há nada pendente')
                            return
                        }

                        vendas.map(venda => ({
                            mobile: true,
                            cliente: venda.cliente?.id,
                            valorRecebido: venda.valorRecebido,
                            itens: venda.itens.map(produto => ({
                                valorUnitario: produto.valorVenda,
                                quantidade: produto.quantidade,
                                produtoId: produto.id
                            })),
                            uuid: venda.uuid
                          })).forEach(venda => {
                            api.post('venda', venda).then(async () => {
                                total--
                                console.log('venda sincronizada')
                                await removeVenda(venda)

                                if (total == 0) {
                                    callback('concluido')
                                }
                            }).catch(() => {
                                console.log('ocorreu um erro ao sincronizar a venda')
                                callback('algumas vendas não foram sincronizadas')
                            })


                          })
                    })
                })
            })
        })
    })
}