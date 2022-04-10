const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'comercial',
  password: 'root',
  port: 5432,
})

/***   PRODUTOS e SERVIÇOS   ***/
// Listar produtos
const getProdutos = (request, response) => {
  const filter = request.body;
  let sql = 'SELECT * FROM proser ';
  let i = 0;

  if (!(JSON.stringify(filter) === "{}")) {
    sql = sql + 'WHERE';
    if (!!filter.codpro) {
      sql = sql + ` codpro = '${filter.codpro}'`;
      i++;
    }
    if (!!filter.despro) {
      i > 0 ? sql = sql + ' AND ': sql;
      sql = sql + ` despro LIKE '%${filter.despro}%'`;
      i++;
    }
    if (!!filter.tippro) {
      i > 0 ? sql = sql + ' AND ': sql;
      sql = sql + ` tippro = '${filter.tippro}'`;
      i++;
    }
    if (!!filter.sitpro) {
      i > 0 ? sql = sql + ' AND ': sql;
      sql = sql + ` sitpro = '${filter.sitpro}'`;
      i++;
    }
  }

  pool.query(sql, (error, results) => {
    if (error) {
      response.status(400).json(error)
    }
    response.status(200).json(results.rows)
  })
}

// Inserir um produto
const createProduto = (request, response) => {
  const { despro, tippro, sitpro } = request.body;

  pool.query('INSERT INTO proser (despro, tippro, sitpro) VALUES ($1, $2, $3)', [despro, tippro, sitpro], (error, results) => {
    if (error) {
      response.status(400).json(error)
    }
    response.status(201).send(`Produto criado com sucesso!`)
  })
}

// Alterar um produto
const updateProduto = (request, response) => {
  const id = request.params.id;
  const { despro, tippro, sitpro } = request.body;

  pool.query(
    'UPDATE proser SET despro = $1, tippro = $2, sitpro = $3 WHERE codpro = $4', 
    [despro, tippro, sitpro, id], (error, results) => {
      if (error) {
        response.status(400).json(error);
      }
      response.status(200).send(`Produto ${id} alterado com sucesso!`)
    }
  )
}

// Excluir um produto
const deleteProduto = (request, response) => {
  const id = request.params.id;

  pool.query('SELECT * FROM iteped WHERE codpro = $1', [id], (error, results) => {
    console.log(results.rowCount);
    if (error) {
      response.status(400).json(error.message);
    } else if (results.rowCount > 0) {
      response.status(400).json('Exclusão n"ao permitida. Existem pedidos com este produto/serviço.');
    }
  })

  pool.query('DELETE FROM proser WHERE codpro = $1', [id], (error, results) => {
    if (error) {
      response.status(400).json(error.message)
    }
    response.status(200).send(`Produto ${id} deletado com sucesso!`)
  })
}


/***   PEDIDOS   ***/
// Listar pedidos
const getPedidos = (request, response) => {
  const filter = request.body;
  let sql = 'SELECT * FROM pedido ';
  let i = 0;

  if (!(JSON.stringify(filter) === "{}")) {
    sql = sql + 'WHERE';
    if (!!filter.codped) {
      sql = sql + ` codped = '${filter.codped}'`;
      i++;
    }
    if (!!filter.sitped) {
      i > 0 ? sql = sql + ' AND ': sql;
      sql = sql + ` sitped = '${filter.sitped}'`;
      i++;
    }
  }

  pool.query(sql, (error, results) => {
    if (error) {
      response.status(400).json(error)
    }
    response.status(200).json(results.rows)
  })
}

// Inserir um pedido
const createPedido = (request, response) => {
  const { sitped } = request.body;

  pool.query('INSERT INTO pedido (sitped) VALUES ($1)', [sitped], (error, results) => {
    if (error) {
      response.status(400).json(error)
    }
    response.status(201).send(`Pedido criado com sucesso!`)
  })
}

// Alterar um pedido 
const updatePedido = (request, response) => {
  const id = request.params.id;
  const { sitped } = request.body;

  pool.query(
    'UPDATE pedido SET sitped = $1 WHERE codped = $2', [sitped, id], (error, results) => {
      if (error) {
        response.status(400).json(error)
      }
      response.status(200).send(`Pedido ${id} alterado com sucesso!`)
    }
  )
}

