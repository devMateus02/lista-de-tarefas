const express = require('express')
const mongo = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const PORT = process.env.PORT || 3000 
const app = express()
app.use(cors())
app.use(express.json())

async function start(){
    try{
     await mongo.connect(process.env.DB_MONGO)

      console.log( 'conectado ao mongoDB')

      app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`)
     })
    }
    catch(error){
        console.error('erro ao conectar com o mongo');
    };
}
start()

const tarefaSchema = new  mongo.Schema({
    titulo: {type: String}, 
    descricao: {type:String} ,
    status:{type: Boolean, default: false },
    data_criacao: {type: Date, default: Date.now},
    data:{type: Date},
    prioridade: {type: String},
    categoria: {type: String}    
})

const tarefas = mongo.model('tarefas', tarefaSchema)

app.get('/tarefas', async (req, res) => {
    try{
     const lista = await tarefas.find()
     res.status(200).send(lista)

    }
    catch(erro){
      console.error('erro interno do servidor', erro)
      res.status(500).send('erro interno no servidor')
    }
})

app.get('/buscar', async (req, res) => {
    const {q} = req.query
    try {
        const filtro = q ? {titulo: {$regex: q, $options: 'i'}}:{}
        const lista = await tarefas.find(filtro)
        res.status(200).send(lista)
    } catch (error) {
        console.error('erro na busca');
        res.status(500).send('erro interno no servido')
        
    }
})

app.post('/tarefas', async (req, res) => {
     const {titulo, descricao, status, data_criacao, data, prioridade, categoria} = req.body
     try {
       await tarefas.create({titulo, descricao, status, data_criacao, data, prioridade, categoria})
       res.status(201).send(`Tarefa ${titulo} inserida`)
     }
     catch(erro){
       console.error('Tarefa não cadastra', erro);
       res.status(500).send('Tarefa não inserida')
     }
})

app.put('/tarefa/:id', async (req, res) => {
    const {id}= req.params
    const dadoAtualizados = req.body
    try{
      const tarefa = await tarefas.findByIdAndUpdate(id, dadoAtualizados, {new: true})

      if(!tarefa){
       return res.status(404).send("tarefa não encontrada")
      }

      res.status(200).send(tarefa)
    }
    catch(error){
        console.error("erro ao atualizar a tarefa", error)
        res.status(500).send('erro interno no servidor')
    }
})

app.put('/tarefa/:id/status', async (req, res) => {
    const {id} = req.params
    const {status} = req.body
  try {
    const tarefa = await tarefas.findByIdAndUpdate(id , {status}, {new:true})

  res.status(200).send(tarefa)
  } catch (error) {
    console.error('status não modificado', error);
    
  }
})


app.delete('/tarefa/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const tarefa = await tarefas.findByIdAndDelete(id);

        if (!tarefa) {
            return res.status(404).send('Tarefa não encontrada');
        }

        res.status(200).send(`Tarefa ${tarefa.titulo} excluída`);
    } catch (error) {
        console.error('erro ao excluir tarefa', error); 
        res.status(500).send('Erro interno no servidor');
    }
});


app.delete('/tarefas', async (req, res) => {
   try{
    const tarefa = await tarefas.deleteMany({})
      
    res.status(200).send(`tarefas deletadas`)
   }
   catch(error){
    console.error('erro ao excluir todas as terafas')
    res.status(500).send('erro no servidor')
   }
})




