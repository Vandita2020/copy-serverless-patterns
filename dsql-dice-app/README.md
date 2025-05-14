# DSQL dice app

An implementation of the classic [BuildIt](https://w.amazon.com/bin/view/AWS/Serverless/Developer_Advocate_Team/Content/BuildIt) exercise, which tasks participants with creating a REST API to simulate dice rolls and persist them to a database. The equivalent app for Cloudflare Workers can be seen [here](https://quip-amazon.com/YxMJA5DaTsk9/willigaus-experience-using-Cloudflare-Workers#temp:C:GJV693d2923c0184a1b8842d37cc).

Before testing locally you'll need to create the following table:

```sql
CREATE TABLE IF NOT EXISTS rolls (
  time TIMESTAMP NOT NULL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  roll INTEGER NOT NULL
);
```

Then you can run some `curl` commands:

```sh
curl -s 'http://localhost:8080?name=bob&rolls=5' | jq .
curl -s -X POST -H 'Content-Type: application/json' -d '{"name":"bob"}' 'http://localhost:8080' | jq .
```

To execute queries using the CLI:

```sh
brazil-build-tool-exec npm run -s lite -w=dsql-dice-app -- binding --id MY_DATABASE query "SELECT CURRENT_TIMESTAMP;"
```