// Excluir um produto
const deletePedido = (request, response) => {
  const id = request.params.id;

  pool.query('DELETE FROM pedido WHERE codped = $1', [id], (error, results) => {
    if (error) {
      response.status(400).json(error)
    }
    response.status(200).send(`Pedido ${id} deletado com sucesso!`)
  })
}


/***   ITENS PEDIDOS   ***/
// Listar itens por código pedido
const getItensPedidosById = (request, response) => {
  const id = request.params.id; //Passar código do pedido (CODPED)

  pool.query('SELECT * FROM iteped WHERE codped = $1', [id], (error, results) => {
    if (error) {
        response.status(400).json(error.message);
    }
    response.status(200).json(results.rows)
  })
}

// Inserir um item no pedido
const createItemPedido = (request, response) => {
  const { codped, codpro, despro, vlrunt, vlrdsc, vlrtot } = request.body;

  pool.query('SELECT sitped FROM pedido WHERE codped = $1', [codped], (error, results) => {
    if (error) {
      response.status(400).send(error.message);
    } else { 
      const sitped = results.rows[0].sitped;
    
      if (sitped === 'F') {
        response.status(400).send('Não é possível inserir um item em pedidos com situação Fechado.');
      }
    }
  })
  
  pool.query('SELECT tippro, sitpro FROM proser WHERE codpro = $1', [codpro], (error, results) => {
    if (error) {
      response.status(400).send(error.message);
    } else { 
      const tippro = results.rows[0].tippro;
      const sitpro = results.rows[0].sitpro;
    
      if (sitpro === 'I') {
        response.status(400).send('Produto/Serviço está inativo, verifique o cadastro.');
      }else if ((vlrdsc > 0) && (tippro === 'S')) {
        response.status(400).send('Itens do tipo Serviço não podem receber desconto.');
      }
    }
  })

  pool.query('INSERT INTO iteped (codped, codpro, despro, vlrunt, vlrdsc, vlrtot) VALUES ($1, $2, $3, $4, $5, $6)', 
    [codped, codpro, despro, vlrunt, vlrdsc, vlrtot], (error, results) => {
    if (error) {
      response.status(400).send(error);
    }
    response.status(200).send(`Item de pedido criado com sucesso!`);
  })
}

// Alterar um item no pedido 
const updateItemPedido = (request, response) => {
  const id = request.params.id; //Passar código do item (CODITE)
  const { codped, codpro, despro, vlrunt, vlrdsc, vlrtot } = request.body;
  let sitped = '';

  pool.query('SELECT sitped FROM pedido WHERE codped = $1', [codped], (error, results) => {
    if (error) {
      response.status(400).send(error.message);
    } else { 
      sitped = results.rows[0].sitped;
    }
  })

  pool.query('SELECT tippro, sitpro FROM proser WHERE codpro = $1', [codpro], (error, results) => {
    if (error) {
      response.status(400).send(error);
    } else {
      const tippro = results.rows[0].tippro;
      const sitpro = results.rows[0].sitpro;
    
      if (sitpro === 'I') {
        response.status(400).send('Produto/Serviço está inativo, verifique o cadastro.');
      } else if ((vlrdsc > 0) && (tippro === 'S')) {
        response.status(400).send('Itens do tipo Serviço não podem receber desconto.');
      } else if ((vlrdsc > 0) && (sitped === 'F')) {
        response.status(400).send('Não é possível inserir um desconto em pedidos com situação Fechado.');
      }
    }
  })

  pool.query(
    'UPDATE iteped SET codped = $1, codpro = $2, despro = $3, vlrunt = $4, vlrdsc = $5, vlrtot = $6 WHERE codite = $7', [codped, codpro, despro, vlrunt, vlrdsc, vlrtot, id], (error, results) => {
      if (error) {
        response.status(400).send(error);
      }
      response.status(200).send(`Pedido ${id} alterado com sucesso!`)
    }
  )
}

// Excluir um Item no pedido
const deleteItemPedido = (request, response) => {
  const id = request.params.id; //Passar código do item (CODITE)

  pool.query('DELETE FROM iteped WHERE codite = $1', [id], (error, results) => {
    if (error) {
      response.status(400).send(error);
    }
    response.status(200).send(`Item ${id} deletado com sucesso!`)
  })
}


module.exports = {
  getProdutos,
  createProduto,
  updateProduto,
  deleteProduto,
  getPedidos,
  createPedido,
  updatePedido,
  deletePedido,
  getItensPedidosById,
  createItemPedido,
  updateItemPedido,
  deleteItemPedido,
}