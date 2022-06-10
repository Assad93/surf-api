import "./util/module-alias";
import { Server } from "@overnightjs/core";
import express, { Application } from "express";
import { ForecastController } from "./controllers/forecast";

export class SetupServer extends Server {
  constructor(private port = 5000) {
    super();
  }

  public init() {
    this.setupServer();
    this.setupControllers();
  }

  private setupServer() {
    this.app.use(express.json());
  }

  private setupControllers() {
    const forecastController = new ForecastController();
    this.addControllers([forecastController]);
  }

  public getApp(): Application {
    return this.app;
  }
}
