import { IKerberosClient } from "../../contracts/IKerberosClient";
import { KerberosInitializeOptions } from "../../types/KerberosInitializeOptions";

enum TransitionState {
    STEP_1,
    STEP_2,
    STEP_3,
    STEP_4,
}

export class KerberosStep {
    private step: TransitionState;
    private client: IKerberosClient;
    private options: KerberosInitializeOptions;
    private attempts: number;

    constructor(client: IKerberosClient, options: KerberosInitializeOptions) {
        this.step = TransitionState.STEP_1;
        this.client = client;
        this.attempts = 10;
        this.options = options;
    }

    execute(payload: string, cb: Function) {
        switch(this.step) {
            case TransitionState.STEP_1:
                return this.first(payload, cb);
            case TransitionState.STEP_2:
                return this.second(payload, cb);
            case TransitionState.STEP_3:
                return this.third(payload, cb);
            case TransitionState.STEP_4:
                return this.fourth(payload, cb);
            default:
                throw new Error('Kerberos transition does not exist: ' + this.step);
        }
    }

    first(payload: string, cb: Function) {
        this.client.step(payload, (error: Error, challenge: string) => {
            if (error) {
                cb(error);
            }

            this.step = TransitionState.STEP_2;

            cb(null, challenge);
        });
    }

    second(payload: string, cb: Function) {
        this.client.step(payload, (error: Error, challenge: string) => {
            if (error) {
                if (this.attempts <= 0) {
                    return cb(error);
                } else {
                    this.attempts--;

                    return this.second(payload, cb);
                }
            }

            this.step = TransitionState.STEP_3;

            cb(null, challenge);
        });
    }

    third(payload: string, cb: Function) {
        this.client.unwrap(payload, (error: Error, data: string) => {
            if (error) {
                return cb(error);
            }

            const qop = Buffer.from(data, 'base64')[0];

            this.client.wrap(data, {
                user: this.options.username
            }, (error: Error, response: string) => {
                if (error) {
                    return cb(error);
                }
                
                this.step = TransitionState.STEP_4;

                cb(null, response, qop);
            });
        });
    }

    fourth(payload: string, cb: Function) {
        throw new Error('Process has finished');
    }
} 
