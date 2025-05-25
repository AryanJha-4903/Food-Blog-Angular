import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import SecureStorage from 'secure-web-storage';
import * as CryptoJS from 'crypto-js';

const SECRET_KEY = 'aryankoutilyajha4903127025262729';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private secureStorage: any;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser && typeof localStorage !== 'undefined') {
      this.secureStorage = new SecureStorage(localStorage, {
        hash(key: string) {
          return CryptoJS.SHA256(key + SECRET_KEY).toString();
        },
        encrypt(data: string) {
          return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
        },
        decrypt(data: string) {
          return CryptoJS.AES.decrypt(data, SECRET_KEY).toString(CryptoJS.enc.Utf8);
        }
      });
    }
  }

  setItem(key: string, value: any): void {
    if (this.isBrowser && this.secureStorage) {
      this.secureStorage.setItem(key, value);
    }
  }

  getItem(key: string): any {
    if (this.isBrowser && this.secureStorage) {
      return this.secureStorage.getItem(key);
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.isBrowser && this.secureStorage) {
      this.secureStorage.removeItem(key);
    }
  }

  clear(): void {
    if (this.isBrowser && this.secureStorage) {
      this.secureStorage.clear();
    }
  }
}
