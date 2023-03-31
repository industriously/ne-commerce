import { Configuration } from '@INFRA/config';
import { prisma } from '@INFRA/DB';
import { DynamicExecutor } from '@nestia/e2e';
import { IConnection } from '@nestia/fetcher';
import { bootstrap, close, listen } from '@APP';
import path from 'path';
import { createWriteStream } from 'fs';
import stripAnsi from 'strip-ansi';

const testStream = createWriteStream(
  path.join(__dirname, './../../test_log.md'),
  { flags: 'w' },
);
const write = process.stdout.write.bind(process.stdout);
process.stdout.write = (str: string): boolean => {
  testStream.write(stripAnsi(str));
  return write(str);
};

process.on('exit', () => {
  testStream.end();
});

console.log('# Test Report\n');

async function run(): Promise<void> {
  const app = await bootstrap({ logger: false });
  await listen(app, Configuration.PORT);

  const connection: IConnection = {
    host: `http://localhost:${Configuration.PORT}`,
  };

  const report = await DynamicExecutor.validate({
    prefix: 'test',
    parameters: () => [connection],
  })(__dirname + '/features');

  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await close(app);

  const errors: Error[] = report.executions
    .filter((line) => line.error !== null)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map<Error>((result) => result.error!);

  if (errors.length === 0) {
    console.log('\n\x1b[32mAll Tests Passed\x1b[0m');
    console.log(
      '\nTotal Test Time:\x1b[33m',
      report.time.toLocaleString(),
      '\x1b[0mms',
    );
  } else {
    console.log('\n\x1b[31mSome Tests Failed\x1b[0m');
    for (const error of errors) console.error(error);
    process.exit(-1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(-1);
});
