import { cleanEnv, str, url } from "envalid";

const envSource = process.env;

const validateEnv = () => {
  const env = cleanEnv(envSource, {
    DISCORD_BOT_TOKEN: str(),
    SERVER_API_KEY: str(),
    DASHBOARD_URL: url({ devDefault: "http://localhost:5005" }),
    NODE_ENV: str({ choices: ["dev", "production", "staging"] }),
  });
  return env;
};

export default validateEnv;
