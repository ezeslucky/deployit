/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'ssh2' {
    import { EventEmitter } from 'events';
  
    export interface ConnectConfig {
      host: string;
      port?: number;
      username: string;
      password?: string;
      privateKey?: string | Buffer;
    }
  
    export class Client extends EventEmitter {
	  shell(arg0: {}, arg1: (err: any, stream: any) => void) {
		  throw new Error("Method not implemented.");
	  }
      connect(config: ConnectConfig): void;
      exec(command: string, callback: (err: Error | null, stream: any) => void): void;
      end(): void;
      on(event: string, listener: (...args: any[]) => void): this;
    }
  }
  