# Teste técnico da NG.CASH

##  Aplicaçao Full-stack Dokerizada usando TypeScript!

-------------

### - Front-end
- vite
- axios
- React-Bootstrap
- React-Hook-Form
- React-Router-Doom
### - Back-end
- TypeOrm
- JWT
- Bcrypt
### Banco de dados
- PostgreSql

-------
## Avisos importantes!
### No desenvolvimento deste projeto foi visado um tempo estimado de 7 dias, por isso foi feito algumas configuraçoes para acelarar a produçao.

---

- Projeto desenvolvido em mobile-first, mas tentando manter o maximo responsivel possivel

- Ao efetuar transferencia mandar somente numeros inteiro como "50, 5, 30", pois foi configurado para aceitar apenas numeros inteiros!

- Para visualizar a tabela de transferencias devera efetuar algumas transações, e recarregar a página

- Recarregar a página manualmente para atualizar tanto a tabela de transferencia quanto o seu "Saldo" atual!

- Infelizmente o TypeOrm está dando alguns problemas no projeto quando usado com docker, e não conseguindo conectar no banco de dados(Não sei o motivo)

- Com isso apenas o PostgreSql está funcinando dockerizado, o resto da aplicação necessita do NODE instalado na maquina

- O arquivo docker-compose.yml, está todo configurado, mas com partes comentadas para que não ocorra o erro citado á cima
-----


### - Venho trabalhando duro para corrigir esses erros, mas quis enviar a aplicação o quanto antes por medo de perder a oportunidade de entrar para o time de desenvolvimento brilhante que é o da NG.CASH

-------

#  Instruções para uso

- Primeiro vamos criar um conteiner com o postgres:

```
$ docker compose up -d
```

Navegue até a pasta da Api:
```
 $ cd server
```
Instale as dependecias:
```
 $ npm i
```
O comando abaixa irá criar as tabelas no Banco de Dados e deixar tudo pronto para uso:
```
 $ npm run migration:run
```
Ligue o servidor:
```
 $ npm run dev
```
Volte a pasta principla:
```
 $ cd ..
```
Entre na pasta client:
```
 $ cd cliente
```
Instale as dependecias:
```
 $ npm i
```
E já pode testar a aplicação funcionando com:
```
 $ npm run dev
```