import workerTxt from './worker.txt.js';

export interface ISearchResult {
  length: number;
  offset: number;
  sequence: string;
}

export interface ISearchInput {
  strings: string[];
  searchText: string;
}

function makeWorker() {
  const blob = new Blob([workerTxt], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const w = new Worker(url);
  return w;
}

export class AsyncSearcher {
  private worker: Worker | null;
  private solution: ISearchResult[];
  private promise: Promise<ISearchResult[]> | null;
  private isPending: boolean;
  constructor() {
    this.worker = null;
    this.solution = [];
    this.promise = null;
    this.isPending = false;
  }

  public async compute(input: ISearchInput) {
    if (this.isPending) {
      return this.promise;
    }
    if (this.worker) {
      this.worker.terminate();
    }
    this.promise = new Promise(resolve => {
      this.isPending = true;
      const worker = makeWorker();
      this.worker = worker;
      worker.postMessage(input);
      worker.onmessage = event => {
        this.solution = event.data as ISearchResult[];
        resolve(this.solution);
        this.isPending = false;
      };
    });
    return this.promise;
  }
}

export const asyncSearcher = new AsyncSearcher();
