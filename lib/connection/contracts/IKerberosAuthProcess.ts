export interface IKerberosAuthProcess {
    /**
     * This method should initiate the kerberos process and return IKerberosClient
     * @param username 
     * @param password 
     * @param cb 
     */
    init(username: string, password: string, cb: Function): void;

    /**
     * This method should process three SASL steps. The pyalod should be wrapped/unwrapped with kerberos client
     * @param payload 
     * @param cb 
     */
    transition(payload: Buffer | string, cb: Function): void;
}
