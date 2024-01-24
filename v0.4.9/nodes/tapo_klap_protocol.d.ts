/// <reference types="node" />
/// <reference types="node" />
import { Cipher, KeyPairKeyObjectResult } from 'node:crypto';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
export type Json_T = {
    [any: string]: any;
};
export type Cause = {
    error_code: number;
    message: string;
    agent: string;
};
export type Method_Exp = (any: any) => any;
export declare const supportEnergyUsage: string[];
export declare enum ErrorCode {
    ERROR_AXIOS_ERROR = 1,
    ERROR_TAPRES_JSON_INVALID = 2,
    ERROR_AXIOS_FORBID = 3,
    GENERIC_ERROR = 99,
    ERROR_KL_ENCRYPT_FMT = 101,
    ERROR_KL_ENCRYPT_IV_LENGTH = 102,
    ERROR_CH_UNABLE_KEYS = 103,
    ERROR_SNOW_WORKER_ID = 104,
    ERROR_SNOW_DATA_CENTER_ID = 105,
    ERROR_SNOW_INVALID_TIME_ID = 106,
    ERROR_aSP_bAX_REQ_ERR = 201,
    ERROR_aSP_bAX_REQ_FORBID = 202,
    ERROR_aSP_bAX_INVALID_URL = 203,
    ERROR_aSR_bSR_RET_ERR = 301,
    ERROR_aSR_bSR_MAX_RET = 302,
    ERROR_aSR_bSP_REQ_ERR = 303,
    ERROR_aSR_bSP_REJ = 304,
    ERROR_aSR_DEV_FORBID = 305,
    ERROR_aSR_DEV_GENERAL = 399,
    ERROR_aPH2_bSP_HSK_ERROR = 401,
    ERROR_aPH1_bSP_HSK_ERROR = 402,
    ERROR_aPH2_bSP_HSK_REJ = 411,
    ERROR_aPH_bSP_HSK_REJ = 412,
    ERROR_aPH1_bSP_HSK_MISSMATCH = 421,
    ERROR_aPH1_bSP_HSK_FORBID = 431,
    ERROR_aPH_bSP_HSK_FORBID = 432,
    ERROR_aPH_bPH1_HSK_ERROR = 441,
    ERROR_aSR_bPH_HSK_ERROR = 442,
    ERROR_aLG_bS_TOKEN_NOT_FOUND = 451,
    ERROR_aLG_bPH_HSK_TIMEOUT = 452,
    ERROR_aLG_bS_TOKEN_ERROR = 453,
    ERROR_aLG_bPH_HSK_ERROR = 454,
    ERROR_aGP_INCOMPLETE = 501,
    ERROR_aGP_GUESS = 502,
    ERROR_FUNC_GENERAL = 601,
    ERROR_CLOUD_CONN_REJ = 602,
    ERROR_DEVICE_INFO = 603,
    ERROR_CLOUD_NO_DEVICE_LIST = 604,
    ERROR_ALIAS_NOT_FOUND = 605,
    ERROR_FUNC_VALID_COLOR = 651,
    ERROR_FUNC_TEMP_COLOR = 652,
    ERROR_FUNC_HEX_COLOR = 653,
    ERROR_FUNC_KEY_LENGTH = -1010,
    ERROR_FUNC_BAD_CREDENTIALS = -1501,
    ERROR_FUNC_BAD_REQUEST = -1002,
    ERROR_FUNC_BAD_JSON = -1003,
    ERROR_FUNC_WRONG_EMAIL = -20601,
    ERROR_FUNC_CLOUD_TOKEN_EXPIRED = -20675,
    ERROR_FUNC_DEV_TOKEN_EXPIRED = 9999,
    ERROR_FUNC_UNEXPECTED = 19999
}
export declare enum ErrorMsg {
    ERROR_AXIOS_ERROR = "Axios error: ",
    ERROR_TAPRES_JSON_INVALID = "Invalid JSON answer: ",
    ERROR_AXIOS_FORBID = "Negotiation error: ",
    GENERIC_ERROR = "General error: ",
    ERROR_KL_ENCRYPT_FMT = "Encryption error: ",
    ERROR_KL_ENCRYPT_IV_LENGTH = "Encryption error: ",
    ERROR_CH_UNABLE_KEYS = "Encryption error: ",
    ERROR_SNOW_WORKER_ID = "Encryption error: ",
    ERROR_SNOW_DATA_CENTER_ID = "Encryption error: ",
    ERROR_SNOW_INVALID_TIME_ID = "Encryption error: ",
    ERROR_aSP_bAX_REQ_ERR = "Device comm error: ",
    ERROR_aSP_bAX_REQ_FORBID = "Device comm rejected: ",
    ERROR_aSP_bAX_INVALID_URL = "URL not valid: ",
    ERROR_aSR_bSR_RET_ERR = "Instant retry error: ",
    ERROR_aSR_bSR_MAX_RET = "Max retries reached: ",
    ERROR_aSR_bSP_REQ_ERR = "Device request error: ",
    ERROR_aSR_bSP_REJ = "Device comm rejected: ",
    ERROR_aSR_DEV_FORBID = "Device comm rejected: ",
    ERROR_aSR_DEV_GENERAL = "Device comm error: ",
    ERROR_aPH2_bSP_HSK_ERROR = "Handshake error: ",
    ERROR_aPH1_bSP_HSK_ERROR = "Handshake error: ",
    ERROR_aPH2_bSP_HSK_REJ = "Handshare rejected: ",
    ERROR_aPH_bSP_HSK_REJ = "Handshare rejected: ",
    ERROR_aPH1_bSP_HSK_MISSMATCH = "Handshake error: ",
    ERROR_aPH1_bSP_HSK_FORBID = "Handshare rejected: ",
    ERROR_aPH_bSP_HSK_FORBID = "Handshare rejected: ",
    ERROR_aPH_bPH1_HSK_ERROR = "Handshake error: ",
    ERROR_aSR_bPH_HSK_ERROR = "Handshake error: ",
    ERROR_aLG_bS_TOKEN_NOT_FOUND = "Handshake error: ",
    ERROR_aLG_bPH_HSK_TIMEOUT = "Handshake timeout: ",
    ERROR_aLG_bS_TOKEN_ERROR = "Handshake error: ",
    ERROR_aLG_bPH_HSK_ERROR = "Handshake error: ",
    ERROR_aGP_INCOMPLETE = "Protocol not detected: ",
    ERROR_aGP_GUESS = "Protocol not detected: ",
    ERROR_FUNC_GENERAL = "General functional error: ",
    ERROR_CLOUD_CONN_REJ = "Cloud connection rejected: ",
    ERROR_DEVICE_INFO = "Device comm error: ",
    ERROR_CLOUD_NO_DEVICE_LIST = "Cloud empty list: ",
    ERROR_ALIAS_NOT_FOUND = "Alias not found: ",
    ERROR_FUNC_VALID_COLOR = "Color not valid: ",
    ERROR_FUNC_TEMP_COLOR = "Color not valid: ",
    ERROR_FUNC_HEX_COLOR = "Color not valid: ",
    ERROR_FUNC_KEY_LENGTH = "Encryption error: ",
    ERROR_FUNC_BAD_CREDENTIALS = "Bad credentials: ",
    ERROR_FUNC_BAD_REQUEST = "Device request error: ",
    ERROR_FUNC_BAD_JSON = "Invalid JSON answer: ",
    ERROR_FUNC_WRONG_EMAIL = "Bad credentials: ",
    ERROR_FUNC_CLOUD_TOKEN_EXPIRED = "Token expired: ",
    ERROR_FUNC_DEV_TOKEN_EXPIRED = "Token expired: ",
    ERROR_FUNC_UNEXPECTED = "Unexpected error: "
}
export declare enum TapoProtocolType {
    PASSTHROUGH = 1,
    KLAP = 2,
    AUTO = 3
}
export declare class AuthCredential {
    username: string;
    password: string;
    constructor(user?: string, passwd?: string);
}
export declare class TapoClient {
    private _auth_credential;
    _url: string;
    private _http_session;
    _protocol: TapoProtocol;
    _terminal_random: boolean;
    actions: {
        [any: string]: (any: any) => any;
    };
    constructor(auth_credential: AuthCredential, url: string, protocol?: TapoProtocol, http_session?: AxiosInstance, terminal_random?: boolean);
    create(credential: AuthCredential, address: string, port?: number, is_https?: boolean, http_session?: AxiosInstance, protocol_type?: TapoProtocolType): TapoClient;
    private _initialize_protocol_if_needed;
    private _guess_protocol;
    perform_handshake(protocol?: TapoProtocolType): Promise<TapoClient>;
    send_request(request: TapoRequest, protocol?: TapoProtocolType): Promise<TapoResponse<Json_T>>;
    close(): void;
    execute_raw_request(request: TapoRequest, protocol?: TapoProtocolType, retry?: number): Promise<Json_T>;
    get_component_negotiation(protocol?: TapoProtocolType, retry?: number): Promise<Components>;
    get_device_info(protocol?: TapoProtocolType): Promise<Json_T>;
    get_current_power(protocol?: TapoProtocolType): Promise<Json_T>;
    get_energy_usage(protocol?: TapoProtocolType): Promise<Json_T>;
    set_device_info(params: Json_T, protocol?: TapoProtocolType): Promise<Json_T>;
    turn_onoff_device(params?: boolean, protocol?: TapoProtocolType): Promise<Json_T>;
    set_color_device(params?: string, protocol?: TapoProtocolType): Promise<Json_T>;
    set_brightness_device(params?: number, protocol?: TapoProtocolType): Promise<Json_T>;
    get_child_device_list(params?: number, protocol?: TapoProtocolType): Promise<Json_T>;
    list_methods(): any;
}
export declare class TapoRequest {
    method: string;
    params: object;
    requestID: number;
    request_time_millis: number;
    terminal_uuid: string;
    constructor(method?: string, params?: object);
    handshake(params: HandshakeParams): TapoRequest;
    login(credential: AuthCredential, v2?: boolean): TapoRequest;
    cloud_login(credential: AuthCredential): TapoRequest;
    cloud_list_devices(): TapoRequest;
    secure_passthrough(params: SecurePassthroughParams): TapoRequest;
    get_device_info(): TapoRequest;
    get_device_usage(): TapoRequest;
    get_energy_usage(): TapoRequest;
    set_device_info(params: Json_T): TapoRequest;
    turn_onoff_device(params: boolean): TapoRequest;
    set_color_device(params: string): TapoRequest;
    set_brightness_device(params: number): TapoRequest;
    get_current_power(): TapoRequest;
    get_child_device_list(start_index: number): TapoRequest;
    get_child_device_component_list(): TapoRequest;
    multiple_request(requests: MultipleRequestParams): TapoRequest;
    control_child(device_id: string, request: TapoRequest): TapoRequest;
    get_temperature_humidity_records(): TapoRequest;
    component_negotiation(): TapoRequest;
    with_request_id(request_id: number): TapoRequest;
    with_request_time_millis(t: number): TapoRequest;
    with_terminal_uuid(uuid: string): TapoRequest;
    get_params(): object;
    get_method(): string;
    __eq__(other: TapoRequest): boolean;
}
export declare class TapoResponse<Json_T> {
    error_code: number;
    result: any;
    msg?: string;
    constructor(err?: number, res?: any, mg?: string);
    try_from_json(json: Json_T): Promise<TapoResponse<Json_T>>;
    check_Error(): Promise<void>;
}
export declare class HandshakeParams {
    key: object;
    constructor(key: object);
}
export declare class LoginDeviceParams {
    password: string;
    username: string;
    constructor(user: string, pass: string);
}
export declare class LoginDeviceParamsV2 {
    password2: string;
    username: string;
    constructor(user: string, pass: string);
}
export declare class SecurePassthroughParams {
    request: string;
    constructor(request: string);
}
export declare class PaginationParams {
    start_index: number;
    constructor(idx: number);
}
export declare class MultipleRequestParams {
    requests: TapoRequest[];
}
export declare class ControlChildParams {
    device_id: string;
    requestData: TapoRequest;
    constructor(device: string, request: TapoRequest);
}
export declare class Components {
    component_list: Json_T;
    constructor(list?: Json_T);
    try_from_json(data: Json_T): Components;
}
export declare class ColorParams {
    preset: {
        blue: {
            hue: number;
            saturation: number;
            color_temp: number;
        };
        red: {
            hue: number;
            saturation: number;
            color_temp: number;
        };
        yellow: {
            hue: number;
            saturation: number;
            color_temp: number;
        };
        green: {
            hue: number;
            saturation: number;
            color_temp: number;
        };
        white: {
            color_temp: number;
        };
        daylightwhite: {
            color_temp: number;
        };
        warmwhite: {
            color_temp: number;
        };
    };
    private HEXtoHSL;
    private temperature;
    get_color(color: string): Json_T;
}
export declare abstract class TapoProtocol {
    abstract _base_url: string;
    abstract _host: string;
    abstract _auth_credential: AuthCredential;
    abstract _http_session: AxiosInstance;
    abstract _session: TapoSession;
    abstract _jar: Json_T;
    abstract _protocol_type: TapoProtocolType;
    abstract _terminal_random: boolean;
    abstract perform_handshake(): any;
    abstract send_request(request: TapoRequest, retry?: number): Promise<TapoResponse<any>>;
    abstract close(): any;
}
export declare abstract class TapoSession {
    abstract chiper: TapoChiper;
    abstract session_id: string;
    abstract expire_at: number;
    abstract handshake_complete: boolean;
    abstract terminal_uuid: string;
    abstract get_cookies(): [Json_T, string];
    abstract is_handshake_session_expired(): boolean;
    abstract invalidate(): any;
    abstract complete_handshake(chiper: TapoChiper): TapoSession;
}
export declare abstract class TapoChiper {
    abstract _key: Buffer;
    abstract _iv: Buffer;
}
export declare class TapoError {
    error_code: number;
    message: string;
    agent: string;
    cause?: Cause;
    track?: TapoError;
    constructor(message?: string, track?: TapoError, code?: number, agent?: string);
    axios_to_tapo(axios: AxiosError): TapoError;
    get_current_cause(): Cause;
}
export declare class KlapProtocol extends TapoProtocol {
    _base_url: string;
    _host: string;
    _auth_credential: AuthCredential;
    _local_seed: Buffer | null;
    local_auth_hash: Buffer;
    _jar: Json_T;
    _http_session: AxiosInstance;
    _session: KlapSession | null;
    _request_id_generator: SnowflakeId;
    _protocol_type: TapoProtocolType;
    _terminal_random: boolean;
    constructor(auth_credential: AuthCredential, url: string, http_session?: AxiosInstance, terminal_random?: boolean);
    generate_auth_hash(auth: AuthCredential): Buffer;
    _sha1(payload: Buffer): Buffer;
    _sha256(payload: Buffer): Buffer;
    session_post(url: string, data: any, cookies?: any, params?: any): Promise<[AxiosResponse, Buffer]>;
    perform_handshake(new_local_seed?: Buffer): Promise<KlapSession>;
    perform_handshake1(new_local_seed?: Buffer): Promise<[Buffer, Buffer]>;
    perform_handshake2(local_seed: Buffer, remote_seed: Buffer, auth_hash: Buffer): Promise<KlapSession>;
    send_request(request: TapoRequest, retry?: number): Promise<TapoResponse<Json_T>>;
    _send_request(request: TapoRequest, retry?: number): Promise<TapoResponse<Json_T>>;
    close(): Promise<void>;
}
export declare class KlapSession extends TapoSession {
    chiper: KlapChiper;
    session_id: string;
    expire_at: number;
    handshake_complete: boolean;
    terminal_uuid: string;
    constructor(session: string, timeout: number, expire?: boolean, terminal?: string, hsk?: boolean, chip?: KlapChiper);
    get_cookies(): [Json_T, string];
    is_handshake_session_expired(): boolean;
    invalidate(): void;
    complete_handshake(chiper: KlapChiper): KlapSession;
}
export declare class KlapChiper extends TapoChiper {
    _key: Buffer;
    _iv: Buffer;
    _seq: number;
    _sig: Buffer;
    constructor(local_seed: Buffer, remote_seed: Buffer, user_hash: Buffer);
    encrypt(msg: string | Buffer): [Buffer, number];
    decrypt(msg: Buffer): string;
    private _key_derive;
    private _iv_derive;
    private _sig_derive;
    private _iv_seq;
}
export declare class PassthroughProtocol extends TapoProtocol {
    _base_url: string;
    _host: string;
    _auth_credential: AuthCredential;
    _http_session: AxiosInstance;
    _session: Session;
    _jar: Json_T;
    _request_id_generator: SnowflakeId;
    _protocol_type: TapoProtocolType;
    _terminal_random: boolean;
    constructor(auth_credential: AuthCredential, url: string, http_session?: AxiosInstance, terminal_random?: boolean);
    create_key_pair(key_size?: number): Promise<KeyPairKeyObjectResult>;
    session_post(url: string, data: any, cookies?: any, params?: any): Promise<AxiosResponse>;
    perform_handshake(url?: string): Promise<Session>;
    _login_with_version(is_trying_v2?: boolean): Promise<Session>;
    send_request(request: TapoRequest, retry?: number): Promise<TapoResponse<Json_T>>;
    _send_request(request: TapoRequest, retry?: number): Promise<TapoResponse<Json_T>>;
    send(request: TapoRequest, session?: Session): Promise<TapoResponse<Json_T>>;
    close(): Promise<void>;
}
export declare class Session extends TapoSession {
    chiper: Chiper;
    session_id: string;
    expire_at: number;
    handshake_complete: boolean;
    url: string;
    key_pair: KeyPairKeyObjectResult;
    token: string;
    terminal_uuid: string;
    constructor(session: string, timeout: number, expire?: boolean, url?: string, terminal?: string, keypair?: KeyPairKeyObjectResult, hsk_req?: boolean, chip?: Chiper);
    get_cookies(): [Json_T, string];
    is_handshake_session_expired(): boolean;
    invalidate(): void;
    complete_handshake(chiper: Chiper): Session;
}
export declare class Chiper extends TapoChiper {
    _key: Buffer;
    _iv: Buffer;
    cipher: Cipher;
    constructor(key?: Buffer, iv?: Buffer);
    create_from_keypair(handshake_key: string, keypair: KeyPairKeyObjectResult): Chiper;
    private readDeviceKey;
    decrypt(msg: string | Buffer): string;
    encrypt(msg: string | Buffer): string;
}
export declare class SnowflakeId {
    private EPOCH;
    private WORKER_ID_BITS;
    private DATA_CENTER_ID_BITS;
    private SEQUENCE_BITS;
    private MAX_WORKER_ID;
    private MAX_DATA_CENTER_ID;
    private SEQUENCE_MASK;
    worker_id: number;
    data_center_id: number;
    sequence: number;
    last_timestamp: number;
    constructor(worker_id: number, data_certer_id: number);
    generate_id(): Promise<number>;
    private _wait_next_millis;
}
export declare enum TapoDevicesType {
    PLUG = "SMART.TAPOPLUG",
    BULB = "SMART.TAPOBULB",
    CAMERA = "SMART.IPCAMERA"
}
export declare class TapoDevice {
    _api: TapoClient;
    deviceType: string;
    fwVer: string;
    appServerUrl: string;
    deviceRegion: string;
    deviceId: string;
    deviceName: string;
    deviceHwVer: string;
    alias: string;
    deviceMac: string;
    oemId: string;
    deviceModel: string;
    hwId: string;
    fwId: string;
    isSameRegion: boolean;
    status: number;
    ip: string;
    terminal_random?: boolean;
    constructor(terminal_random?: boolean, api?: TapoClient);
    raw_command(method: string, params: Json_T, protocol?: TapoProtocolType): Promise<Json_T>;
    get_device_info(protocol?: TapoProtocolType): Promise<TapoDeviceInfo>;
    get_energy_usage(protocol?: TapoProtocolType): Promise<TapoEnergyUsage>;
    turn_onoff_device(status: boolean, protocol?: TapoProtocolType): Promise<Json_T>;
    set_color_device(color: string, protocol?: TapoProtocolType): Promise<Json_T>;
    set_brightness_device(level: number, protocol?: TapoProtocolType): Promise<Json_T>;
    send_request(request: TapoRequest, protocol?: TapoProtocolType): Promise<Json_T>;
    get_state_as_json(protocol?: TapoProtocolType): Promise<Json_T>;
    get_component_negotiation(protocol?: TapoProtocolType): Promise<Components>;
    get_device_by_IP(auth_credential: AuthCredential, ip: string, protocol?: TapoProtocol): Promise<TapoDevice>;
    get_device_by_alias(auth_credential: AuthCredential, alias: string, range_ip?: string): Promise<TapoDevice>;
    cloud_login(auth_credential: AuthCredential): Promise<string>;
    list_devices(cloudToken: string): Promise<Array<TapoDevice>>;
    list_devices_by_type(cloudToken: string, deviceType: string): Promise<Array<TapoDevice>>;
    private augment_TapoDevice;
    private isTapoDevice;
    private resolve_MAC_to_IP;
    private tidy_MAC;
}
export type TapoResuls = {
    result: boolean;
    tapoDeviceInfo?: TapoDeviceInfo;
    tapoEnergyUsage?: TapoDeviceInfo | undefined;
    tapoComponents?: Components | undefined;
    tapoCommand?: Json_T | undefined;
    errorInf?: Error;
    device?: TapoDevice;
};
export type TapoDeviceInfo = {
    device_id: string;
    fw_ver: string;
    hw_ver: string;
    type: string;
    model: string;
    mac: string;
    hw_id: string;
    fw_id: string;
    oem_id: string;
    specs: string;
    device_on: boolean;
    on_time: number;
    overheated: boolean;
    nickname: string;
    location: string;
    avatar: string;
    time_usage_today: string;
    time_usage_past7: string;
    time_usage_past30: string;
    longitude: string;
    latitude: string;
    has_set_location_info: boolean;
    ip: string;
    ssid: string;
    signal_level: number;
    rssi: number;
    region: string;
    time_diff: number;
    lang: string;
};
export type TapoEnergyUsage = TapoDeviceInfo;
