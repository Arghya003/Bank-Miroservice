import { DataSource } from "typeorm";
import { User } from "./entity/user.entity";
import { Credential } from "./entity/credential.entity";
import { config } from "./config";

export const AppDataSource= new DataSource({
    type:'postgres',
    url:config.DATABASE_URL,
    synchronize:true,
    logging:true,
    entities:[User,Credential],
 

})