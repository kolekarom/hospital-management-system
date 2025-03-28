declare module 'ipfs-http-client' {
  export interface IPFSHTTPClient {
    add(data: string | Buffer): Promise<{ path: string }>;
    cat(path: string): AsyncIterable<Uint8Array>;
  }

  export function create(options: {
    host: string;
    port: number;
    protocol: string;
    headers?: {
      authorization: string;
    };
  }): IPFSHTTPClient;
}
