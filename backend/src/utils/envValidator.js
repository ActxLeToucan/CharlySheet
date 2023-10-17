import { cleanEnv, port, str } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

const validateEnv = () => {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'test', 'production', 'staging']
        }),
        PORT: port({ default: 3000 }),
        MONGO_URI: str()
    });
};

export default validateEnv;
