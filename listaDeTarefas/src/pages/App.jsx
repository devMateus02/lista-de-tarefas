import { useState, useEffect, useRef } from "react";
import Api from "../service/api";
import "./App.css";
import api from "../service/api";
import Botao from "../components/Botoes";


function App() {
  const [listaTarefas, setListaTarefas] = useState([]);
  const [termo, setTermo] = useState("");
  const [resultado, setResultado] = useState([]);
  const [buscou, setBuscou] = useState(false);
  const [modalAdd, setModalAdd] = useState(null);
  const [modalExibir, setModalExibir] = useState(null)
  const [modoEdicao, setModoEdicao] = useState(false);
  const [editando, setEditando] = useState(null);
  const [prioridade, setPrioridade] = useState("");
  const [Categoria, setCategoria] = useState("");
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState("");
  const refTitulo = useRef();
  const refDescricao = useRef();
  const refPrazo = useRef();

  const carregarTarefas = async () => {
    try {
      const resposta = await Api.get("/tarefas");
      setListaTarefas(resposta.data);
    } catch (error) {
      console.error("erro ao listar tarefas", error);
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  const buscar = async () => {
    if (!termo) {
      setResultado([]);
      return;
    }
    try {
      const resposta = await Api.get(`/buscar?q=${termo}`);
      setResultado(resposta.data);
      setBuscou(true);
    } catch (error) {
      console.error("erro ao buscar tarefas", error);
    }

    return;
  };
  const tarefasParaMostrar = termo ? resultado : listaTarefas;

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await api.put(`/tarefa/${id}/status`, { status: novoStatus });
      carregarTarefas();
    } catch (error) {
      console.error("erro ao atualizar status", error);
    }
  };

  const postTarefas = async () => {
    const tarefaNova = {
      titulo: refTitulo.current.value.trim(),
      descricao: refDescricao.current.value.trim(),
      data: refPrazo.current.value.trim(),
      prioridade: prioridade,
      categoria: Categoria,
    };
    if (!tarefaNova.titulo) {
      setError("preencha o campo 'Titulo'");
      setSucesso("");
      return;
    }

   try {
  await Api.post('/tarefas', tarefaNova);

  setSucesso('Tarefa cadastrada com sucesso!');
  setError('');
  carregarTarefas();

  refTitulo.current.value = '';
  refDescricao.current.value = '';
  refPrazo.current.value = '';
  setPrioridade('');
  setCategoria('');

  setTimeout(() => {
    setSucesso('');
    setError('');
  }, 3000);

} catch (err) {
  if (err.response && err.response.status === 400) {
    setError(err.response.data.error);
  } else {
    setError('Erro ao cadastrar tarefa.');
  }
  setSucesso('');

  setTimeout(() => {
    console.log('fdgdagahgd')
    setSucesso('');
    setError('');
  }, 3000);
}

   
}

 async function deleteTarefa(id) {

         if (!id) {
    console.error("ID inválido para exclusão.");
    return;
  }
        await Api.delete(`/tarefa/${id}`)

       carregarTarefas()

        
      }

     useEffect(() => {
      carregarTarefas()
     },[])
  ;
 const editarTarefa = async () => {
  if (!editando) return;

  const { _id, titulo, descricao, categoria, prazo, prioridade } = editando;

  try {
    await Api.put(`/tarefa/${_id}`, {
      titulo,
      descricao,
      categoria,
      data: prazo,
      prioridade,
    });


    await carregarTarefas();


    setModalExibir(null);
    setModoEdicao(false);
    setEditando(null);

    setSucesso("Tarefa atualizada com sucesso!");
    setError("");
  } catch (error) {
    setError("Erro ao atualizar a tarefa.");
    console.error("Erro ao editar tarefa:", error);
  }
   setTimeout(() => {
    setSucesso("");
    setError("");
  }, 3000);
};



  return (
    <>
      <div className="container border h-108 p-3 rounded-[12px]  border-gray-500/30 bg-[rgb(29,28,28)]  shadow-[-0px_2px_20px_0px] shadow-black">
        <div>
          <h1 className="text-3xl mb-5">Lista de tarefas</h1>
        <div className="flex gap-1.5">
          <input className="border border-gray-500/40 bg-[rgb(36,35,35)]  transition ease-in-out duration-[.5s] focus:border-blue-600 focus:outline-none focus:ring-0 p-2 rounded"
            type="search"
            name="pesquisa"
            id="pesquisa"
            placeholder="buscar tarefas..."
            onChange={(e) => setTermo(e.target.value)}
          />
        <div className= 'flex gap-2'>
        <Botao titulo='Buscar' funcao= {buscar}/>
        <Botao titulo='+add' funcao={() => setModalAdd(true)}/>
        </div>
        </div>
        </div>
         <div className="tarefas overflow-y-auto h-[72%] border border-gray-500/40 p-2 mt-3.5  shadow-[-0px_2px_20px_0px] shadow-black rounded-[5px]">
           {termo && resultado.length === 0 && (
            <p style={{ marginTop: "1rem", color: "red" }}>
              Nenhuma tarefa encontrada
            </p>
          )}
          
            {tarefasParaMostrar.map((tarefa) => (
            <div
              className="container-list mt-[1em] p-2 flex justify-between items-center border bg-[rgb(36,35,35)] border-gray-500/30 rounded-[5px]"
              key={tarefa._id}
            >
               <div className="flex ">
                <label className="flex items-center gap-2">
                  <input className="w-4 h-4 text-blue-600 accent-blue-600 rounded"
                    type="checkbox"
                    checked={tarefa.status}
                    onChange={(e) =>
                      atualizarStatus(tarefa._id, e.target.checked)
                    }
                  />
                  <p className="text-[1em] font-[400]">{tarefa.titulo}</p>
                </label>
              </div>
              <div className="flex gap-3">
                
                   <button><img className="w-[1.2em] cursor-pointer" src="expandir.png" alt="Ver mais" onClick={() => setModalExibir(tarefa)}/></button>
                   <button onClick={() => deleteTarefa(tarefa._id)}><img className="w-[1.2em] cursor-pointer" src="lixeira.png" alt="Excluir"/></button>

              </div>
            

            </div>
     
          ))}
          
         </div>
      </div>

{modalExibir && (
  <div className="modal-detalhes fixed top-0 h-full left-0 w-full  bg-black/40 flex justify-center items-center z-50  shadow-[-0px_0px_20px_0px] shadow-black ">
   <div className="bg-[rgb(55,55,55)] text-left p-6 rounded-xl max-w-md w-[90%] max-h-[90vh] overflow-y-auto relative">

      <h2 className="text-xl text-center font-semibold mb-4">
        {modoEdicao ? "Editar Tarefa" : "Detalhes da Tarefa"}
      </h2>
  {/* Título */}
    <label className="block mb-2">
      <span className="block font-medium">Título:</span>
      {modoEdicao ? (
        <input
          type="text"
          className="w-full p-2 border"
          value={editando?.titulo || modalExibir.titulo}
          onChange={(e) =>
            setEditando({ ...modalExibir, ...(editando || {}), titulo: e.target.value })
          }
        />
      ) : (
        <input type="text" value={modalExibir.titulo} disabled className="w-full p-2 border  text-white" />
      )}
    </label>

    {/* Descrição */}
    <label className="block mb-2">
      <span className="block font-medium">Descrição:</span>
      {modoEdicao ? (
        <textarea
          className="w-full p-2 border"
          value={editando?.descricao || modalExibir.descricao}
          onChange={(e) =>
            setEditando({ ...modalExibir, ...(editando || {}), descricao: e.target.value })
          }
        />
      ) : (
        <textarea
          className="w-full p-2 border text-white"
          value={modalExibir.descricao}
          disabled
        />
      )}
    </label>

    {/* Prazo */}
    <label className="block mb-2">
      <span className="block font-medium">Prazo:</span>
      {modoEdicao ? (
        <input
          type="date"
          className="w-full p-2 border"
          value={editando?.prazo || modalExibir.prazo?.slice(0, 10)}
          onChange={(e) =>
            setEditando({ ...modalExibir, ...(editando || {}), prazo: e.target.value })
          }
        />
      ) : (
        <input
          type="text"
          className="w-full p-2 border  text-white"
          value={modalExibir.prazo?.slice(0, 10) || "Sem prazo"}
          disabled
        />
      )}
    </label>

    {/* Prioridade */}
    <label className="block mb-2">
      <span className="block font-medium">Prioridade:</span>
      {modoEdicao ? (
        <select
          className="w-full p-2 border"
          value={editando?.prioridade || modalExibir.prioridade}
          onChange={(e) =>
            setEditando({ ...modalExibir, ...(editando || {}), prioridade: e.target.value })
          }
        >
          <option value="baixa">Baixa</option>
          <option value="Media">Média</option>
          <option value="alta">Alta</option>
        </select>
      ) : (
        <input
          type="text"
          className="w-full p-2 border text-white"
          value={modalExibir.prioridade}
          disabled
        />
      )}
    </label>

    {/* Categoria */}
    <label className="block mb-4">
      <span className="block font-medium">Categoria:</span>
      {modoEdicao ? (
        <select
          className="w-full p-2 border"
          value={editando?.categoria || modalExibir.categoria}
          onChange={(e) =>
            setEditando({ ...modalExibir, ...(editando || {}), categoria: e.target.value })
          }
        >
          <option value="trabalho">Trabalho</option>
          <option value="estudos">Estudos</option>
          <option value="pessoal">Pessoal</option>
          <option value="saude">Saúde</option>
          <option value="casa">Casa</option>
          <option value="projetos">Projetos</option>
          <option value="compras">Compras</option>
          <option value="lazer">Lazer</option>
        </select>
      ) : (
        <input
          type="text"
          className="w-full p-2 border text-white"
          value={modalExibir.categoria}
          disabled
        />
      )}
    </label>

      {/* Botões */}
      <div className="flex justify-between mt-4">
        {modoEdicao ? (
          <>
          <Botao titulo='Salvar' funcao= {()=> {editarTarefa()}}/>
            <button
              className="text-red-600 hover:text-red-800 cursor-pointer"
              onClick={() => {
                setModoEdicao(false);
                setEditando(null);
              }}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <Botao titulo='Editar' funcao={() => {
                setModoEdicao(true);
                setEditando(modalExibir);}}/>
            <button
              className="text-red-600 hover:text-red-800 cursor-pointer"
              onClick={() => {
                setModalExibir(null);
                setEditando(null);
              }}
            >
              Fechar
            </button>
          </>
        )}
      </div>
    </div>
  </div>
)}


      {modalAdd && (
        <div className="modal-overlay flex justify-center fixed top-0 left-0 bg-[rgba(0,0,0,.2)] w-[100vw] h-[100%] items-center  ">

          <div className="modal flex flex-col gap-2 max-w-[90%] w-[450px] bg-[rgb(36,36,36)] shadow-[-0px_0px_25px_0px] shadow-black  rounded-2xl max-h-[90vh] overflow-y-auto p-4">

              <h2 className="text-[1.5em]">Adicionar tarefa</h2>
            <form className="grid grid-cols-2 md:grid-cols-2 gap-4 p-4 max-w-xl mx-auto rounded text-left">
            
                <div>
                  <label htmlFor="titulo">Titulo: </label>
                <input type="text" id="titulo" ref={refTitulo} />
                </div>
               <div>
                 <label htmlFor="prazo">Prazo: </label>
                <input type="date" id="prazo" ref={refPrazo} />
               </div>
               <div>
                 <label htmlFor="descricao">Descrição</label>
                <textarea
                  name="Descrição"
                  id="Descricao"
                  placeholder=""
                  ref={refDescricao}
                ></textarea>
               </div>
               <div>
                 <label htmlFor="prioridade">Prioridade</label>
                <select
                  id="prioridade"
                  value={prioridade}
                  onChange={(e) => setPrioridade(e.target.value)}
                >
                  <option value="baixa">Baixa</option>
                  <option value="Media">Media</option>
                  <option value="alta">Alta</option>
                </select>
               </div>
               <div> <label htmlFor="categoria">Categoria</label>
                <select className="max-h-32 overflow-auto "
                  id="categoria"
                  value={Categoria}
                  onChange={(e) => setCategoria(e.target.value)}
               
                >
                  <option value="" hidden></option>
                  <option value="trabalho">Trabalho</option>
                  <option value="estudos">Estudos</option>
                  <option value="pessoal">Pessoal</option>
                  <option value="saude">Saúde</option>
                  <option value="casa">Casa</option>
                  <option value="projetos">Projetos</option>
                  <option value="compras">Compras</option>
                  <option value="lazer">Lazer</option>
                </select></div>
              
            </form>
            {error && <p className="error text-red-700">{error}</p>}
            {sucesso&& <p className="sucesso text-green-600">{sucesso}</p>}
           <div className="btn flex justify-center gap-4 p-2">
             <Botao funcao={postTarefas} titulo ='Salvar'/>
             <Botao funcao={() => setModalAdd(false)} titulo ='cancel'/>
            
           </div>
          </div>
        </div>
      )}
      
    </>
  );
}

export default App;
