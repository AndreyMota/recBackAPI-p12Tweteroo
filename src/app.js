import express, { query } from "express";
import cors from 'cors';

function obterUltimosElementos(array) {
    const tamanhoArray = array.length;
    const quantidadeRetorno = Math.min(tamanhoArray, 10); // Obter o mínimo entre o tamanho do array e 10
    const ultimosElementos = array.slice(tamanhoArray - quantidadeRetorno);
    return ultimosElementos;
}

function obterElementosPaginados(array, pagina) {
    const elementosPorPagina = 10;
    const startIndex = (pagina - 1) * elementosPorPagina;
    const endIndex = startIndex + elementosPorPagina;

    if (startIndex >= array.length) {
        return []; // Retorna um array vazio se a página estiver fora dos limites
    }

    const elementosPagina = array.slice(startIndex, endIndex);
    return elementosPagina;
}


const users = [];
const tweets = [];

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5000;


app.post('/sign-up', (req, res) => {
    if (!req.body.username || !req.body.avatar) {
        res.status(400).send("username ou avatar inválidos");
        return;
    }
    if (!(typeof(req.body.username) === "string") || !(typeof(req.body.avatar) === "string")) {
        res.status(400).send("Username ou avatar não são strings");
    }
    users.push(req.body);
    res.status(201).send("OK/CREATED");
});


app.post('/tweets', (req, res) => {
    if (!req.body.username || !req.body.tweet) {
        res.status(400).send("username ou tweet inválidos");
        return;
    }
    if (!(typeof(req.body.username) === "string") || !(typeof(req.body.tweet) === "string")) {
        res.status(400).send("Username ou tweet não são strings");
    }
    let tem = false;
    if (users.length === 0) {
        res.status(401).send('UNAUTHERIZED');
    }
    const now = req.body;
    users.forEach((x) => {
        if (x.username === now.username) {
            now.avatar = x.avatar
            tem = true
        }
    })
    if (tem) {
        tweets.push(now);
    }
    else {
        res.status(401).send('UNAUTHERIZED');
    }
    
    res.status(201).send("OK/CREATED");
})

app.get('/tweets', (req, res) => {
    const page = req.query.page;
    if (page) {
        if (page >= 1) {
            const obj = obterElementosPaginados(tweets, page);
            res.send(obj);
        }
        else {
            res.status(400).send("Informe uma página válida!");
        }
    }
    const obj = obterElementosPaginados(tweets, 1);
    res.send(obj);
})

app.get('/tweets/:USERNAME', (req, res) => {
    const name = req.params.USERNAME;
    const twts = [];
    if (users.length === 0) {
        res.send([]);
    }
    tweets.forEach(x => {
        if (x.username === name) {
            twts.push(x);
        }
    });
    res.send(twts);
})

app.listen(PORT, () => console.log('Listening in port ' + PORT));

/* 
{
	"username": "bopeesponja", 
	"avatar": "https://cdn.shopify.com/s/files/1/0150/0643/3380/files/Screen_Shot_2019-07-01_at_11.35.42_AM_370x230@2x.png" 
}

{
	"username": "bopeesponja",
    "tweet": "Eu amo hambúrguer de siri!"
}
*/


app.get('/', (req, res) => {
    res.send('Main Page')
})

