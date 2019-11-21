import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService as WebStorageService } from 'ngx-webstorage-service';

@Injectable()
export class StorageService {
  constructor(
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
  ) { }

  public has<T>(storageKey: string): boolean {
    return this.storage.has(storageKey);
  }

  public get<T>(storageKey: string): T {
    return this.storage.get(storageKey);
  }

  public set<T>(storageKey: string, value: T): void {
    this.storage.set(storageKey, value);
  }

  public remove(storageKey: string): void {
    this.storage.remove(storageKey);
  }
}
