import { DataSource } from "typeorm";
import { Url } from "./entity/Url";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: true,
    entities: [Url],
});
