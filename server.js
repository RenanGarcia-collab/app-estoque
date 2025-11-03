// server.js - Node + Express + Socket.IO
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let pedidos = [];
let nextId = 1;

// serve static files da pasta public
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    console.log('Cliente conectado', socket.id);
    socket.emit('listaPedidos', pedidos);

    // novo pedido
    socket.on('novoPedido', data => {
        const p = {
            id: nextId++,
            tecnico: data.tecnico || 'Desconhecido',
            itens: Array.isArray(data.itens) ? data.itens : [{item: data.itens, qtd:1}],
            time: Date.now()
        };
        pedidos.push(p);
        io.emit('listaPedidos', pedidos);
        io.emit('somPedido');
        console.log('Pedido criado', p);
    });

    // pedido pronto
    socket.on('pedidoPronto', data => {
        io.emit('pedidoPronto', { id: data.id, tecnico: data.tecnico });
        io.emit('somPronto');
        console.log('Pedido pronto', data);
    });

    // limpar pedido
    socket.on('limparPedido', id => {
        pedidos = pedidos.filter(p => p.id !== id);
        io.emit('listaPedidos', pedidos);
        console.log('Pedido limpo', id);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado', socket.id);
    });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
