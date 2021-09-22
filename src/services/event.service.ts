import { Service } from "typedi";

@Service()
export class EventService {
    private _listeners: Map<string, Array<(data: any) => void>> = new Map();

    public register(eventName: string, context: any, callback: (data: any) => void): void {
        let listeners: Array<(data: any) => void> = this._listeners.get(eventName);
        if (!listeners) {
            listeners = [];
        }

        listeners.push(callback.bind(context));
        this._listeners.set(eventName, listeners);
    }

    public raise(eventName: string, data: any): void {
        let listeners: Array<(data: any) => void> = this._listeners.get(eventName);
        if (listeners) {
            for (let listener of listeners) {
                listener(data);
            }
        }
    }
}