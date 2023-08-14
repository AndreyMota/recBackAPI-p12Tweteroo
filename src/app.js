import express from "express";
import cors from 'cors';

function obterUltimosElementos(array) {
    const tamanhoArray = array.length;
    const quantidadeRetorno = Math.min(tamanhoArray, 10); // Obter o mínimo entre o tamanho do array e 10
    const ultimosElementos = array.slice(tamanhoArray - quantidadeRetorno);
    return ultimosElementos;
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
    const obj = obterUltimosElementos(tweets);
    res.send(obj);
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

