import { NodeInitializer } from "node-red";
// debug 
import * as tapoConfig from 'config';

// tplinkTapoConnectApi
import { commandType } from "./type";

// tplinkTapoConnectWrapper
import { tplinkTapoConnectWrapper, tplinkTapoConnectWrapperType } from "./tplink_tapo_connect_wrapper/tplink_tapo_connect_wrapper";

const nodeInit: NodeInitializer = (RED): void => {

    const REGISTER_TYPE: string = 'tplink_command';

    /**
     * checkParameter
     *
     * @param {toggleType.configBase} config
     * @returns {boolean}
     */
    function checkParameter(config: commandType.configBase): boolean {
        let _result: boolean = false;
        if (config?.email.length > 0 && config?.password.length > 0) {
            if (('ip' === config?.searchMode && config?.deviceIp.length > 0) ||
                ('alias' === config?.searchMode && config?.deviceAlias.length > 0 && config?.deviceIpRange.length > 0)) {
                _result = true;
            }
        }
        return _result
    }

    /**
     * tplinkTapoConnectApiConstructor
     *
     * @param {any} this
     * @param {commandType.appNodeDef} config
     */
    function tplinkTapoConnectApiConstructor(
        this: any,
        config: commandType.appNodeDef
    ): void {
        RED.nodes.createNode(this, config);
        let node: commandType.appNode = this;

        try {
            node.email = this?.credentials?.email ?? "";
            node.password = this?.credentials?.password ?? "";
            node.deviceIp = config?.deviceIp ?? "";
            node.deviceAlias = config?.deviceAlias ?? "";
            node.deviceIpRange = config?.deviceIpRange ?? "";
            node.searchMode = config?.searchMode ?? "ip";
            node.command = config?.command ?? "";

            // if(checkParameter(node)){
            //     switch(node.command){
            //         case 0:
            //         case 1:
            //             node.status({fill:"blue", shape:"dot", text:RED._("resources.message.ready") + `(${node.command})` });
            //             break;
            //         default:
            //             node.status({fill:"red", shape:"ring", text:"resources.message.configError"});
            //             break;
            //     }
            // } else {
            //     node.status({fill:"red", shape:"ring", text:"resources.message.configError"});
            // }
        } catch (error) {
            node.status({ fill: "red", shape: "ring", text: "resources.message.error" });
            node.error(error);
        }


        /**
         * setTapoTurnOff
         *
         * @param {commandType.configBase} config
         * @returns {Promise< tplinkTapoConnectWrapperType.tapoConnectResults >}
         */
        async function setTapoTurnOff(config: commandType.configBase): Promise<tplinkTapoConnectWrapperType.tapoConnectResults> {
            let ret: tplinkTapoConnectWrapperType.tapoConnectResults;
            if ("ip" === config.searchMode) {
                ret = await tplinkTapoConnectWrapper.getInstance().
                    setTapoTurnOff(config.email, config.password, config.deviceIp);
            } else {
                ret = await tplinkTapoConnectWrapper.getInstance().
                    setTapoTurnOffAlias(config.email, config.password, config.deviceAlias, config.deviceIpRange);
            }
            return ret;
        }

        /**
         * setTapoTurnOn
         *
         * @param {commandType.configBase} config
         * @returns {Promise< tplinkTapoConnectWrapperType.tapoConnectResults >}
         */
        async function setTapoTurnOn(config: commandType.configBase): Promise<tplinkTapoConnectWrapperType.tapoConnectResults> {
            let ret: tplinkTapoConnectWrapperType.tapoConnectResults;
            if ("ip" === config.searchMode) {
                ret = await tplinkTapoConnectWrapper.getInstance().
                    setTapoTurnOn(config.email, config.password, config.deviceIp);
            } else {
                ret = await tplinkTapoConnectWrapper.getInstance().
                    setTapoTurnOnAlias(config.email, config.password, config.deviceAlias, config.deviceIpRange);
            }
            return ret;
        }

        /**
         * getTapoDeviceInfo
         *
         * @param {commandType.configBase} config
         * @returns {Promise< tplinkTapoConnectWrapperType.tapoDeviceInfoResults >}
         */
        async function getTapoDeviceInfo(config: commandType.configBase): Promise<tplinkTapoConnectWrapperType.tapoConnectResults> {
            let ret: tplinkTapoConnectWrapperType.tapoConnectResults;
            if ("ip" === config.searchMode) {
                ret = await tplinkTapoConnectWrapper.getInstance().
                    getTapoDeviceInfo(config.email, config.password, config.deviceIp);
            } else {
                ret = await tplinkTapoConnectWrapper.getInstance().
                    getTapoDeviceInfoAlias(config.email, config.password, config.deviceAlias);
            }
            return ret;
        }

        node.on('input', async (msg: any) => {
            try {

                // config
                let config: commandType.configBase = {
                    email: msg.payload?.email ?? node.email,
                    password: msg.payload?.password ?? node.password,
                    deviceIp: msg.payload?.deviceIp ?? node.deviceIp,
                    deviceAlias: msg.payload?.deviceAlias ?? node.deviceAlias,
                    deviceIpRange: msg.payload?.deviceIpRange ?? node.deviceIpRange,
                    searchMode: msg.payload?.searchMode ?? node.searchMode,
                    command: msg.payload?.command ?? node.command,
                    option: msg.payload?.option ?? node.option
                };
                // debug
                console.log(`config-${REGISTER_TYPE}:`, config);
                const _tapoConfig: any = tapoConfig;
                if ( typeof _tapoConfig.tapoSettings !== 'undefined' ){
                    if (false === checkParameter(config)){
                        config = _tapoConfig.tapoSettings;
                        console.log("Updated to debug settings.");
                        console.log(`config-${REGISTER_TYPE}:`, config);
                    }
                }
                // debug

                let ret: tplinkTapoConnectWrapperType.tapoConnectResults = {
                    result: false
                };

                if (checkParameter(config)) {
                    switch (config.command) {
                        case "power":
                            switch (config?.option?.power) {
                                case 0: ret = await setTapoTurnOff(config); break;
                                case 1: ret = await setTapoTurnOn(config); break;
                                default: throw new Error("command(option.power) not found.");
                            }
                            break;
                        case "status":
                            ret = await getTapoDeviceInfo(config);
                            break;
                        case "toggle":
                            ret = await getTapoDeviceInfo(config);
                            if (ret.result) {
                                switch (ret.tapoDeviceInfo?.device_on) {
                                    case true: ret = await setTapoTurnOff(config); break;
                                    case false: ret = await setTapoTurnOn(config); break;
                                    default: throw new Error("tapoDeviceInfo.device_on not found.");
                                }
                            } else {
                                if (ret?.errorInf) {
                                    throw new Error(ret.errorInf.message);
                                }
                                throw new Error("faild to get tapo device info.");
                            }
                            break;
                        default:
                            throw new Error("command not found.");
                    }
                } else {
                    throw new Error("faild to get config.");
                }
                msg.payload = ret;
                node.status({ fill: "green", shape: "dot", text: "resources.message.complete" });
            } catch (error) {
                node.status({ fill: "red", shape: "ring", text: "resources.message.communicationError" });
                node.error(error);
                msg.payload = { result: false, errorInf: /*{ name: "Error", message: error}*/error };
            }
            node.send(msg);
        });
    }
    RED.nodes.registerType(REGISTER_TYPE, tplinkTapoConnectApiConstructor, {
        credentials: {
            email: { type:"text" },
            password: { type:"password" }
        }
    });
};

export = nodeInit;
