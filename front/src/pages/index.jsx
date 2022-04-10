import { useEffect, useState } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import styles from "../styles/Home.module.css";
import { EditIcon, DeleteIcon } from "../components/Icons";
import { useRouter } from "next/router";
import { ConverteData } from "../components/ConverteData";

export default function Home() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [delItem, setDelItem] = useState(0);

  const handleClick = () => setLoading(true);

  const handleShow = (item) => {
    setShow(true);
    setDelItem(item);
  };
  const handleClose = () => setShow(false);

  useEffect(() => {
    if (isLoading) {
      carregarItens();
    }
  }, [isLoading]);

  async function carregarItens() {
    if (typeof window !== "undefined") {
      const dados = await JSON.parse(localStorage.getItem("items"));
      setItems(dados);
      setLoading(false);
    }
  }

  async function editarItem(item) {
    router.push(`/Item/${item.codite}`);
  }

  async function excluirItem(item) {
    if (typeof window !== "undefined") {
      const dados = await JSON.parse(localStorage.getItem("items"));
      const index = dados.findIndex((e) => e.codite == item.codite);

      dados.splice(index, 1);
      localStorage.setItem("items", JSON.stringify(dados));
      setShow(false);
      setLoading(true);
      handleClose;
      console.log('excluido', isLoading, show);
    }
  }

  function converteUM(medite) {
    switch (medite) {
      case "lt":
        return "Litros";
        break;
      case "kg":
        return "Quilogramas";
        break;
      case "un":
        return "Unidades";
        break;
      default:
        return "";
    }
  }

  function renderRows() {
    return items?.map((item) => {
      return (
        <tr key={item.codite}>
          <td>{item.codite}</td>
          <td>{item.nomite}</td>
          <td>{converteUM(item.medite)}</td>
          <td>{item.qtdite}</td>
          <td>{item.vlrite}</td>
          <td>{item.perite == true ? "Sim" : "Não"}</td>
          <td>{item.valite > 0 ? ConverteData(item.valite) : ""}</td>
          <td>{item.fabite > 0 ? ConverteData(item.fabite) : ""}</td>
          <td className={styles.acoes}>
            <Button
              variant="dark"
              className={styles.botao_acoes}
              onClick={() => editarItem(item)}
            >
              {EditIcon}
            </Button>
            <Button
              variant="dark"
              className={styles.botao_acoes}
              onClick={() => handleShow(item)}
            >
              {DeleteIcon}
            </Button>
          </td>
        </tr>
      );
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.window}>
        <div className={styles.conteudo}>
          <div className={styles.botao}>
            <Button
              className={styles.button}
              variant="primary"
              onClick={() => router.push("/Item/0")}
            >
              Novo
            </Button>
          </div>
          <Table striped bordered hover size="sm" variant="dark">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome do Item</th>
                <th>Unidade de Medida</th>
                <th>Quantidade</th>
                <th>Preço</th>
                <th>Perecível</th>
                <th>Validade</th>
                <th>Fabricação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>{renderRows()}</tbody>
          </Table>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Excluir</Modal.Title>
        </Modal.Header>
        <Modal.Body>Deseja mesmo excluir o item {delItem.nomite}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Não
          </Button>
          <Button variant="primary" onClick={() => excluirItem(delItem)}>
            Sim
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
