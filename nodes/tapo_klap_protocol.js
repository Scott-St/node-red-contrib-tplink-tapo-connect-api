'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlugDeviceState = exports.PlugDevice = exports.TapoDevice = exports.TapoDevicesType = exports.SnowflakeId = exports.Chiper = exports.Session = exports.PassthroughProtocol = exports.KlapChiper = exports.KlapSession = exports.KlapProtocol = exports.TapoError = exports.TapoChiper = exports.TapoSession = exports.TapoProtocol = exports.ColorParams = exports.Components = exports.ControlChildParams = exports.MultipleRequestParams = exports.PaginationParams = exports.SecurePassthroughParams = exports.LoginDeviceParamsV2 = exports.LoginDeviceParams = exports.HandshakeParams = exports.TapoResponse = exports.TapoRequest = exports.TapoClient = exports.AuthCredential = exports.TapoProtocolType = exports.ErrorCode = exports.supportEnergyUsage = void 0;
// Import modules
const node_util_1 = require("node:util");
const node_crypto_1 = require("node:crypto");
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const local_devices_1 = __importDefault(require("local-devices"));
// Global constants for internal use
const RSA_CIPHER_ALGORITHM = 'rsa';
const AES_CIPHER_ALGORITHM = 'aes-128-cbc';
const PASSPHRASE = "top secret";
const TP_SESSION_COOKIE_NAME = "TP_SESSIONID";
const TP_TEST_USER = "test@tp-link.net";
const TP_TEST_PASSWORD = "test";
const CLOUD_URL = "https://eu-wap.tplinkcloud.com";
const MAX_RETRIES_GUESS = 18;
// Constants for supported Energy devices
exports.supportEnergyUsage = ["P110", "P115"];
// Constants for Error 
var ErrorCode;
(function (ErrorCode) {
    // ----------GENERAL ERROR (1-99)-------------------
    ErrorCode[ErrorCode["ERROR_AXIOS_ERROR"] = 1] = "ERROR_AXIOS_ERROR";
    ErrorCode[ErrorCode["ERROR_TAPRES_JSON_INVALID"] = 2] = "ERROR_TAPRES_JSON_INVALID";
    ErrorCode[ErrorCode["ERROR_AXIOS_FORBID"] = 3] = "ERROR_AXIOS_FORBID";
    ErrorCode[ErrorCode["GENERIC_ERROR"] = 99] = "GENERIC_ERROR";
    // ----------ENCRIPTION ERROR (101-199)-------------
    ErrorCode[ErrorCode["ERROR_KL_ENCRYPT_FMT"] = 101] = "ERROR_KL_ENCRYPT_FMT";
    ErrorCode[ErrorCode["ERROR_KL_ENCRYPT_IV_LENGTH"] = 102] = "ERROR_KL_ENCRYPT_IV_LENGTH";
    ErrorCode[ErrorCode["ERROR_CH_UNABLE_KEYS"] = 103] = "ERROR_CH_UNABLE_KEYS";
    ErrorCode[ErrorCode["ERROR_SNOW_WORKER_ID"] = 104] = "ERROR_SNOW_WORKER_ID";
    ErrorCode[ErrorCode["ERROR_SNOW_DATA_CENTER_ID"] = 105] = "ERROR_SNOW_DATA_CENTER_ID";
    ErrorCode[ErrorCode["ERROR_SNOW_INVALID_TIME_ID"] = 106] = "ERROR_SNOW_INVALID_TIME_ID";
    // ----------SESSION POST ERROR (201-299)-----------
    ErrorCode[ErrorCode["ERROR_aSP_bAX_REQ_ERR"] = 201] = "ERROR_aSP_bAX_REQ_ERR";
    ErrorCode[ErrorCode["ERROR_aSP_bAX_REQ_FORBID"] = 202] = "ERROR_aSP_bAX_REQ_FORBID";
    ErrorCode[ErrorCode["ERROR_aSP_bAX_INVALID_URL"] = 203] = "ERROR_aSP_bAX_INVALID_URL";
    // ----------SEND REQUEST ERROR (301-399)-----------
    ErrorCode[ErrorCode["ERROR_aSR_bSR_RET_ERR"] = 301] = "ERROR_aSR_bSR_RET_ERR";
    ErrorCode[ErrorCode["ERROR_aSR_bSR_MAX_RET"] = 302] = "ERROR_aSR_bSR_MAX_RET";
    ErrorCode[ErrorCode["ERROR_aSR_bSP_REQ_ERR"] = 303] = "ERROR_aSR_bSP_REQ_ERR";
    ErrorCode[ErrorCode["ERROR_aSR_bSP_REJ"] = 304] = "ERROR_aSR_bSP_REJ";
    ErrorCode[ErrorCode["ERROR_aSR_DEV_FORBID"] = 305] = "ERROR_aSR_DEV_FORBID";
    ErrorCode[ErrorCode["ERROR_aSR_DEV_GENERAL"] = 399] = "ERROR_aSR_DEV_GENERAL";
    // ----------HANDSHAKE ERROR (401-499)--------------
    ErrorCode[ErrorCode["ERROR_aPH2_bSP_HSK_ERROR"] = 401] = "ERROR_aPH2_bSP_HSK_ERROR";
    ErrorCode[ErrorCode["ERROR_aPH1_bSP_HSK_ERROR"] = 402] = "ERROR_aPH1_bSP_HSK_ERROR";
    ErrorCode[ErrorCode["ERROR_aPH2_bSP_HSK_REJ"] = 411] = "ERROR_aPH2_bSP_HSK_REJ";
    ErrorCode[ErrorCode["ERROR_aPH_bSP_HSK_REJ"] = 412] = "ERROR_aPH_bSP_HSK_REJ";
    ErrorCode[ErrorCode["ERROR_aPH1_bSP_HSK_MISSMATCH"] = 421] = "ERROR_aPH1_bSP_HSK_MISSMATCH";
    ErrorCode[ErrorCode["ERROR_aPH1_bSP_HSK_FORBID"] = 431] = "ERROR_aPH1_bSP_HSK_FORBID";
    ErrorCode[ErrorCode["ERROR_aPH_bSP_HSK_FORBID"] = 432] = "ERROR_aPH_bSP_HSK_FORBID";
    ErrorCode[ErrorCode["ERROR_aPH_bPH1_HSK_ERROR"] = 441] = "ERROR_aPH_bPH1_HSK_ERROR";
    ErrorCode[ErrorCode["ERROR_aSR_bPH_HSK_ERROR"] = 442] = "ERROR_aSR_bPH_HSK_ERROR";
    ErrorCode[ErrorCode["ERROR_aLG_bS_TOKEN_NOT_FOUND"] = 451] = "ERROR_aLG_bS_TOKEN_NOT_FOUND";
    ErrorCode[ErrorCode["ERROR_aLG_bPH_HSK_TIMEOUT"] = 452] = "ERROR_aLG_bPH_HSK_TIMEOUT";
    ErrorCode[ErrorCode["ERROR_aLG_bS_TOKEN_ERROR"] = 453] = "ERROR_aLG_bS_TOKEN_ERROR";
    ErrorCode[ErrorCode["ERROR_aLG_bPH_HSK_ERROR"] = 454] = "ERROR_aLG_bPH_HSK_ERROR";
    // ----------GUESS PROTOCOL (501-599)--------------
    ErrorCode[ErrorCode["ERROR_aGP_INCOMPLETE"] = 501] = "ERROR_aGP_INCOMPLETE";
    ErrorCode[ErrorCode["ERROR_aGP_GUESS"] = 502] = "ERROR_aGP_GUESS";
    // ----------FUNCTIONAL ERROR----------------------
    ErrorCode[ErrorCode["ERROR_FUNC_GENERAL"] = 601] = "ERROR_FUNC_GENERAL";
    ErrorCode[ErrorCode["ERROR_CLOUD_CONN_REJ"] = 602] = "ERROR_CLOUD_CONN_REJ";
    ErrorCode[ErrorCode["ERROR_DEVICE_INFO"] = 603] = "ERROR_DEVICE_INFO";
    ErrorCode[ErrorCode["ERROR_CLOUD_NO_DEVICE_LIST"] = 604] = "ERROR_CLOUD_NO_DEVICE_LIST";
    ErrorCode[ErrorCode["ERROR_ALIAS_NOT_FOUND"] = 605] = "ERROR_ALIAS_NOT_FOUND";
    ErrorCode[ErrorCode["ERROR_FUNC_VALID_COLOR"] = 651] = "ERROR_FUNC_VALID_COLOR";
    ErrorCode[ErrorCode["ERROR_FUNC_TEMP_COLOR"] = 652] = "ERROR_FUNC_TEMP_COLOR";
    ErrorCode[ErrorCode["ERROR_FUNC_HEX_COLOR"] = 653] = "ERROR_FUNC_HEX_COLOR";
    ErrorCode[ErrorCode["ERROR_FUNC_KEY_LENGTH"] = -1010] = "ERROR_FUNC_KEY_LENGTH";
    ErrorCode[ErrorCode["ERROR_FUNC_BAD_CREDENTIALS"] = -1501] = "ERROR_FUNC_BAD_CREDENTIALS";
    ErrorCode[ErrorCode["ERROR_FUNC_BAD_REQUEST"] = -1002] = "ERROR_FUNC_BAD_REQUEST";
    ErrorCode[ErrorCode["ERROR_FUNC_BAD_JSON"] = -1003] = "ERROR_FUNC_BAD_JSON";
    ErrorCode[ErrorCode["ERROR_FUNC_WRONG_EMAIL"] = -20601] = "ERROR_FUNC_WRONG_EMAIL";
    ErrorCode[ErrorCode["ERROR_FUNC_CLOUD_TOKEN_EXPIRED"] = -20675] = "ERROR_FUNC_CLOUD_TOKEN_EXPIRED";
    ErrorCode[ErrorCode["ERROR_FUNC_DEV_TOKEN_EXPIRED"] = 9999] = "ERROR_FUNC_DEV_TOKEN_EXPIRED";
    ErrorCode[ErrorCode["ERROR_FUNC_UNEXPECTED"] = 19999] = "ERROR_FUNC_UNEXPECTED";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
// ****************************************************
// ***  TAPO CLASSES TO DEFINE TAPO CLIENT SESSIONS ***
// ****************************************************
// Class for TapoProtocol
var TapoProtocolType;
(function (TapoProtocolType) {
    TapoProtocolType[TapoProtocolType["PASSTHROUGH"] = 1] = "PASSTHROUGH";
    TapoProtocolType[TapoProtocolType["KLAP"] = 2] = "KLAP";
    TapoProtocolType[TapoProtocolType["AUTO"] = 3] = "AUTO";
})(TapoProtocolType = exports.TapoProtocolType || (exports.TapoProtocolType = {}));
// Class for Authentication credentials
class AuthCredential {
    constructor(user, passwd) {
        this.username = (typeof (user) == 'undefined' ? '' : user);
        this.password = (typeof (passwd) == 'undefined' ? '' : passwd);
        // Set the properties to false to avoid any change or access once created
        Object.defineProperty(this, 'username', { enumerable: false, writable: false, configurable: false });
        Object.defineProperty(this, 'password', { enumerable: false, writable: false, configurable: false });
    }
}
exports.AuthCredential = AuthCredential;
// Class for TapoClient - connection to every Tapo device
class TapoClient {
    // Constructor to initialize the class
    constructor(auth_credential, url, protocol, http_session, terminal_random) {
        this._auth_credential = auth_credential;
        let myURL = new URL("http:\\example.com");
        try {
            const myURL2 = new URL(url);
            myURL = myURL2;
        }
        catch (e) {
            myURL.protocol = 'http';
            myURL.hostname = url;
            myURL.port = '80';
            myURL.pathname = "/app";
        }
        this._url = myURL.href;
        this._http_session = (typeof (http_session) !== undefined ? http_session : null);
        this._protocol = (typeof (protocol) === undefined ? null : protocol);
        this._terminal_random = ((typeof (terminal_random) == 'undefined') ? false : terminal_random);
        // Create the list of functions
        this.actions = { 'list_methods': () => { return this.list_methods(); },
            'perform_handshake': (protocol) => { return this.perform_handshake(protocol); },
            'get_component_negotiation': (protocol) => { return this.get_component_negotiation(protocol); },
            'get_device_info': (protocol) => { return this.get_device_info(protocol); },
            'get_current_power': (protocol) => { return this.get_current_power(protocol); },
            'get_energy_usage': (protocol) => { return this.get_energy_usage(protocol); },
            'get_child_device_list': (params, protocol) => { return this.get_child_device_list(params, protocol); },
            'execute_raw_request': (request, protocol, retry) => { return this.execute_raw_request(request, protocol, retry); },
            'send_request': (request, protocol) => { return this.send_request(request, protocol); },
            'set_device_info': (params, protocol) => { return this.set_device_info(params, protocol); },
            'turn_onoff_device': (params, protocol) => { return this.turn_onoff_device(params, protocol); },
            'set_color_device': (params, protocol) => { return this.set_color_device(params, protocol); },
            'set_brightness_device': (params, protocol) => { return this.set_brightness_device(params, protocol); } };
        // Set the properties to false to avoid any change or access once created
        Object.defineProperty(this, '_auth_credential', { enumerable: false });
        Object.defineProperty(this, '_http_session', { enumerable: false });
        Object.defineProperty(this, '_protocol', { enumerable: false });
    }
    // Public method to create the client
    create(credential, address, port, is_https, http_session, protocol_type) {
        if (typeof (port) === undefined)
            port = 80;
        if (typeof (is_https) === undefined)
            is_https = false;
        if (typeof (http_session) === undefined)
            http_session = null;
        if (typeof (protocol_type) === undefined)
            protocol_type = TapoProtocolType.KLAP;
        const url = (is_https ? 'https' : 'http') + "://" + address + ":" + port + "/app";
        var protocol = null;
        if (protocol_type == TapoProtocolType.KLAP) {
            protocol = new KlapProtocol(credential, url, http_session);
        }
        else if (protocol_type == TapoProtocolType.PASSTHROUGH) {
            protocol = new PassthroughProtocol(credential, url, http_session);
        }
        return new TapoClient(credential, url, protocol, http_session);
    }
    // Private methods to setup the protocol
    async _initialize_protocol_if_needed(protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        if ((this._protocol == null) || ((this._protocol._protocol_type != proto) && (proto != TapoProtocolType.AUTO)))
            this._protocol = await this._guess_protocol(proto);
    }
    async _guess_protocol(protocol) {
        // Process parameters
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        // Process the ptotocol if it is not AUTO
        if (proto == TapoProtocolType.PASSTHROUGH) {
            // Try PASSTHROUGH protocol
            try {
                // Set PASSTHROGH and get the components
                console.debug("Set protocol to PASSTHROUGH");
                this._protocol = new PassthroughProtocol(this._auth_credential, this._url, this._http_session, this._terminal_random);
                const resp = await this.get_component_negotiation(proto, MAX_RETRIES_GUESS);
            }
            catch (error) {
                this.close();
                throw new TapoError('Negotiation not completed', error, ErrorCode.ERROR_aGP_INCOMPLETE, this._guess_protocol.name);
            }
            // Return the final protocol
            return this._protocol;
        }
        else if (proto == TapoProtocolType.KLAP) {
            // Try KLAP protocol
            try {
                // Set KLAP and get the components
                console.debug("Set protocol to KLAP");
                this._protocol = new KlapProtocol(this._auth_credential, this._url, this._http_session, this._terminal_random);
                const resp = await this.get_component_negotiation(proto, MAX_RETRIES_GUESS);
            }
            catch (error) {
                this.close();
                throw new TapoError('Negotiation not completed', error, ErrorCode.ERROR_aGP_INCOMPLETE, this._guess_protocol.name);
            }
            // Return the final protocol
            return this._protocol;
        }
        else {
            // Try first with PassthroughProtocol
            try {
                // Set Passthrough and get the components
                console.debug("Trying first with PassthroughProtocol");
                this._protocol = new PassthroughProtocol(this._auth_credential, this._url, this._http_session, this._terminal_random);
                const resp = await this.get_component_negotiation(TapoProtocolType.PASSTHROUGH, MAX_RETRIES_GUESS);
            }
            catch (err) {
                // Try to fallback to KLAP
                this.close();
                try {
                    // Set KLAP and get the components
                    console.debug("Default protocol not working. Fallback to KLAP");
                    this._protocol = new KlapProtocol(this._auth_credential, this._url, this._http_session, this._terminal_random);
                    const resp_klap = await this.get_component_negotiation(TapoProtocolType.KLAP, MAX_RETRIES_GUESS);
                }
                catch (error) {
                    this.close();
                    throw new TapoError('Negotiation not completed', error, ErrorCode.ERROR_aGP_INCOMPLETE, this._guess_protocol.name);
                }
            }
            ;
            // Return the final protocol
            return this._protocol;
        }
    }
    // Public protocol exposed methods for external control
    async perform_handshake(protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        await this._initialize_protocol_if_needed(proto);
        this._protocol._session = await this._protocol.perform_handshake();
        return this;
    }
    // Public method to expose protocol send request
    async send_request(request, protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        await this._initialize_protocol_if_needed(proto);
        if ((this._protocol._session === null) || (!this._protocol._session.handshake_complete) || (this._protocol._session.is_handshake_session_expired())) {
            this._protocol._session = await this._protocol.perform_handshake();
        }
        return this._protocol.send_request(request);
    }
    // Public method to close the session
    close() {
        if (this._protocol != null)
            this._protocol.close();
    }
    // Public methods to execute raw request
    async execute_raw_request(request, protocol, retry) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        await this._initialize_protocol_if_needed(proto);
        return await this._protocol.send_request(request, ((typeof (retry) == 'undefined') ? undefined : retry))
            .then((value) => {
            return value.result;
        });
    }
    // Public methods to execute different kind of requests
    async get_component_negotiation(protocol, retry) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        return new Components().try_from_json(await this.execute_raw_request(new TapoRequest().component_negotiation(), proto, retry));
    }
    async get_device_info(protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        return await this.execute_raw_request(new TapoRequest().get_device_info(), proto);
    }
    async get_current_power(protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        return await this.execute_raw_request(new TapoRequest().get_current_power(), proto);
    }
    async get_energy_usage(protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        return await this.execute_raw_request(new TapoRequest().get_energy_usage(), proto);
    }
    async set_device_info(params, protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        return await this.execute_raw_request(new TapoRequest().set_device_info(params), proto);
    }
    async turn_onoff_device(params, protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        return await this.execute_raw_request(new TapoRequest().turn_onoff_device((typeof (params) == 'undefined') ? false : params), proto);
    }
    async set_color_device(params, protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        return await this.execute_raw_request(new TapoRequest().set_color_device((typeof (params) == 'undefined') ? "white" : params), proto);
    }
    async set_brightness_device(params, protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        return await this.execute_raw_request(new TapoRequest().set_brightness_device((typeof (params) == 'undefined') ? 100 : params), proto);
    }
    async get_child_device_list(params, protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        return await this.execute_raw_request(new TapoRequest().get_child_device_list((typeof (params) == 'undefined') ? 0 : params), proto);
    }
    list_methods() {
        return Object.keys(this.actions);
    }
}
exports.TapoClient = TapoClient;
// Class for different TapoRequests
class TapoRequest {
    // Constructor to initialize the class
    constructor(method, params) {
        this.method = (typeof (method) == 'undefined' ? undefined : method);
        this.params = (typeof (params) == 'undefined' ? undefined : params);
    }
    // Define the different methods
    handshake(params) {
        this.method = "handshake";
        this.params = params;
        return this;
    }
    login(credential, v2) {
        this.method = "login_device";
        this.params = (((typeof (v2) == 'undefined') || (!v2)) ? new LoginDeviceParams(credential.username, credential.password) : new LoginDeviceParamsV2(credential.username, credential.password));
        return this;
    }
    cloud_login(credential) {
        this.method = "login";
        this.params = { "appType": "Tapo_Android", "cloudPassword": credential.password, "cloudUserName": credential.username, "terminalUUID": (0, uuid_1.v4)() };
        return this;
    }
    cloud_list_devices() {
        this.method = "getDeviceList";
        this.params = undefined;
        return this;
    }
    secure_passthrough(params) {
        this.method = "securePassthrough";
        this.params = params;
        return this;
    }
    get_device_info() {
        this.method = "get_device_info";
        this.params = undefined;
        return this;
    }
    get_device_usage() {
        this.method = "get_device_usage";
        this.params = undefined;
        return this;
    }
    get_energy_usage() {
        this.method = "get_energy_usage";
        this.params = undefined;
        return this;
    }
    set_device_info(params) {
        this.method = "set_device_info";
        this.params = params;
        return this;
    }
    turn_onoff_device(params) {
        this.method = "set_device_info";
        this.params = { "device_on": params };
        return this;
    }
    set_color_device(params) {
        this.method = "set_device_info";
        this.params = new ColorParams().get_color(params);
        return this;
    }
    set_brightness_device(params) {
        this.method = "set_device_info";
        this.params = { "brightness": Math.max(0, Math.min(params, 100)) };
        return this;
    }
    get_current_power() {
        this.method = "get_current_power";
        this.params = undefined;
        return this;
    }
    //   public set_lighting_effect(effect: LightEffect) : TapoRequest {
    //       return new TapoRequest("set_lighting_effect", effect);
    //   }
    get_child_device_list(start_index) {
        this.method = "get_child_device_list";
        this.params = new PaginationParams(start_index);
        return this;
    }
    get_child_device_component_list() {
        this.method = "get_child_device_component_list";
        this.params = undefined;
        return this;
    }
    multiple_request(requests) {
        this.method = "multipleRequest";
        this.params = undefined;
        return this;
    }
    control_child(device_id, request) {
        this.method = "control_child";
        this.params = new ControlChildParams(device_id, request);
        return this;
    }
    //   public get_child_event_logs(trigger_log_params: GetTriggerLogsParams) : TapoRequest {
    //       return new TapoRequest("get_trigger_logs", trigger_log_params);
    //   }
    get_temperature_humidity_records() {
        this.method = "get_temp_humidity_records";
        this.params = undefined;
        return this;
    }
    component_negotiation() {
        this.method = "component_nego";
        this.params = undefined;
        return this;
    }
    with_request_id(request_id) {
        this.requestID = request_id;
        return this;
    }
    with_request_time_millis(t) {
        this.request_time_millis = t;
        return this;
    }
    with_terminal_uuid(uuid) {
        this.terminal_uuid = uuid;
        return this;
    }
    get_params() {
        return this.params;
    }
    get_method() {
        return this.method;
    }
    __eq__(other) {
        if (!(other instanceof TapoRequest)) {
            return false;
        }
        else {
            return ((this.method === other.method) && (this.params === other.params));
        }
    }
}
exports.TapoRequest = TapoRequest;
// Class for different TapoResponses
class TapoResponse {
    // Constructor of the class
    constructor(err, res, mg) {
        this.error_code = (typeof (err) == 'undefined' ? 0 : err);
        this.result = (typeof (res) == 'undefined' ? null : res);
        this.msg = (typeof (mg) == 'undefined' ? '' : mg);
    }
    // Methods defined in the class
    async try_from_json(json) {
        // Process the response from server to get the three fields
        this.error_code = (typeof (json["error_code"]) == 'undefined' ? 0 : json["error_code"]);
        this.result = (typeof (json["result"]) == 'undefined' ? null : json["result"]);
        this.msg = (typeof (json["msg"]) == 'undefined' ? 'No message' : json["msg"]);
        // Return this same class instance
        await this.check_Error();
        return this;
    }
    // Private method to check functional errors
    async check_Error() {
        // Throw an error in case it is different from 0
        switch (this.error_code) {
            case 0: break;
            case -1010: throw new TapoError("Invalid public key length", null, ErrorCode.ERROR_FUNC_KEY_LENGTH, this.check_Error.name);
            case -1501: throw new TapoError("Invalid request or credentials", null, ErrorCode.ERROR_FUNC_BAD_CREDENTIALS, this.check_Error.name);
            case -1001: throw new TapoError("Incorrect request", null, ErrorCode.ERROR_FUNC_BAD_REQUEST, this.check_Error.name);
            case -1002: throw new TapoError("Incorrect request", null, ErrorCode.ERROR_FUNC_BAD_REQUEST, this.check_Error.name);
            case -1003: throw new TapoError("JSON format error", null, ErrorCode.ERROR_FUNC_BAD_JSON, this.check_Error.name);
            case -20601: throw new TapoError("Incorrect email or password", null, ErrorCode.ERROR_FUNC_WRONG_EMAIL, this.check_Error.name);
            case -20675: throw new TapoError("Cloud token expired or invalid", null, ErrorCode.ERROR_FUNC_CLOUD_TOKEN_EXPIRED, this.check_Error.name);
            case 9999: throw new TapoError("Device token expired or invalid", null, ErrorCode.ERROR_FUNC_DEV_TOKEN_EXPIRED, this.check_Error.name);
            default: throw new TapoError(`Unexpected Error Code: ${this.error_code} (${this.msg})`, null, ErrorCode.ERROR_FUNC_UNEXPECTED, this.check_Error.name);
        }
    }
}
exports.TapoResponse = TapoResponse;
// Class for different Request parameters
class HandshakeParams {
    //Constructor to initialize the class
    constructor(key) {
        this.key = key;
    }
}
exports.HandshakeParams = HandshakeParams;
class LoginDeviceParams {
    // Constructor to initialize the class
    constructor(user, pass) {
        this.username = Buffer.from((0, node_crypto_1.createHash)("sha1").update(user).digest('hex')).toString('base64');
        this.password = Buffer.from(pass).toString('base64');
    }
}
exports.LoginDeviceParams = LoginDeviceParams;
class LoginDeviceParamsV2 {
    // Constructor to initialize the class
    constructor(user, pass) {
        this.username = Buffer.from((0, node_crypto_1.createHash)("sha1").update(user).digest('hex')).toString('base64');
        this.password2 = Buffer.from((0, node_crypto_1.createHash)("sha1").update(pass).digest('hex')).toString('base64');
    }
}
exports.LoginDeviceParamsV2 = LoginDeviceParamsV2;
class SecurePassthroughParams {
    // Constructor
    constructor(request) {
        this.request = request;
    }
}
exports.SecurePassthroughParams = SecurePassthroughParams;
class PaginationParams {
    // Constructor to initialize the class
    constructor(idx) {
        this.start_index = idx;
    }
}
exports.PaginationParams = PaginationParams;
class MultipleRequestParams {
}
exports.MultipleRequestParams = MultipleRequestParams;
class ControlChildParams {
    // Constructor to initialize the class
    constructor(device, request) {
        this.device_id = device;
        this.requestData = request;
    }
}
exports.ControlChildParams = ControlChildParams;
class Components {
    // Constructor of the class
    constructor(list) {
        this.component_list = list;
    }
    // Methods of the class
    try_from_json(data) {
        const components = data["component_list"] || [];
        this.component_list = components.reduce((acc, c) => {
            acc[c["id"]] = c["ver_code"];
            return acc;
        }, {});
        return this;
    }
}
exports.Components = Components;
class ColorParams {
    constructor() {
        // Define constants for preset colors
        this.preset = {
            blue: {
                hue: 240,
                saturation: 100,
                color_temp: 0
            },
            red: {
                hue: 0,
                saturation: 100,
                color_temp: 0
            },
            yellow: {
                hue: 60,
                saturation: 100,
                color_temp: 0
            },
            green: {
                hue: 120,
                saturation: 100,
                color_temp: 0
            },
            white: {
                color_temp: 4500
            },
            daylightwhite: {
                color_temp: 5500
            },
            warmwhite: {
                color_temp: 2700
            }
        };
    }
    HEXtoHSL(hex) {
        // Check valid hex color
        if (hex.toLowerCase() === '#000000')
            throw new TapoError('Cannot set light to black', null, ErrorCode.ERROR_FUNC_HEX_COLOR, this.HEXtoHSL.name);
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        // Return i fnull color
        if (result == null)
            return;
        // Get RGB components
        let r = parseInt(result[1], 16);
        let g = parseInt(result[2], 16);
        let b = parseInt(result[3], 16);
        r /= 255, g /= 255, b /= 255;
        // Get Hue, Saturation and Brightness components
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        if (max == min) {
            h = s = 0; // achromatic
        }
        else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        s = s * 100;
        s = Math.round(s);
        l = l * 100;
        l = Math.round(l);
        h = Math.round(360 * h);
        // Return hue, saturation and brightness
        return { hue: h, saturation: s, brightness: l };
    }
    temperature(temp) {
        let t = parseInt(temp.slice(0, -1));
        if (t < 2500 || t > 6500)
            throw new TapoError('Colour temperature should be between 2500K and 6500K.', null, ErrorCode.ERROR_FUNC_TEMP_COLOR, this.temperature.name);
        return { color_temp: t };
    }
    get_color(color) {
        color = color.toLowerCase();
        if (color.startsWith('#'))
            return this.HEXtoHSL(color);
        if (color.endsWith('k'))
            return this.temperature(color);
        if (Object.keys(this.preset).includes(color))
            return this.preset[color] || "";
        throw new TapoError('Invalid Color', null, ErrorCode.ERROR_FUNC_VALID_COLOR, this.get_color.name);
    }
}
exports.ColorParams = ColorParams;
// *********************************************
// ***  TAPO CLASSES TO DEFINE TAPO PROTOCOL ***
// *********************************************
// Class for abstract TapoProtocol
class TapoProtocol {
}
exports.TapoProtocol = TapoProtocol;
// Class for abstract TapoSession
class TapoSession {
}
exports.TapoSession = TapoSession;
// Class for abstract TapoChiper
class TapoChiper {
}
exports.TapoChiper = TapoChiper;
// Class to manage TapoErrors
class TapoError {
    // Constructor of the class
    constructor(message, track, code, agent) {
        // Define first the non-recursive properties
        this.error_code = (typeof (code) == 'undefined') ? ErrorCode.GENERIC_ERROR : code;
        this.message = (typeof (message) == 'undefined' ? '' : message);
        this.agent = agent;
        // Define the recursive ones taking care of the non-recursive already defined and availability ot track and track.cause
        this.track = ((typeof (track) == 'undefined') || (track == null)) ? undefined : track;
        if ((typeof (track) == 'undefined') || (track == null) || (!(track instanceof TapoError))) {
            this.cause = { error_code: this.error_code, message: this.message, agent: this.agent };
        }
        else if ((typeof (track.cause) == 'undefined') || (track.cause == null)) {
            this.cause = track.get_current_cause();
        }
        else {
            this.cause = track.cause;
        }
        // Delete the empty objects on track and cause
        if ((typeof (this.track) != 'undefined') && (track != null)) {
            delete this.track.cause;
        }
        else {
            delete this.track;
        }
    }
    //Public method to transfer Axios to Tapo
    axios_to_tapo(axios) {
        if (axios.code == "ERR_BAD_REQUEST") {
            this.error_code = ErrorCode.ERROR_AXIOS_FORBID;
        }
        else {
            this.error_code = ErrorCode.ERROR_AXIOS_ERROR;
        }
        this.message = axios.code + ' - ' + axios.message;
        this.agent = axios.name;
        this.cause = { message: this.message, error_code: this.error_code, agent: this.agent };
        return this;
    }
    // Public method to get the Cause
    get_current_cause() {
        return { error_code: this.error_code, message: this.message, agent: this.agent };
    }
}
exports.TapoError = TapoError;
// *********************************************
// ***  KLAP CLASSES TO DEFINE KLAP PROTOCOL ***
// *********************************************
// Class for Klap Protocol definition
class KlapProtocol extends TapoProtocol {
    // Constructor to initialize the class
    constructor(auth_credential, url, http_session, terminal_random) {
        super();
        this._base_url = url;
        this._host = (new URL(this._base_url)).hostname;
        this._auth_credential = auth_credential;
        this.local_auth_hash = this.generate_auth_hash(this._auth_credential);
        this._local_seed = null;
        this._jar = null;
        this._http_session = (typeof (http_session) == 'undefined' ? axios_1.default.create({ baseURL: url }) : http_session);
        this._session = null;
        this._protocol_type = TapoProtocolType.KLAP;
        this._terminal_random = ((typeof (terminal_random) == 'undefined') ? false : terminal_random);
        this._request_id_generator = new SnowflakeId(1, 1);
        // Set the properties to false to avoid any change or access once created
        Object.defineProperty(this, '_auth_credential', { enumerable: false });
        Object.defineProperty(this, '_http_session', { enumerable: false });
        Object.defineProperty(this, '_session', { enumerable: false });
        Object.defineProperty(this, '_jar', { enumerable: false });
        Object.defineProperty(this, 'local_auth_hash', { enumerable: false });
        Object.defineProperty(this, '_local_seed', { enumerable: false });
    }
    // Private method to generate Authentication hash
    generate_auth_hash(auth) {
        return this._sha256(Buffer.concat([
            this._sha1(Buffer.from(new node_util_1.TextEncoder().encode(auth.username))),
            this._sha1(Buffer.from(new node_util_1.TextEncoder().encode(auth.password)))
        ]));
    }
    _sha1(payload) {
        return (0, node_crypto_1.createHash)("sha1").update(payload).digest();
    }
    _sha256(payload) {
        return (0, node_crypto_1.createHash)("sha256").update(payload).digest();
    }
    // Private method to post a session
    async session_post(url, data, cookies, params) {
        this._jar = null;
        const config = { url: url, method: 'post', data: data, headers: (typeof (cookies) == 'undefined' ? undefined : { 'Cookie': cookies }), params: (typeof (params) == 'undefined' ? undefined : params), responseType: 'arraybuffer' };
        const response = await axios_1.default.request(config)
            .then((value) => {
            // Check status of the answer
            if (value.status != 200) {
                throw new TapoError('URL error - ' + value.status, null, ErrorCode.ERROR_aSP_bAX_REQ_FORBID, this.session_post.name);
            }
            else {
                // Get the cookies
                if (value.headers.hasOwnProperty('set-cookie')) {
                    const cookies = value.headers['set-cookie'][0].split(';');
                    for (let i = 0; i < cookies.length; i++) {
                        if (cookies[i].includes('=')) {
                            this._jar = { ...this._jar, [cookies[i].split('=')[0]]: cookies[i].split('=')[1] };
                        }
                    }
                }
                // Return value
                return value;
            }
        })
            .catch((error) => {
            throw new TapoError('Session_post error - Axios', new TapoError().axios_to_tapo(error), ErrorCode.ERROR_aSP_bAX_REQ_ERR, this.session_post.name);
        });
        // Build and return the array of response
        const empty = JSON.stringify({});
        return [response, (((response.data != null) && (typeof (response.data) != 'undefined')) ? Buffer.from(response.data) : Buffer.from(empty))];
    }
    // Private method Handshake to perform the full Handshake and get a valid KlapSession
    async perform_handshake(new_local_seed) {
        console.debug("[KLAP] Starting handshake with " + this._host);
        const seeds = await this.perform_handshake1((typeof (new_local_seed) == 'undefined' ? undefined : new_local_seed))
            .then(async (value) => {
            const [remote_seed, auth_hash] = value;
            const session = await this.perform_handshake2(this._local_seed, remote_seed, auth_hash)
                .then((value) => {
                console.debug("[KLAP] Handshake with " + this._host + " complete");
                return value;
            });
            return session;
        })
            .catch((error) => {
            throw new TapoError("Handshake error - " + error.message, error, ErrorCode.ERROR_aPH_bPH1_HSK_ERROR, this.perform_handshake.name);
        });
        return seeds;
    }
    // Private method Handshake1 to get remote_seed and auth_hash
    async perform_handshake1(new_local_seed) {
        // Set local seed as random 16 bytes seed if not provided
        this._local_seed = (typeof (new_local_seed) == 'undefined' ? Buffer.from(node_crypto_1.webcrypto.getRandomValues(new Uint8Array(16))) : new_local_seed);
        // Prepare post parameters
        this._session = null;
        const url = this._base_url + "/handshake1";
        // Send the request and check if servers answers with HTTP200
        const seeds = await this.session_post(url, this._local_seed)
            .then((value) => {
            if (value[0].status != 200) {
                throw new TapoError("Device failed to respond to handshake1 with " + value[0].status, null, ErrorCode.ERROR_aPH1_bSP_HSK_FORBID, this.perform_handshake1.name);
            }
            else {
                // Define a new KlapSession object for the session and retrieve parameters - Session_id, Timeout, remote_seed and server_hash
                const terminal_uuid = (this._terminal_random ? node_crypto_1.webcrypto.randomUUID() : (0, uuid_1.v4)());
                this._session = new KlapSession(this._jar[TP_SESSION_COOKIE_NAME], parseInt(this._jar["TIMEOUT"], 10), false, terminal_uuid);
                const remote_seed = value[1].subarray(0, 16);
                const server_hash = value[1].subarray(16);
                // Information for debugging
                console.debug("Handshake1 posted " + new Date().getTime() + ". Host is " + this._host + ", Session cookie is " + this._session.session_id + ", Response status is " + value[0].status + ", Request was " + this.local_auth_hash.toString('hex'));
                console.debug("Server remote_seed is " + remote_seed.toString('hex') + ", server hash is " + server_hash.toString('hex'));
                // Build the local seed auth hash
                const local_seed_auth_hash = this._sha256(Buffer.from(new Uint8Array([...this._local_seed, ...remote_seed, ...this.local_auth_hash])));
                // Check the locally generated hash with the server one
                if (Buffer.compare(local_seed_auth_hash, server_hash) == 0) {
                    console.debug("Handshake1 hashes matched");
                    return [remote_seed, this.local_auth_hash];
                }
                else {
                    // Check blank auth 
                    console.debug("Expected " + local_seed_auth_hash.toString('hex') + " got " + server_hash.toString('hex') + " in handshake1. Checking if blank auth is a match");
                    const blank_auth = new AuthCredential();
                    const blank_auth_hash = this.generate_auth_hash(blank_auth);
                    const blank_seed_auth_hash = this._sha256(Buffer.from(new Uint8Array([...this._local_seed, ...remote_seed, ...blank_auth_hash])));
                    if (Buffer.compare(blank_seed_auth_hash, server_hash) == 0) {
                        console.debug("Server response doesn't match our expected hash on ip " + this._host + " but an authentication with blank credentials matched");
                        return [remote_seed, blank_auth_hash];
                    }
                    else {
                        // Check kasa setup auth
                        const kasa_setup_auth = new AuthCredential(TP_TEST_USER, TP_TEST_PASSWORD);
                        const kasa_setup_auth_hash = this.generate_auth_hash(kasa_setup_auth);
                        const kasa_setup_seed_auth_hash = this._sha256(Buffer.from(new Uint8Array([...this._local_seed, ...remote_seed, ...kasa_setup_auth_hash])));
                        if (Buffer.compare(kasa_setup_seed_auth_hash, server_hash) == 0) {
                            this.local_auth_hash = kasa_setup_auth_hash;
                            console.debug("Server response doesn't match our expected hash on ip " + this._host + " but an authentication with kasa setup credentials matched");
                            return [remote_seed, kasa_setup_auth_hash];
                        }
                        else {
                            this._session = null;
                            console.debug("Server response doesn't match our challenge on ip " + this._host);
                            throw new TapoError("Server response doesn't match our challenge on ip " + this._host, null, ErrorCode.ERROR_aPH1_bSP_HSK_MISSMATCH, this.perform_handshake1.name);
                        }
                    }
                }
            }
        })
            .catch((error) => {
            throw new TapoError("Handshake1 error -" + error.message, error, ErrorCode.ERROR_aPH1_bSP_HSK_ERROR, this.perform_handshake1.name);
        });
        return seeds;
    }
    // Private method Handshake2 to get a valid KlapSession
    async perform_handshake2(local_seed, remote_seed, auth_hash) {
        // Prepare post parameters - Handshake2 uses the remote seed, local seed and auth hash to check answer from server
        const url = this._base_url + "/handshake2";
        const payload = this._sha256(Buffer.from(new Uint8Array([...remote_seed, ...local_seed, ...auth_hash])));
        // Send the request and check if server answers with HTTP 200
        const response = await this.session_post(url, payload, this._session.get_cookies()[1])
            .then((value) => {
            console.debug("Handshake2 posted " + new Date().getTime() + ". Host is " + this._host + ", Response status is " + value[0].status + ", Request was " + payload.toString());
            if (value[0].status != 200) {
                if (this._session != null) {
                    this._session.invalidate();
                }
                throw new TapoError("Device responded with " + value[0].status + " to handshake2", null, ErrorCode.ERROR_aPH2_bSP_HSK_REJ, this.perform_handshake2.name);
            }
            else {
                const chiper = new KlapChiper(local_seed, remote_seed, auth_hash);
                return this._session.complete_handshake(chiper);
            }
        })
            .catch((error) => {
            throw new TapoError("Device responded with " + error.message + " to handshake2", error, ErrorCode.ERROR_aPH2_bSP_HSK_ERROR, this.perform_handshake2.name);
        });
        return response;
    }
    // Public method to send a request with 3 retries
    async send_request(request, retry) {
        const retr = (typeof (retry) == 'undefined' ? 3 : retry);
        const response = await this._send_request(request, retr)
            .then((value) => { return value; })
            .catch(async (error) => {
            if (retr > 0) {
                try {
                    return await this.send_request(request, retr - 1);
                }
                catch (error) {
                    throw new TapoError("Send request failed - Retry nº " + retr.toString(), error, ErrorCode.ERROR_aSR_bSR_RET_ERR, this.send_request.name);
                }
            }
            else {
                throw new TapoError("Send request max retries failed", error, ErrorCode.ERROR_aSR_bSR_MAX_RET, this.send_request.name);
            }
        });
        return response;
    }
    // Public method to send every request
    async _send_request(request, retry) {
        // Check if there is an existing valid session - create one if it does not
        if ((this._session == null) || !(this._session.handshake_complete)) {
            const new_session = await this.perform_handshake()
                .then((value) => {
                this._session = value;
                return value;
            })
                .catch((error) => {
                throw new TapoError("Send request error", error, ErrorCode.ERROR_aSR_bPH_HSK_ERROR, this._send_request.name);
            });
        }
        // Convert request into a JSON string and encrypt request
        request.with_request_id(await this._request_id_generator.generate_id()).with_terminal_uuid(this._session.terminal_uuid).with_request_time_millis(Math.round(new Date().getTime()));
        const raw_request = JSON.stringify(request);
        const [payload, seq] = this._session.chiper.encrypt(raw_request);
        const url = this._base_url + '/request';
        const response = await this.session_post(url, payload, this._session.get_cookies()[1], { 'seq': seq })
            .then(async (value) => {
            // Check handled errors
            if (value[0].status != 200) {
                console.debug('Query failed after successful authentication at ' + new Date().getTime() + '. Host is ' + this._host + '. Available attempts count is ' + retry + '. Sequence is ' + seq + '. Response status is ' + value[0].status + '. Request was ' + raw_request);
                if (value[0].status == 403) {
                    if (this._session != null) {
                        this._session.invalidate();
                    }
                    throw new TapoError("Forbidden error after completing handshake", null, ErrorCode.ERROR_aSR_DEV_FORBID, this._send_request.name);
                }
                else {
                    throw new TapoError("Device " + this._host + " error code " + value[0].status + " with seq " + seq, null, ErrorCode.ERROR_aSR_DEV_GENERAL, this._send_request.name);
                }
            }
            else {
                const svr_answer = await (new TapoResponse()).try_from_json(JSON.parse(this._session.chiper.decrypt(value[1])))
                    .then((value) => { return value; })
                    .catch((error) => { throw new TapoError('Functional error - ' + error.message, error, ErrorCode.ERROR_FUNC_GENERAL, this._send_request.name); });
                return svr_answer;
            }
        })
            .catch((error) => {
            if (error.cause.error_code == 3)
                this._session.invalidate();
            throw new TapoError("Request error - Device " + this._host + " with seq " + seq + " - Request: " + raw_request, error, ErrorCode.ERROR_aSR_bSP_REQ_ERR, this._send_request.name);
        });
        // Return response
        return response;
    }
    // Private operations with the session
    async close() {
        if (this._session != null) {
            this._session.invalidate();
        }
    }
}
exports.KlapProtocol = KlapProtocol;
// Class for Klap Sessions
class KlapSession extends TapoSession {
    // Constructor to initialize the class
    constructor(session, timeout, expire, terminal, hsk, chip) {
        super();
        this.chiper = (typeof (chip) == 'undefined' ? null : chip);
        this.session_id = session;
        this.expire_at = (((typeof (expire) == 'undefined') || (!expire)) ? new Date().getTime() + timeout * 1000 : timeout);
        this.handshake_complete = (((typeof (hsk) == 'undefined') || (!hsk)) ? false : hsk);
        this.terminal_uuid = (typeof (terminal) == 'undefined' ? null : terminal);
        // Set the properties to false to avoid any change or access once created
        Object.defineProperty(this, 'session_id', { enumerable: false });
    }
    // Public method to get the cookies
    get_cookies() {
        return [{ "TP_SESSIONID": this.session_id }, 'TP_SESSIONID=' + this.session_id];
    }
    // Public method to check if handshake has expired
    is_handshake_session_expired() {
        return ((this.expire_at - new Date().getTime()) <= (40 * 1000));
    }
    // Public method to invalidate the session
    invalidate() {
        this.session_id = null;
        this.handshake_complete = false;
    }
    // Public method to complete handshake and assign 'chiper'
    complete_handshake(chiper) {
        this.handshake_complete = true;
        this.chiper = chiper;
        return this;
    }
}
exports.KlapSession = KlapSession;
// Class for Klap Chipper methods
class KlapChiper extends TapoChiper {
    // Constructor to initialize the class
    constructor(local_seed, remote_seed, user_hash) {
        super();
        this._key = this._key_derive(local_seed, remote_seed, user_hash);
        [this._iv, this._seq] = this._iv_derive(local_seed, remote_seed, user_hash);
        this._sig = this._sig_derive(local_seed, remote_seed, user_hash);
        // Set the properties to false to avoid any change or access once created
        Object.defineProperty(this, '_key', { enumerable: false });
        Object.defineProperty(this, '_iv', { enumerable: false });
        Object.defineProperty(this, '_seq', { enumerable: false });
        Object.defineProperty(this, '_sig', { enumerable: false });
    }
    // Public method to encrypt
    encrypt(msg) {
        this._seq = this._seq + 1;
        if (typeof msg == 'string') {
            msg = Buffer.from(new node_util_1.TextEncoder().encode(msg));
        }
        if (!(msg instanceof Buffer))
            throw new TapoError("El tipo no es Buffer - " + typeof (msg), null, ErrorCode.ERROR_KL_ENCRYPT_FMT, this.encrypt.name);
        const cipher = (0, node_crypto_1.createCipheriv)(AES_CIPHER_ALGORITHM, this._key, this._iv_seq()).setAutoPadding(true);
        const encryptor = cipher.update(msg);
        const final = cipher.final();
        const ciphertext = Buffer.concat([encryptor, final]);
        const hash = (0, node_crypto_1.createHash)('sha256');
        hash.update(Buffer.concat([this._sig, Buffer.from(this._seq.toString(16), 'hex'), ciphertext]));
        const signature = hash.digest();
        return [Buffer.concat([signature, ciphertext]), this._seq];
    }
    // Public method to decrypt
    decrypt(msg) {
        const cipher = (0, node_crypto_1.createDecipheriv)(AES_CIPHER_ALGORITHM, this._key, this._iv_seq()).setAutoPadding(true);
        const plaintextbytes = Buffer.concat([cipher.update(msg.subarray(32)), cipher.final()]);
        return plaintextbytes.toString();
    }
    // Private method to derive the key
    _key_derive(local_seed, remote_seed, user_hash) {
        const payload = new Uint8Array([...Buffer.from("lsk"), ...local_seed, ...remote_seed, ...user_hash]);
        const hash = (0, node_crypto_1.createHash)("sha256").update(payload).digest();
        return hash.subarray(0, 16);
    }
    _iv_derive(local_seed, remote_seed, user_hash) {
        const payload = new Uint8Array([...Buffer.from("iv"), ...local_seed, ...remote_seed, ...user_hash]);
        const fulliv = (0, node_crypto_1.createHash)("sha256").update(payload).digest();
        const seq = fulliv.subarray(fulliv.length - 4).readInt32BE();
        return [fulliv.subarray(0, 12), seq];
    }
    _sig_derive(local_seed, remote_seed, user_hash) {
        const payload = new Uint8Array([...Buffer.from("ldk"), ...local_seed, ...remote_seed, ...user_hash]);
        const hash = (0, node_crypto_1.createHash)("sha256").update(payload).digest();
        return hash.subarray(0, 28);
    }
    _iv_seq() {
        const seq = Buffer.alloc(4);
        seq.writeInt32BE(this._seq);
        const iv = new Uint8Array([...this._iv, ...seq]);
        if (iv.length != 16)
            throw new TapoError("La longitud es " + iv.length, null, ErrorCode.ERROR_KL_ENCRYPT_IV_LENGTH, this._iv_seq.name);
        return iv;
    }
}
exports.KlapChiper = KlapChiper;
// ****************************************************
// ***  KLAP CLASSES TO DEFINE PASSTHROUGH PROTOCOL ***
// ****************************************************
// Class for Passthrough Protocol definition
class PassthroughProtocol extends TapoProtocol {
    // Constructor to initialize the class
    constructor(auth_credential, url, http_session, terminal_random) {
        super();
        this._base_url = url;
        this._host = (new URL(this._base_url)).hostname;
        this._http_session = (typeof (http_session) == 'undefined' ? axios_1.default.create({ baseURL: url }) : http_session);
        this._session = null;
        this._auth_credential = auth_credential;
        this._request_id_generator = new SnowflakeId(1, 1);
        this._protocol_type = TapoProtocolType.PASSTHROUGH;
        this._terminal_random = ((typeof (terminal_random) == 'undefined') ? false : terminal_random);
        // Set the properties to false to avoid any change or access once created
        Object.defineProperty(this, '_auth_credential', { enumerable: false });
        Object.defineProperty(this, '_http_session', { enumerable: false });
        Object.defineProperty(this, '_session', { enumerable: false });
    }
    // Public methods used in the class to manage encryption and ciphering
    async create_key_pair(key_size) {
        // Handle the parameter
        const k_size = (typeof (key_size) == 'undefined' ? 1024 : key_size);
        // Generate keys
        const RSA_OPTIONS = {
            modulusLength: k_size,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
                cipher: AES_CIPHER_ALGORITHM,
                passphrase: PASSPHRASE
            }
        };
        const generateKeyPair_prom = (0, node_util_1.promisify)(node_crypto_1.generateKeyPair);
        const pair = await generateKeyPair_prom(RSA_CIPHER_ALGORITHM, RSA_OPTIONS);
        return pair;
    }
    // Private method to post a session
    async session_post(url, data, cookies, params) {
        this._jar = null;
        const common_headers = { "Content-Type": "application/json", "requestByApp": "true", "Accept": "application/json" };
        const headers = { ...common_headers, ...(typeof (cookies) == 'undefined' ? undefined : { 'Cookie': cookies }) };
        const config = { url: url, method: 'post', data: data, headers: headers, params: (typeof (params) == 'undefined' ? undefined : params) };
        const response = await axios_1.default.request(config)
            .then((value) => {
            if (value.status != 200) {
                throw new TapoError('URL error - ' + value.status, null, ErrorCode.ERROR_aSP_bAX_REQ_FORBID, this.session_post.name);
            }
            else {
                // Get the cookies
                if (value.headers.hasOwnProperty('set-cookie')) {
                    const cookies = value.headers['set-cookie'][0].split(';');
                    for (let i = 0; i < cookies.length; i++) {
                        if (cookies[i].includes('=')) {
                            this._jar = { ...this._jar, [cookies[i].split('=')[0]]: cookies[i].split('=')[1] };
                        }
                    }
                }
                // Return value
                return value;
            }
        })
            .catch((error) => {
            throw new TapoError('Session_post error - ' + error, new TapoError().axios_to_tapo(error), ErrorCode.ERROR_aSP_bAX_REQ_ERR, this.session_post.name);
        });
        return response;
    }
    // Private method Handshake to perform the full Handshake and get a valid Session
    async perform_handshake(url) {
        // Print debug messages
        console.debug("Will perform handshaking...");
        console.debug("Generating keypair");
        // Prepare parameters
        const req_url = (typeof (url) == 'undefined' ? this._base_url : url);
        let session = null;
        // Get the key pair and handshake parameters
        const key_pair = await this.create_key_pair();
        const handshake_params = new HandshakeParams(key_pair.publicKey);
        console.debug("Handshake params: " + JSON.stringify(handshake_params));
        // Create the Tapo request
        const request = new TapoRequest().handshake(handshake_params);
        console.debug("Request " + JSON.stringify(request));
        // Get the response from the device
        const response = await this.session_post(req_url, request)
            .then((value) => {
            console.debug("Handshake posted " + new Date().getTime() + ". Host is " + this._host + ", Response status is " + value.status + ", Request was " + JSON.stringify(request));
            if (value.status != 200) {
                if (session != null) {
                    session.invalidate();
                }
                throw new TapoError("Device responded with " + value.status + " to handshake", null, ErrorCode.ERROR_aPH_bSP_HSK_REJ, this.perform_handshake.name);
            }
            else {
                // Read the Session ID and timeout and create a session - still invalid
                console.debug("Handshake got cookies: ..." + JSON.stringify(this._jar));
                const session_id = this._jar[TP_SESSION_COOKIE_NAME];
                const timeout = parseInt(this._jar["TIMEOUT"], 10);
                const terminal_uuid = (this._terminal_random ? node_crypto_1.webcrypto.randomUUID() : (0, uuid_1.v4)());
                session = new Session(session_id, timeout, false, req_url, terminal_uuid, key_pair);
                // Get the device key and complete the session if everything is ok
                console.debug("Decoding handshake key ...");
                const handshake_key = value.data.result.key;
                try {
                    const chiper = new Chiper().create_from_keypair(handshake_key, key_pair);
                    return session.complete_handshake(chiper);
                }
                catch (error) {
                    throw new TapoError("Unable to extract device key from handshake - " + error, null, ErrorCode.ERROR_aPH_bSP_HSK_FORBID, this.perform_handshake.name);
                }
                ;
            }
            ;
        })
            .catch((error) => {
            throw new Error("Device responded with " + error + " to handshake");
        });
        return response;
    }
    // Public method to login with or without version 2 parameters
    async _login_with_version(is_trying_v2) {
        // Check the parameter
        const v2 = (((typeof (is_trying_v2) == 'undefined') || (!is_trying_v2)) ? false : is_trying_v2);
        // Try to perform the handshake and get a valid session
        const session = await this.perform_handshake()
            .then(async (ses_value) => {
            // Check if the session has a valid handshake
            if (!ses_value.is_handshake_session_expired()) {
                // Try to login with version 2 first
                const login_request = new TapoRequest().login(this._auth_credential, v2);
                const token = await this.send(login_request, ses_value)
                    .then(async (log_value) => {
                    if (log_value.result.hasOwnProperty('token')) {
                        return log_value.result.token;
                    }
                    else {
                        throw new TapoError("Token not found - " + JSON.stringify(log_value), null, ErrorCode.ERROR_aLG_bS_TOKEN_NOT_FOUND, this._login_with_version.name);
                    }
                })
                    .catch(async (error) => {
                    if (!v2) {
                        return (await this._login_with_version(true)).token;
                    }
                    else {
                        throw new TapoError("Token error - " + error.message, error, ErrorCode.ERROR_aLG_bS_TOKEN_ERROR, this._login_with_version.name);
                    }
                });
                // Update the token and return the session
                ses_value.token = token;
                return ses_value;
            }
            else {
                throw new TapoError("Detected handshake session timeout ", null, ErrorCode.ERROR_aLG_bPH_HSK_TIMEOUT, this._login_with_version.name);
            }
        })
            .catch((error) => {
            throw new TapoError("Login error - " + error.message, error, ErrorCode.ERROR_aLG_bPH_HSK_ERROR, this._login_with_version.name);
        });
        return session;
    }
    // Public method to send a request with 3 retries
    async send_request(request, retry) {
        const retr = (typeof (retry) == 'undefined' ? 3 : retry);
        const response = await this._send_request(request, retr)
            .then((value) => { return value; })
            .catch(async (error) => {
            if (retr > 0) {
                try {
                    return await this.send_request(request, retr - 1);
                }
                catch (error) {
                    throw new TapoError("Send request failed - Retry nº " + retr.toString(), error, ErrorCode.ERROR_aSR_bSR_RET_ERR, this.send_request.name);
                }
            }
            else {
                throw new TapoError("Send request max retries failed - " + error.message, error, ErrorCode.ERROR_aSR_bSR_MAX_RET, this.send_request.name);
            }
        });
        return response;
    }
    // Public method to send every request
    async _send_request(request, retry) {
        // Check if there is a valid session and get one if not ready
        this._session = (((this._session == null) || (this._session.token == null)) ? await this._login_with_version() : this._session);
        // Prepare request with terminal and timestamp and send it
        request.with_terminal_uuid(this._session.terminal_uuid).with_request_time_millis(Math.round(new Date().getTime()));
        return await this.send(request);
    }
    async send(request, session) {
        // Process the optional parameters
        const send_session = (typeof (session) == 'undefined' ? this._session : session);
        // Prepare request to be sent
        request.with_request_id(await this._request_id_generator.generate_id()).with_request_time_millis(Math.round(new Date().getTime())).with_terminal_uuid(send_session.terminal_uuid);
        const raw_request = JSON.stringify(request);
        console.debug("Raw request " + raw_request);
        // Encrypt and prepare request for secure passthrough
        const encrypted_request = send_session.chiper.encrypt(raw_request);
        const passthrough_request = new TapoRequest().secure_passthrough(new SecurePassthroughParams(encrypted_request));
        console.debug("Request body " + JSON.stringify(passthrough_request));
        // Prepare url to be used and send request
        const url = send_session.url + '?token=' + send_session.token;
        const response = await this.session_post(url, passthrough_request, send_session.get_cookies()[1])
            .then(async (value) => {
            console.debug("Handshake posted " + new Date().getTime() + ". Host is " + this._host + ", Response status is " + value.status + ", Request was " + JSON.stringify(passthrough_request));
            if (value.status != 200) {
                if (send_session != null) {
                    send_session.invalidate();
                }
                throw new TapoError("Device responded with " + value.status + " to request", null, ErrorCode.ERROR_aSR_bSP_REJ, this.send.name);
            }
            else {
                const svr_answer = await (new TapoResponse()).try_from_json(JSON.parse(JSON.stringify(send_session.chiper.decrypt(value.data.result.response))))
                    .then((value) => { return value; })
                    .catch((error) => { throw new TapoError('Functional error - ' + error.message, error, ErrorCode.ERROR_FUNC_GENERAL, this._send_request.name); });
                return svr_answer;
            }
        })
            .catch((error) => {
            if (error.cause.error_code == 3)
                this._session.invalidate();
            throw new TapoError("Device responded with " + error.message + " to request " + raw_request, error, ErrorCode.ERROR_aSR_bSP_REQ_ERR, this.send.name);
        });
        // Return response
        return response;
    }
    // Private operations with the session
    async close() {
        if (this._session != null) {
            this._session.invalidate();
        }
    }
}
exports.PassthroughProtocol = PassthroughProtocol;
// Class for PassthroughProtocol Session
class Session extends TapoSession {
    // Constructor to initialize the class
    constructor(session, timeout, expire, url, terminal, keypair, hsk_req, chip) {
        super();
        this.chiper = (typeof (chip) == 'undefined' ? null : chip);
        this.session_id = session;
        this.expire_at = (((typeof (expire) == 'undefined') || (!expire)) ? ((new Date()).getTime() + timeout) * 1000 : timeout);
        this.handshake_complete = (((typeof (hsk_req) == 'undefined') || (!hsk_req)) ? true : !hsk_req);
        this.token = null;
        this.key_pair = (typeof (keypair) == 'undefined' ? null : keypair);
        this.terminal_uuid = (typeof (terminal) == 'undefined' ? null : terminal);
        this.url = (typeof (url) == 'undefined' ? null : url);
        // Set the properties to false to avoid any change or access once created
        Object.defineProperty(this, 'session_id', { enumerable: false });
        Object.defineProperty(this, 'key_pair', { enumerable: false });
        Object.defineProperty(this, 'token', { enumerable: false });
    }
    // Public method to get the cookies
    get_cookies() {
        return [{ "TP_SESSIONID": this.session_id }, 'TP_SESSIONID=' + this.session_id];
    }
    // Public method to check if handshake has expired
    is_handshake_session_expired() {
        return (!this.handshake_complete) || ((this.expire_at - new Date().getTime()) <= (40 * 1000));
    }
    // Public method to invalidate the session
    invalidate() {
        this.handshake_complete = false;
        this.token = null;
    }
    // Public method to complete handshake and assign 'chiper'
    complete_handshake(chiper) {
        this.chiper = chiper;
        this.handshake_complete = true;
        return this;
    }
}
exports.Session = Session;
// Class for Klap Chipper methods
class Chiper extends TapoChiper {
    // Constructor to initialize the class
    constructor(key, iv) {
        super();
        this._key = (typeof (key) == 'undefined' ? null : key);
        this._iv = (typeof (iv) == 'undefined' ? null : iv);
        if ((this._key != null) && (this._iv != null)) {
            this.cipher = (0, node_crypto_1.createCipheriv)(AES_CIPHER_ALGORITHM, key, iv).setAutoPadding(true);
        }
        else {
            this.cipher = null;
        }
        // Set the properties to false to avoid any change or access once created
        Object.defineProperty(this, '_key', { enumerable: false });
        Object.defineProperty(this, '_iv', { enumerable: false });
        Object.defineProperty(this, 'cipher', { enumerable: false });
    }
    // Public method to create from keypair
    create_from_keypair(handshake_key, keypair) {
        //const private_key: Buffer = Buffer.from(keypair.privateKey, 'base64');
        const key_and_iv = this.readDeviceKey(handshake_key, keypair.privateKey);
        if (key_and_iv === null) {
            throw new TapoError("Decryption failed!", null, ErrorCode.ERROR_CH_UNABLE_KEYS, this.create_from_keypair.name);
        }
        else {
            this._key = key_and_iv.subarray(0, 16);
            this._iv = key_and_iv.subarray(16, 32);
            this.cipher = (0, node_crypto_1.createCipheriv)(AES_CIPHER_ALGORITHM, this._key, this._iv).setAutoPadding(true);
            return this;
        }
    }
    // Private method to read the device key from handshake info    
    readDeviceKey(pemKey, privateKey) {
        const keyBytes = Buffer.from(pemKey, 'base64');
        const deviceKey = (0, node_crypto_1.privateDecrypt)({
            key: privateKey,
            padding: node_crypto_1.constants.RSA_PKCS1_PADDING,
            passphrase: PASSPHRASE,
        }, keyBytes);
        return deviceKey;
    }
    // Public method to decrypt
    decrypt(msg) {
        if (typeof msg == 'string') {
            msg = Buffer.from(msg, 'base64');
        }
        const cipher = (0, node_crypto_1.createDecipheriv)(AES_CIPHER_ALGORITHM, this._key, this._iv).setAutoPadding(true);
        const plaintextbytes = Buffer.concat([cipher.update(msg), cipher.final()]);
        return JSON.parse(plaintextbytes.toString());
    }
    // Public method to encrypt
    encrypt(msg) {
        if (typeof msg == 'string') {
            msg = Buffer.from(msg);
        }
        if (!(msg instanceof Buffer))
            throw new TapoError("El tipo no es Buffer - " + typeof (msg), null, ErrorCode.ERROR_KL_ENCRYPT_FMT, this.encrypt.name);
        const cipher = (0, node_crypto_1.createCipheriv)(AES_CIPHER_ALGORITHM, this._key, this._iv).setAutoPadding(true);
        const encryptor = cipher.update(msg);
        const final = cipher.final();
        const ciphertext = Buffer.concat([encryptor, final]);
        return ciphertext.toString('base64');
    }
}
exports.Chiper = Chiper;
class SnowflakeId {
    // Constructor of the class
    constructor(worker_id, data_certer_id) {
        // Parameters defining the class
        this.EPOCH = 1420041600000; // Custom epoch (in milliseconds)
        this.WORKER_ID_BITS = 5;
        this.DATA_CENTER_ID_BITS = 5;
        this.SEQUENCE_BITS = 12;
        this.MAX_WORKER_ID = (1 << this.WORKER_ID_BITS) - 1;
        this.MAX_DATA_CENTER_ID = (1 << this.DATA_CENTER_ID_BITS) - 1;
        this.SEQUENCE_MASK = (1 << this.SEQUENCE_BITS) - 1;
        // Check the limits
        if ((worker_id > this.MAX_WORKER_ID) || (worker_id < 0)) {
            throw new TapoError("Worker ID can't be greater than " + this.MAX_WORKER_ID + " or less than 0", null, ErrorCode.ERROR_SNOW_WORKER_ID, 'SnowflakeId');
        }
        if ((data_certer_id > this.MAX_DATA_CENTER_ID) || (data_certer_id < 0)) {
            throw new TapoError("Data center ID can't be greater than " + this.MAX_DATA_CENTER_ID + " or less than 0", null, ErrorCode.ERROR_SNOW_DATA_CENTER_ID, 'SnowflakeId');
        }
        // Assign the values
        this.worker_id = worker_id;
        this.data_center_id = data_certer_id;
        this.sequence = 0;
        this.last_timestamp = -1;
    }
    // Public methods defined in the class
    async generate_id() {
        // Get current timestamp in milliseconds
        let timestamp = new Date().getTime();
        // Check timestamp against last one
        if (timestamp < this.last_timestamp) {
            throw new TapoError("Clock moved backwards. Refusing to generate ID.", null, ErrorCode.ERROR_SNOW_INVALID_TIME_ID, this.generate_id.name);
        }
        else if (timestamp == this.last_timestamp) {
            // Within the same millisecond increment the sequence number
            this.sequence = (this.sequence + 1) & this.SEQUENCE_MASK;
            if (this.sequence == 0) {
                // Sequence exceeds its bit range. Wait until the next millisecond
                timestamp = await this._wait_next_millis(this.last_timestamp);
            }
        }
        else {
            // New millisecond, reset the sequence number
            this.sequence = 0;
        }
        // Generate and return the final ID
        return (((timestamp - this.EPOCH) << (this.WORKER_ID_BITS + this.SEQUENCE_BITS + this.DATA_CENTER_ID_BITS)) | (this.data_center_id << (this.SEQUENCE_BITS + this.WORKER_ID_BITS)) | (this.worker_id << this.SEQUENCE_BITS) | this.sequence);
    }
    // Private methods defined in the class
    async _wait_next_millis(last_timestamp) {
        let timestamp = new Date().getTime();
        do {
            timestamp = new Date().getTime();
        } while (timestamp <= last_timestamp);
        return timestamp;
    }
}
exports.SnowflakeId = SnowflakeId;
// ********************************************
// ***  KLAP CLASSES TO DEFINE TAPO DEVICES ***
// ********************************************
// Enum for Tapo Devices
var TapoDevicesType;
(function (TapoDevicesType) {
    TapoDevicesType["PLUG"] = "SMART.TAPOPLUG";
    TapoDevicesType["BULB"] = "SMART.TAPOBULB";
    TapoDevicesType["CAMERA"] = "SMART.IPCAMERA";
})(TapoDevicesType = exports.TapoDevicesType || (exports.TapoDevicesType = {}));
// Class for Base Tapo Device
class TapoDevice {
    // Constructor to initialize the class
    constructor(terminal_random, api) {
        this._api = api;
        this.terminal_random = terminal_random;
    }
    // Methods to be used by the class
    async raw_command(method, params, protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        return await this._api.execute_raw_request(new TapoRequest(method, params), proto);
    }
    async get_device_info(protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        const result = this.get_state_as_json(proto);
        return result;
    }
    async get_energy_usage(protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        const result = this._api.get_energy_usage(proto);
        return result;
    }
    async turn_onoff_device(status, protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        const result = this._api.turn_onoff_device(status, proto);
        return result;
    }
    async set_color_device(color, protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        const result = this._api.set_color_device(color, proto);
        return result;
    }
    async set_brightness_device(level, protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        const result = this._api.set_brightness_device(level, proto);
        return result;
    }
    async get_state_as_json(protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        return await this._api.get_device_info(proto);
    }
    async get_component_negotiation(protocol) {
        const proto = (typeof (protocol) == 'undefined' ? TapoProtocolType.AUTO : protocol);
        return await this._api.get_component_negotiation(proto);
    }
    async get_device_by_IP(auth_credential, ip, protocol) {
        // Process the parameters
        const proto = (typeof (protocol) == 'undefined' ? undefined : protocol);
        // Update the ip of the device
        this.ip = ip;
        // Create the client
        this._api = new TapoClient(auth_credential, this.ip, proto, undefined, this.terminal_random);
        // Return device
        return this;
    }
    async get_device_by_alias(auth_credential, alias, range_ip) {
        // Process the parameters
        const range = (typeof (range_ip) == 'undefined' ? undefined : range_ip);
        // Connect to the cloud to get the list of devices
        const devices = await this.list_devices(await this.cloud_login(auth_credential));
        //Match the device by alias
        if (devices !== undefined) {
            for (const items of devices) {
                if (items.alias === alias) {
                    items.ip = await items.resolve_MAC_to_IP(items.deviceMac, range);
                    return await items.get_device_by_IP(auth_credential, items.ip);
                }
            }
        }
        else {
            throw new TapoError("Failed to get tapo device list", null, ErrorCode.ERROR_CLOUD_NO_DEVICE_LIST, this.get_device_by_alias.name);
        }
        // Return error not found
        throw new TapoError('Alias not found - ' + alias, null, ErrorCode.ERROR_ALIAS_NOT_FOUND, this.get_device_by_alias.name);
    }
    async cloud_login(auth_credential) {
        // Prepare the request to connect to Cloud account
        const request = new TapoRequest().cloud_login(auth_credential);
        const config = { url: CLOUD_URL, method: 'post', data: request };
        const response = await axios_1.default.request(config)
            .then(async (value) => {
            if (value.status != 200) {
                throw new TapoError('Tapo Cloud server - Unable to connect: ' + value.statusText, null, ErrorCode.ERROR_CLOUD_CONN_REJ, this.cloud_login.name);
            }
            else {
                const svr_answer = await (new TapoResponse()).try_from_json(JSON.parse(JSON.stringify(value.data)));
                return svr_answer;
            }
        })
            .catch((error) => {
            throw new TapoError('Tapo Cloud server error - ' + error.message, new TapoError().axios_to_tapo(error), ErrorCode.ERROR_AXIOS_ERROR, this.cloud_login.name);
        });
        // Return collected Cloud token
        return response.result.token;
    }
    async list_devices(cloudToken) {
        // Prepare the request to get the list
        const request = new TapoRequest().cloud_list_devices();
        const config = { url: CLOUD_URL + '?token=' + cloudToken, method: 'post', data: request };
        const response = await axios_1.default.request(config)
            .then(async (value) => {
            if (value.status != 200) {
                throw new TapoError('Tapo Cloud server - Unable to connect: ' + value.statusText, null, ErrorCode.ERROR_CLOUD_CONN_REJ, this.list_devices.name);
            }
            else {
                const svr_answer = await (new TapoResponse()).try_from_json(JSON.parse(JSON.stringify(value.data)));
                return svr_answer;
            }
        })
            .catch((error) => {
            throw new TapoError('Tapo Cloud server error - ' + error.message, new TapoError().axios_to_tapo(error), ErrorCode.ERROR_AXIOS_ERROR, this.list_devices.name);
        });
        // Return a mapping of the list
        return Promise.all(response.result.deviceList.map(async (deviceInfo) => this.augment_TapoDevice(deviceInfo)));
    }
    async list_devices_by_type(cloudToken, deviceType) {
        const devices = await this.list_devices(cloudToken);
        return devices.filter(d => d.deviceType === deviceType);
    }
    // Define private methods used by the class
    async augment_TapoDevice(deviceInfo) {
        // Get an instance to a new Tapo device and copy all info in deviceInfo
        const device = new TapoDevice(this.terminal_random);
        try {
            for (const [key, value] of Object.entries(deviceInfo)) {
                device[key] = value;
            }
        }
        catch (error) {
            throw new TapoError('Error on Tapo Device information - ' + error, null, ErrorCode.ERROR_DEVICE_INFO, this.augment_TapoDevice.name);
        }
        // Check if it is a Tapo Device
        if (this.isTapoDevice(deviceInfo.deviceType)) {
            device.alias = Buffer.from(deviceInfo.alias, 'base64').toString();
        }
        // Return the new TapoDevice object
        return device;
    }
    isTapoDevice(deviceType) {
        switch (deviceType) {
            case TapoDevicesType.PLUG:
            case TapoDevicesType.BULB:
            case TapoDevicesType.CAMERA:
                return true;
            default: return false;
        }
    }
    async resolve_MAC_to_IP(mac, range_ip) {
        //@ts-ignore
        const devices = await (0, local_devices_1.default)(range_ip);
        let result = "";
        try {
            if (devices !== undefined) {
                result = devices.find((device) => this.tidy_MAC(device.mac) == this.tidy_MAC(mac)).ip;
            }
            return result;
        }
        catch (error) {
            throw new TapoError('MAC conversion error - ' + error, null, ErrorCode.GENERIC_ERROR, this.resolve_MAC_to_IP.name);
        }
    }
    tidy_MAC(mac) {
        return mac.replace(/:/g, '').replace(/-/g, '').toUpperCase();
    }
}
exports.TapoDevice = TapoDevice;
// Class for Plug Device
class PlugDevice extends TapoDevice {
    // Additional methods to basic class
    async get_state() {
        return;
    }
}
exports.PlugDevice = PlugDevice;
class PlugDeviceState {
    // Public methods available
    async try_from_json(kwargs) {
        const state = await new PlugDeviceState();
        state.info = 'DeviceInfo';
        state.device_on = kwargs.device_on || false;
        state.power_protection_status = kwargs.power_protection_status;
        state.on_time = kwargs.on_time;
        state.auto_off = (kwargs.auto_off_status == "on");
        state.auto_off_time_remaining = kwargs.auto_off_remain_time;
        state.default_states = kwargs.default_states;
        return state;
    }
}
exports.PlugDeviceState = PlugDeviceState;
//# sourceMappingURL=tapo_klap_protocol.js.map