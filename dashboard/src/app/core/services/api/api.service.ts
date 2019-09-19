import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import { JsonRPCService } from './json-rpc.service';
import { JsonRPCParam } from '../../entities/api/jsonRPCParam';
import { IModel } from '../../entities/IModel';

export class ApiService<T extends IModel> {
  _entities$ = new BehaviorSubject<T[]>([]);
  _entity$ = new BehaviorSubject<T>(null);

  // todo: seperate multiple loaded & single loaded
  protected _loading$ = new BehaviorSubject<boolean>(false);
  protected _loaded$ = new BehaviorSubject<boolean>(false);

  constructor(private _httpClient: HttpClient, private _jsonRPCService: JsonRPCService, protected _method: string) {}

  // ===== Get ======
  get entities$(): Observable<T[]> {
    return this._entities$;
  }

  get entities(): T[] {
    return this._entities$.value;
  }

  get entity$(): Observable<T> {
    return this._entity$;
  }

  get entity(): T {
    return this._entity$.value;
  }

  get loading(): boolean {
    return this._loading$.value;
  }

  // ====== Update Observable ======
  updateEntityArray(newItem: T) {
    const auxArray = this._entities$.value;
    for (let i = 0; i < auxArray.length; i = i + 1) {
      if (auxArray[i]._id === newItem._id) {
        auxArray[i] = newItem;
      }
    }
    this._entities$.next(auxArray);
  }

  // ==== CRUD ======
  public load(parameters: object = {}): Observable<T[]> {
    this._loading$.next(true);
    const jsonRPCParam = new JsonRPCParam(`${this._method}:list`, parameters);
    return this._jsonRPCService.callOne(jsonRPCParam).pipe(
      map((data) => data.data),
      tap((data) => {
        this._entities$.next(data);
        this._loaded$.next(true);
      }),
      finalize(() => {
        this._loading$.next(false);
      }),
    );
  }

  public loadOne(parameters: object = {}): Observable<T[]> {
    this._loading$.next(true);
    const jsonRPCParam = new JsonRPCParam(`${this._method}:find`, parameters);
    return this._jsonRPCService.callOne(jsonRPCParam).pipe(
      map((data) => data.data),
      tap((data) => {
        this._entity$.next(data);
        this._loaded$.next(true);
      }),
      finalize(() => {
        this._loading$.next(false);
      }),
    );
  }

  public get(itemId: string): Observable<T> {
    const jsonRPCParam = new JsonRPCParam(`${this._method}:get`, itemId);
    this._loading$.next(true);
    return this._jsonRPCService.callOne(jsonRPCParam).pipe(
      map((data) => data.data),
      finalize(() => {
        this._loading$.next(false);
      }),
    );
  }

  public getOne(itemId: string): Observable<T> {
    const jsonRPCParam = new JsonRPCParam(`${this._method}:get`, itemId);
    this._loading$.next(true);
    return this._jsonRPCService.callOne(jsonRPCParam).pipe(
      map((data) => data.data),
      tap((entity: T) => {
        this._entity$.next(entity);
        console.log(`created ${this._method} id=${entity._id}`);
      }),
      finalize(() => {
        this._loading$.next(false);
      }),
    );
  }

  public create(item: object): Observable<T> {
    if ('_id' in item) {
      delete item['_id'];
    }
    const jsonRPCParam = new JsonRPCParam(`${this._method}:create`, item);
    return this._jsonRPCService.callOne(jsonRPCParam).pipe(
      map((data) => data.data),
      tap((entity) => {
        const auxArray = this._entities$.value;
        auxArray.push(entity);
        this._entities$.next(auxArray);
        console.log(`created ${this._method} id=${entity._id}`);
      }),
    );
  }

  public createOne(item: object): Observable<T> {
    const jsonRPCParam = new JsonRPCParam(`${this._method}:create`, item);
    return this._jsonRPCService.callOne(jsonRPCParam).pipe(
      map((data) => data.data),
      tap((entity: T) => {
        this._entity$.next(entity);
        console.log(`created ${this._method} id=${entity._id}`);
      }),
    );
  }

  // TODO: gilles make id mandatory
  public patch(item: T, id: string = item._id): Observable<T> {
    const jsonRPCParam = JsonRPCParam.createPatchParam(`${this._method}:patch`, item, id);

    return this._jsonRPCService.callOne(jsonRPCParam).pipe(
      map((data) => data.data),
      tap((entity: T) => {
        console.log(`updated ${this._method} id=${entity._id}`);

        this._entity$.next(entity);

        const auxArray = this._entities$.value;
        if (auxArray) {
          const ind = auxArray.findIndex((aItem) => aItem._id === entity._id);
          if (ind !== -1) {
            auxArray.splice(ind, 1, entity);
            this._entities$.next(auxArray);
          }
        }
      }),
    );
  }

  public patchOne(item: T): Observable<T> {
    const jsonRPCParam = new JsonRPCParam(`${this._method}:patch`, item);

    return this._jsonRPCService.callOne(jsonRPCParam).pipe(
      map((data) => data.data),
      tap((entity: T) => {
        console.log(`updated ${this._method} id=${entity._id}`);
        this._entity$.next(entity);
      }),
    );
  }

  public delete(id: string): Observable<T> {
    const jsonRPCParam = new JsonRPCParam(`${this._method}:delete`, { _id: id });
    return this._jsonRPCService.callOne(jsonRPCParam).pipe(
      map((data) => data.data),
      tap(() => {
        const auxArray = this._entities$.value;
        const itemDeletedIdx = auxArray.findIndex((entity) => {
          return entity._id === id;
        });
        if (itemDeletedIdx) {
          auxArray.splice(itemDeletedIdx, 1);
        }
        this._entities$.next(auxArray);
        console.log(`deleted ${this._method} id=${id}`);
      }),
    );
  }

  public deleteOne(item: T): Observable<T> {
    const jsonRPCParam = new JsonRPCParam(`${this._method}:delete`, item);
    return this._jsonRPCService.callOne(jsonRPCParam).pipe(
      map((data) => data.data),
      tap(() => {
        this._entity$.next(null);
        console.log(`deleted ${this._method} id=${item._id}`);
      }),
    );
  }
}
