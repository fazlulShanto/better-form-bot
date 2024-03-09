require('dotenv').config();
import { startBot } from './bot';
import validateEnv from './utils/validate.env';

const startServer = () => {
  console.clear();
  console.log('Last Run: ', new Date().toLocaleTimeString());
  const env = validateEnv();
  startBot(env.DISCORD_BOT_TOKEN);
};

// const main = async () => {
//   startServer();
// };

// main();
startServer();
