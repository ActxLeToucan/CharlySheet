import dotenv from 'dotenv';
import { cleanEnv, num, port, str } from 'envalid';

dotenv.config();

const validateEnv = () => {
    // eslint-disable-next-line n/no-process-env
    return cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'test', 'production', 'staging']
        }),
        LOG_DIR: str({ default: '/logs' }),
        LOG_FORMAT: str({ default: 'combined' }),
        ORIGIN: str({ default: '*' }),
        PORT: port({ default: 3000 }),
        MONGO_URI: str(),
        JWT_SECRET: str(),
        EXPIRES_IN: str({ default: '1d' }),
        COOLDOWN_SHEET_CREATION: num({ default: 10 })
    });
};

export default validateEnv;
