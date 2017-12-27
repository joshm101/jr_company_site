import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { AppModel } from './app.model';

@Injectable()
/**
 * CacheService<AppModel> is a class that every model's
 * service will use to maintain a single source of truth for
 * all data of type AppModel (base). 
 * 
 * EmbedPostService, for example, needs to use the API service
 * to make network calls and store the results of this network
 * calls in some sort of cache. This is a dedicated class for
 * that caching mechanism so that better separation of concerns
 * is achieved.
 */
export class CacheService<Model extends AppModel> {
  private items: BehaviorSubject<Model[]>;
  public items$: Observable<Model[]>;

  constructor() {
    this.items = new BehaviorSubject<Model[]>([]);
    this.items$ = this.items.asObservable();
  }

  /**
   * Sets the next emitted value by the this.items
   * BehaviorSubject to the given items parameter
   * @param {Model[]} items to be next emitted value by cache
   */
  public setCache(items: Model[] = []) {
    this.items.next(
      [...items]
    );
  }

  /**
   * Appends the given item to the cache array and
   * sets that resulting array as the next emitted  
   * value by the this.items BehaviorSubject
   * @param {Model} item item to append to cache array
   */
  public appendToCache(item: Model) {
    this.items.next(
      [
        ...this.items.value,
        item
      ]
    );
  }

  /**
   * Prepends the given item to the cache array and
   * and sets that resulting array as the next emitted
   * value by the this.items BehaviorSubject
   * @param {Model} item item to prepend to cache array
   */
  public prependToCache(item: Model) {
    this.items.next(
      [
        item,
        ...this.items.value
      ]
    );
  }

  /**
   * Pops the last item from the cache array. The
   * resulting array is the next emitted value by 
   * the this.items BehaviorSubject
   */
  public popFromCache() {
    let items = [...this.items.value];
    items.pop();
    this.items.next(
      items
    );
  }

  /**
   * Removes item from cache whose _id field
   * matches the provided id. this.items
   * BehaviorSubject emits the array that
   * results from removing the item with
   * the given id from the old array.
   * @param {string} id id of item to remove
   */
  public removeFromCache(id: string) {
    let index = this.findIndexById(id);

    // emit new cache value which is the old array
    // without the item whose _id field matches
    // the given id parameter
    this.items.next(
      [
        ...this.items.value.slice(0, index),
        ...this.items.value.slice(index + 1)
      ]
    );
  }

  /**
   * Finds the location of the item in the array
   * whose _id field matches the _id field of the
   * given item parameter. That location in the
   * array is replaced with the item parameter
   * (update). this.items BehaviorSubject emits
   * the array that results from applying the
   * update.
   * @param {Model} item updated item data
   */
  public updateCacheItem(item: Model) {
    if (this.itemIsInCache(item)) {
      const index = this.findIndexById(item._id);
      this.items.next(
        [
          ...this.items.value.slice(0, index),
          item,
          ...this.items.value.slice(index + 1)
        ]
      );
    } else {
      this.appendToCache(item);
    }
  }

  public retrieveCacheItemById(id: string) {
    return this.items.asObservable().map(items => {
      let foundItem: Model = undefined;
      items.forEach(item => {
        if (item._id === id) {
          foundItem = item;
        }
      });
      return foundItem;
    });
  }

  public itemIsInCache(item: Model) {
    let index = this.findIndexById(item._id);
    if (index === undefined) { 
      return false; 
    }
    return true;
  }

  /**
   * Sets cache to empty array. Next value emitted
   * by this.items BehaviorSubject is an empty array
   */
  public clearCache() {
    this.items.next([]);
  }

  /**
   * Searches through the cache array to find the
   * index of the item whose _id field matches
   * the given id parameter.
   * @param {string} id id of item to find index of
   * @return {number} index of item with _id field === id param
   */
  private findIndexById(id: string) {
    let index: number = undefined;
    this.items.value.forEach((item, currentIndex) => {
      if (item._id === id) {
        index = currentIndex;
      }
    });
    return index;
  }
}