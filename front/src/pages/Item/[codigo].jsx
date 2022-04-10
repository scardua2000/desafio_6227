import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { ConverteData, ConvertTimestamp } from "../../components/ConverteData";
import styles from "../../styles/Home.module.css";

export default function Formulario() {
  const [validated, setValidated] = useState(false);
  const [itemNovo, setItemNovo] = useState(false);
  const router = useRouter();

  const dados = JSON.parse(localStorage.getItem("items"));
  const item = dados.find((e) => e.codite == router.query.codigo);
  let index = dados.findIndex((e) => e.codite == router.query.codigo);

  const [codite, setCodIte] = useState(novoItem);
  const [nomite, setNomIte] = useState(dados[index]?.nomite);
  const [medite, setMedIte] = useState(dados[index]?.medite);
  const [qtdite, setQtdIte] = useState(dados[index]?.qtdite);
  const [vlrite, setVlrIte] = useState(dados[index]?.vlrite);
  const [perite, setPerIte] = useState(dados[index]?.perite);
  const [valite, setValIte] = useState(dados[index]?.valite);
  const [fabite, setFabIte] = useState(dados[index]?.fabite);
  const [altValIte, setAltValIte] = useState(false);
  const [altFabIte, setAltFabIte] = useState(false);

  function novoItem() {
    if (index < 0) {
      let Max = dados.map((i) => i.codite);
      Max = Math.max.apply(null, Max);
      if (Max === -Infinity) {
          Max = 1;
      } else {
        Max++;
      }
      index = Max;
      setItemNovo(true);
      return Max;
    } else {
      return dados[index]?.codite;
    }
  }

  async function onChangePerecivel() {
    if (perite) {
      setPerIte(false);
      setValIte(0);
      setAltValIte(true);
    } else {
      setPerIte(true);
    }
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget;

    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const newValIte = altValIte ? ConvertTimestamp(valite) : valite;
      let newFabIte = altFabIte ? ConvertTimestamp(fabite) : fabite;
      const newPerIte = typeof perite === "undefined" ? false : perite;

      if (itemNovo) {
        const item = {
          codite: codite,
          nomite: nomite,
          medite: medite,
          qtdite: qtdite,
          vlrite: vlrite,
          perite: newPerIte,
          valite: newValIte,
          fabite: newFabIte,
        };
        dados.push(item);
      } else {
        dados[index].nomite = nomite;
        dados[index].medite = medite;
        dados[index].qtdite = qtdite;
        dados[index].vlrite = vlrite;
        dados[index].perite = perite;
        dados[index].valite = newValIte;
        dados[index].fabite = newFabIte;
      }

      localStorage.setItem("items", JSON.stringify(dados));
      router.back();
    }
    setValidated(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.window}>
        <div className={styles.conteudo}>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="2" controlId="validationCustom01">
                <Form.Label>Código</Form.Label>
                <Form.Control
                  type="number"
                  readOnly
                  disabled
                  placeholder=""
                  defaultValue={codite}
                />
              </Form.Group>

              <Form.Group as={Col} md="10" controlId="validationCustom01">
                <Form.Label>Nome do Item</Form.Label>
                <Form.Control
                  required
                  //pattern="[A-Za-z- ']"
                  type="text"
                  placeholder="Nome do Item"
                  defaultValue={nomite}
                  onChange={(e) => setNomIte(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Campo obrigatório!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label>Unidade de Medida</Form.Label>
                <Form.Select
                  required
                  defaultValue={medite}
                  onChange={(e) => setMedIte(e.target.value)}
                >
                  <option> </option>
                  <option value="lt">Litros</option>
                  <option value="kg">Quilograma</option>
                  <option value="un">Unidade</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Campo obrigatório!
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label>Quantidade</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="0"
                  defaultValue={qtdite}
                  onChange={(e) => setQtdIte(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Campo obrigatório!
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label>Preço</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="0,00"
                  defaultValue={vlrite}
                  onChange={(e) => setVlrIte(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Campo obrigatório!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <div className={styles.checkbox}>
                  <Form.Check
                    inline
                    label="Perecível"
                    name="chkPerecivel"
                    type="checkbox"
                    checked={perite === true ? "checked" : ""}
                    onChange={onChangePerecivel}
                  />
                  <Form.Control.Feedback type="invalid">
                    Campo obrigatório!
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label>Data de Validade</Form.Label>
                <Form.Control
                  type="data"
                  placeholder="00/00/0000"
                  defaultValue={valite > 0 ? ConverteData(item.valite) : ""}
                  onChange={(e) => {
                    if (perite) {
                      setValIte(e.target.value);
                      setAltValIte(true);
                    } else {
                      alert(
                        "O campo Data de Validade só pode ser preenchido quando o item é perecível."
                      );
                    }
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  Campo obrigatório!
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label>Data de Fabricação</Form.Label>
                <Form.Control
                  required
                  type="data"
                  placeholder="00/00/0000"
                  defaultValue={fabite > 0 ? ConverteData(fabite) : ""}
                  onChange={(e) => {
                    setFabIte(e.target.value);
                    setAltFabIte(true);
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  Campo obrigatório!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <div className={styles.botoes}>
              <Button className={styles.botao_salvar} type="submit">
                Salvar
              </Button>
              <Button variant="danger" onClick={router.back}>
                Cancelar
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
