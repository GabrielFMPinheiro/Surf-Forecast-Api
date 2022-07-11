import './util/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { Application } from 'express';
import { ForecastController } from '@src/controllers/forecast';
import * as database from '@src/database';
import { BeachesController } from '@src/controllers/beaches';
import { UserController } from '@src/controllers/users';
import logger from './logger';
import cors from 'cors';
import expressPino from 'express-pino-logger';

export class SetupServer extends Server {
  constructor(private PORT = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(expressPino({ logger }));
    this.app.use(
      cors({
        origin: '*',
      })
    );
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UserController();
    this.addControllers([
      forecastController,
      beachesController,
      usersController,
    ]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }

  public start(): void {
    this.app.listen(this.PORT, () =>
      logger.info(`Server listening on port ${this.PORT}`)
    );
  }
}
