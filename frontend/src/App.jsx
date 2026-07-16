import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [produtos, setProdutos] = useState([])

  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [preco, setPreco] = useState('')

  const [editandoId, setEditandoId] = useState(null)

  async function carregarProdutos() {

    const resposta = await fetch('http://localhost:8080/produtos')

    const dados = await resposta.json()

    setProdutos(dados)
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function salvarProduto(e) {

    e.preventDefault()

    const produto = {
      nome,
      descricao,
      preco
    }

    // EDITAR
    if (editandoId !== null) {

      await fetch(`http://localhost:8080/produtos/${editandoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
      })

      setEditandoId(null)

    } else {

      // CADASTRAR
      await fetch('http://localhost:8080/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
      })
    }

    limparFormulario()

    carregarProdutos()
  }

  function editarProduto(produto) {

    setNome(produto.nome)
    setDescricao(produto.descricao)
    setPreco(produto.preco)

    setEditandoId(produto.id)
  }

  async function deletarProduto(id) {

    await fetch(`http://localhost:8080/produtos/${id}`, {
      method: 'DELETE'
    })

    carregarProdutos()
  }

  function limparFormulario() {
    setNome('')
    setDescricao('')
    setPreco('')
  }

  return (

      <div className="container">

        <h1>Catálogo de Produtos</h1>

        <form onSubmit={salvarProduto}>

          <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
          />

          <input
              type="text"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
          />

          <input
              type="number"
              placeholder="Preço"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
          />

          <button type="submit">
            {editandoId !== null ? 'Atualizar' : 'Cadastrar'}
          </button>

        </form>

        <div className="lista-produtos">

          {
            produtos.map(produto => (

                <div className="card" key={produto.id}>

                  <h2>{produto.nome}</h2>

                  <p>{produto.descricao}</p>

                  <strong>R$ {produto.preco}</strong>

                  <div className="botoes">

                    <button onClick={() => editarProduto(produto)}>
                      Editar
                    </button>

                    <button onClick={() => deletarProduto(produto.id)}>
                      Deletar
                    </button>

                  </div>

                </div>
            ))
          }

        </div>

      </div>
  )
}

export default App