const express = require('express');
const bodyParser = require('body-parser')
const server = express();
const db = require('./queries')
const port = 3001;

//Utilizar formato JSON
server.use(bodyParser.json())
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

/***   MIDDLEWARE   ***/
server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.time('Request');
    console.log(`Método: ${req.method}; URL: ${req.url};`);
    next();
    console.log('Finalizou');
    console.timeEnd('Request'); 
});

/***   HOME - STATUS API   ***/
server.get('/', (request, response) => {
    response.json({ info: 'Servidor Online' })
})

/***   PRODUTOS e SERVIÇOS   ***/
server.post('/produtos/list', db.getProdutos);
server.post('/produtos', checkCamposProdutos, db.createProduto);
server.put('/produtos/:id', checkCamposProdutos, db.updateProduto);
server.delete('/produtos/:id', db.deleteProduto);

/***   PEDIDOS   ***/
server.post('/pedidos/list', db.getPedidos);
server.post('/pedidos', db.createPedido);
server.put('/pedidos/:id', db.updatePedido);
server.delete('/produtos/:id', db.deletePedido);

/***   ITENS PEDIDOS   ***/
server.get('/item/:id', db.getItensPedidosById);
server.post('/item', checkCamposItem, db.createItemPedido);
server.put('/item/:id', checkCamposItem, db.updateItemPedido);
server.delete('/item/:id', db.deleteItemPedido);


server.listen(port, () => {
    console.log(`Servidor online porta: ${port}.`)
})


/***   FUNÇÕES   ***/
function checkCamposProdutos(request, response, next) {
    if (!request.body) {
        return response.status(400).json({ error: 'Nenhum campo foi preenchido.' });
    } else if (!request.body.despro) {
        return response.status(400).json({ error: 'Preencha o campo descrição.' });
    } else if (!request.body.tippro) {
        return response.status(400).json({ error: 'Preencha o campo o tipo.' });
    } else if (!request.body.sitpro) {
        return response.status(400).json({ error: 'Campo situação não foi preenchido' });
    }
    return next(); // chama as próximas ações
}

function checkCamposItem(request, response, next) {
    if (!request.body) {
        return response.status(400).json({ error: 'Nenhum campo foi enviado.' });
    } else if (!request.body.codped) {
        return response.status(400).json({ error: 'Código do pedido não foi enviado.' });
    } else if (!request.body.codpro) {
        return response.status(400).json({ error: 'Preencha o produto.' });
    } else if (!request.body.despro) {
        return response.status(400).json({ error: 'Preencha a descrição do produto.' });
    } else if (!request.body.vlrunt) {
        return response.status(400).json({ error: 'Preencha o valor unitário.' });
    } else if (!request.body.vlrdsc) {
        return response.status(400).json({ error: 'Preencha o valor do desconto.' });
    } else if (!request.body.vlrtot) {
        return response.status(400).json({ error: 'Preencha o valor total.' });
    }
    return next(); // chama as próximas ações
}

