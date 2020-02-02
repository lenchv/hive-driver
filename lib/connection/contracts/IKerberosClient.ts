export interface IKerberosClient {
    /**
     * This method should encode data via GSSAPI
     * @param payload base64 string
     * @param data any data for wrapping
     * @param cb 
     */
    wrap(payload: string, data: object, cb: Function): any;

    /**
     * This method shoud decode GSSAPI package
     * @param payload base64 string
     * @param cb 
     */
    unwrap(payload: string, cb: Function): any;
};
