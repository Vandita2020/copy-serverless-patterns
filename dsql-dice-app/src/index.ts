import { env, ray } from '@aws/lambda-lite';
import type { Dsql } from '@aws/lambda-lite/binding-dsql';

const NAME_PATTERN = /^[a-zA-Z ]{2,30}$/;
const randInt = (min: number, max: number) => Math.floor(min + Math.random() * (max + 1 - min));

const app = ray();
app.get('/', app.check.query('name').matches(NAME_PATTERN), app.check.query('rolls').isInt().toInt(), async (req, res) => {
  const errors = app.check.validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const { name, rolls } = app.check.matchedData(req);
  const result = await env.get<Dsql>('MY_DATABASE')
    .query('SELECT time, roll FROM rolls WHERE name = $1 ORDER BY time DESC LIMIT $2', [name, rolls]);
  res.json({ rolls: result.rows });
});
app.post('/', app.json(), app.check.body('name').matches(NAME_PATTERN), async (req, res) => {
  const errors = app.check.validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  const { name } = app.check.matchedData(req);
  const roll = randInt(1, 6);
  console.log('Rolled', roll, 'for', name);
  await env.get<Dsql>('MY_DATABASE').query('INSERT INTO rolls VALUES ($1, $2, $3);', [new Date(), name, roll]);
  res.json({ roll });
});
app.serve();
