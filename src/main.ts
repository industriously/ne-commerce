import { CORS_ORGIN } from '@COMMON/constants';
import { bootstrap, listen } from './application';

const main = async () => {
  const app = await bootstrap({
    bufferLogs: true,
    cors: { credentials: true, origin: CORS_ORGIN },
  });

  await listen(app);
};

main();
