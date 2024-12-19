import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  log(message: string, ...args: any[]): void {
    console.log(message, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(message, ...args);
  }

  info(message: string, ...args: any[]): void {
    console.info(message, ...args);
  }
}
