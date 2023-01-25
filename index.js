const express = require('express');
const uuid = require('uuid');

const app = express();
app.use(express.json());

const arrayOrder = [];

const typeRequisition = (request, response, next) => {
  console.log(request.method)
  console.log(request.url)

  next();
}

const checkId = (request, response, next) => {
  const { id } = request.params

  const index = arrayOrder.findIndex( user => user.id === id)

  if(index < 0){
    return response.status(404).json({ error: 'User not found' })
  }

  request.userIndex = index
  request.userId = id

  next();
}

app.post('/order', typeRequisition, (request, response) => {
  const { order, clienteName, price } = request.body;
  const id = uuid.v4()

  const orderClient = { id, order, clienteName, price, status:'Em preparação' }

  arrayOrder.push(orderClient);

  return response.status(201).json([orderClient])

})

app.get('/order', typeRequisition, (request, response) => {
  return response.status(200).json(arrayOrder)
})

app.put('/order/:id', checkId, typeRequisition, (request, response) => {
  const { order, clienteName, price } = request.body;
  const index = request.userIndex;
  const id = request.userId;

  const updateOrder = { id, order, clienteName, price, status:'Em preparação' }

  arrayOrder[index] = updateOrder

  return response.status(200).json(updateOrder)
})

app.delete('/order/:id', checkId, typeRequisition, (request, response) => {
  const index = request.userIndex;

  arrayOrder.splice(index, 1)

  return response.status(200).json({ message: 'Item deletado' })
})

app.get('/order/:id', checkId, typeRequisition, (request, response) => {
  const index = request.userIndex;

  return response.status(200).json(arrayOrder[index])
})

app.patch('/order/:id', checkId, typeRequisition, (request, response) => {
  const index = request.userIndex;

  arrayOrder[index].status = "Pronto"

  return response.status(200).json(arrayOrder[index])
})

app.listen(3001, () => {
  console.log('Server Online')
})