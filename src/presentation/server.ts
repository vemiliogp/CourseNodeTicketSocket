import express, { Router } from "express";
import path from "path";

interface Options {
  port: number;
  publicPath?: string;
}

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;

  constructor(options: Options) {
    const { port, publicPath = "public" } = options;
    this.port = port;
    this.publicPath = publicPath;

    this.configure();
  }

  private configure() {
    //* Middlewares
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    //* Public Folder
    this.app.use(express.static(this.publicPath));

    this.app.get(/^\/(?!api).*/, (req, res) => {
      const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
      res.sendFile(indexPath);
    });
  }

  public setRoutes(router: Router) {
    this.app.use(router);
  }

  async start() {
    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
