import * as http from "http";
import * as express from "express";
import * as path from "path";

export class ServerBoostrap {

    // Declarar atributos 
    private app!: express.Application;

    constructor(pp:express.Application) {
        this.app = pp;
    }

    init(): Promise<boolean> {
        

        return new Promise((resolve, reject) => {
            const server = http.createServer(this.app);
            const PORT = process.env.PORT || 4000;
            server.listen(PORT)
            .on("listening",() => {
                console.log(`server is runing on port ${PORT}`);
                resolve(true);
            })

            .on("error",(err: Error) => {
                console.error(`Error starting server on port ${err}`);
                reject(false);
            });
        })
    }
}