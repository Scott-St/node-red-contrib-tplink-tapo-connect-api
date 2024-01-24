import { NodeInitializer, Node, NodeDef } from "node-red";

// New tapo api
import { AuthCredential, TapoResuls, TapoDevice, TapoDeviceInfo, TapoEnergyUsage, supportEnergyUsage, TapoProtocolType, TapoRequest, Components, Json_T } from "./tapo_klap_protocol";

// Type to be used in tapo actions
namespace tapo_actions {
    export type search_mode_type = "ip" | "alias";
    export type command_type = "status" | "power" | "on" | "off" | "toggle" | "color" | "brightness" | "components" | "command";
    export type config_base = {
        email: string;
        password: string;
        deviceIp: string;
        deviceAlias: string;
        deviceIpRange: string;
        searchMode : search_mode_type;
        command?: command_type;
        version?: TapoProtocolType;
        verbose?: boolean;
        device?: TapoDevice;
        terminal_random?: boolean;
    }
    export interface app_node_def extends NodeDef, config_base {}
    export interface app_node extends Node, config_base {}
}

const nodeInit: NodeInitializer = (RED): void => {

    const REGISTER_TYPE: string = 'tapo_new_actions';

    // Check parameters are complete
    function check_parameter(config: tapo_actions.config_base): boolean {
        let _result: boolean = false;
        if (config?.email.length > 0 && config?.password.length > 0) {
            if (('ip' === config?.searchMode && config?.deviceIp.length > 0) ||
                ('alias' === config?.searchMode && config?.deviceAlias.length > 0 && config?.deviceIpRange.length > 0)) {
                _result = true;
            }
        }
        return _result
    }

    // Tapo actions constructor
    function tapo_actions_constructor(this: any, config: tapo_actions.app_node_def): void {
        RED.nodes.createNode(this, config);
        let node: tapo_actions.app_node = this;

        try {
            node.email = this?.credentials?.email ?? "";
            node.password = this?.credentials?.password ?? "";
            node.deviceIp = config?.deviceIp ?? "";
            node.deviceAlias = config?.deviceAlias ?? "";
            node.deviceIpRange = config?.deviceIpRange ?? "";
            node.searchMode = config?.searchMode ?? "ip";
            node.command = config?.command ?? "status";
            node.version = config?.version ?? TapoProtocolType.AUTO;
            node.verbose = false;
            node.device = null;
            node.terminal_random = false;
        } catch (error) {
            node.status({ fill: "red", shape: "ring", text: "resources.message.error" });
            node.error(error);
        }

        // Get device object handler
        async function get_device_handler(config: tapo_actions.config_base): Promise<TapoResuls> {

            // Process parameters
            const proto: TapoProtocolType = (typeof(config.version) == 'undefined'?TapoProtocolType.AUTO:config.version);
            
            // Try to get Device Info with config  
            try {

                // Set the optional parameters
                let response: TapoResuls = { result: false };
    
                // In case of client available skip create client
                if (config.device == null) {

                    // Get credentials object
                    const tapo_cred: AuthCredential = new AuthCredential(config.email, config.password);

                    // Create the device object depending on the ip option
                    if (config.searchMode === "ip") {
                        response.device = await new TapoDevice(config.terminal_random).get_device_by_IP(tapo_cred, config.deviceIp);
                    } else {
                        response.device = await new TapoDevice(config.terminal_random).get_device_by_alias(tapo_cred, config.deviceAlias, config.deviceIpRange);
                    }

                    // Update the config device
                    config.device = response.device;
                }

                // Return positive result
                response.result = true;
                response.device = config.device;
                return response;

            } catch (error: any) {
                return { result: false, errorInf: error, device: null };
            }
        }

        // Action: Status - Get device info
        async function get_device_info(device: TapoDevice, proto: TapoProtocolType): Promise<TapoResuls> {

            // Process parameters
            let response: TapoResuls = { result: false };
            
            // Try to get Device Info with config  
            try {

                // Get device info in Tapo format
                const device_info: TapoDeviceInfo = await device.get_device_info(proto);
                if (!Object.keys(device_info).length) {
                    throw new Error("Tapo device info not found");
                }
                response.tapoDeviceInfo = device_info;

                // Get energy usage if model supports it
                if ( supportEnergyUsage.includes(device_info.model )) {
                    const energy_usage: TapoEnergyUsage = await device.get_energy_usage(proto);
                    if (!Object.keys(energy_usage).length) {
                        throw new Error("Tapo device energy not found");
                    }
                    response.tapoEnergyUsage = energy_usage;
                }

                // Return positive result
                response.result = true;
                response.device = device;
                return response;

            } catch (error: any) {
                return { result: false, errorInf: error, device: null };
            }
        }

        // Action: Turn_on - Activate device
        async function set_onoff_device(device: TapoDevice, proto: TapoProtocolType, status: boolean): Promise<TapoResuls> {

            // Process parameters
            let response: TapoResuls = { result: false };
            
            // Try to get Device Info with config  
            try {

                // Turn on or off device depending on status requested
                const answer = await device.turn_onoff_device(status, proto);

                // Return positive result
                response.result = true;
                response.device = device;
                return response;

            } catch (error: any) {
                return { result: false, errorInf: error, device: null };
            }            
        }

        // Action: Toggle - Change device status
        async function toggle_device(device: TapoDevice, proto: TapoProtocolType): Promise<TapoResuls> {

            // Process parameters
            let response: TapoResuls = { result: false };
            
            // Try to get Device Info with config  
            try {

                // Get device info in Tapo format
                const device_info: TapoDeviceInfo = await device.get_device_info(proto);
                if (!Object.keys(device_info).length) {
                    throw new Error("Tapo device info not found");
                }

                // Turn on or off device depending on current tatus
                const answer = await device.turn_onoff_device(!device_info.device_on, proto);

                // Return positive result
                response.result = true;
                response.device = device;
                return response;

            } catch (error: any) {
                return { result: false, errorInf: error, device: null };
            }            
        }

        // Action: Color - Change device color
        async function set_color_device(device: TapoDevice, proto: TapoProtocolType, color: string): Promise<TapoResuls> {

            // Process parameters
            let response: TapoResuls = { result: false };
            
            // Try to set color of device 
            try {

                // Set device color as requested
                const answer = await device.set_color_device(color, proto);

                // Return positive result
                response.result = true;
                response.device = device;
                return response;

            } catch (error: any) {
                // Check verbose
                if (config.verbose) {
                    if (typeof(error.track) != 'undefined') delete error.track;
                }

                // Prepare result in error and set the status indicator
                node.status({ fill: "red", shape: "ring", text: "resources.message.communicationError" });
                return { result: false, errorInf: error, device: null };
            }            
        }

        // Action: Brightness - Change device brightness
        async function set_brightness_device(device: TapoDevice, proto: TapoProtocolType, level: number): Promise<TapoResuls> {

            // Process parameters
            let response: TapoResuls = { result: false };
            
            // Try to set device brightness 
            try {

                // Set device color as requested
                const answer = await device.set_brightness_device(level, proto);

                // Return positive result
                response.result = true;
                response.device = device;
                return response;

            } catch (error: any) {
                return { result: false, errorInf: error, device: null };
            }            
        }

        // Action: Components - Get components of device
        async function get_component(device: TapoDevice, proto: TapoProtocolType): Promise<TapoResuls> {

            // Process parameters
            let response: TapoResuls = { result: false };
            
            // Try to get components from device 
            try {

                // Set device color as requested
                const answer: Components = await device.get_component_negotiation(proto);
                response.tapoComponents = answer;

                // Return positive result
                response.result = true;
                response.device = device;
                return response;

            } catch (error: any) {
                return { result: false, errorInf: error, device: null };
            }            
        }

        // Action: Command - Send command with custom request
        async function send_request(device: TapoDevice, proto: TapoProtocolType, request: TapoRequest): Promise<TapoResuls> {

            // Process parameters
            let response: TapoResuls = { result: false };
            
            // Try to send request to device 
            try {

                // Set device color as requested
                const answer: Json_T = await device.send_request(request, proto);
                response.tapoCommand = answer;

                // Return positive result
                response.result = true;
                response.device = device;
                return response;

            } catch (error: any) {
                return { result: false, errorInf: error, device: null };
            }            
        }

        node.on('input', async (msg: any) => {
            try {

                // Prepare config information 
                let config: tapo_actions.config_base = {
                    email: msg?.config?.email ?? node.email,
                    password: msg?.config?.password ?? node.password,
                    deviceIp: msg?.config?.deviceIp ?? node.deviceIp,
                    deviceAlias: msg?.config?.deviceAlias ?? node.deviceAlias,
                    deviceIpRange: msg?.config?.deviceIpRange ?? node.deviceIpRange,
                    searchMode: msg?.config?.searchMode ?? node.searchMode,
                    command: msg?.config?.command ?? node.command,
                    version: msg?.config?.version ?? node.version,
                    verbose: msg?.config?.verbose ?? node.verbose,
                    terminal_random: msg?.config?.terminal_random ?? node.terminal_random,
                    device: node.device
                };

                // Print config in the log
                console.log(`config[${REGISTER_TYPE}]:`, config);

                // Prepare result variable to false
                let ret: TapoResuls = {
                    result: false
                };

                // Check that config is valid and complete
                if (check_parameter(config)) {

                    // Get device handler
                    ret = await get_device_handler(config);

                    // Check if we got a valid device
                    if (ret.result) {
                        if (config.command == "status") {
                            // Get device info
                            ret = await get_device_info(ret.device, config.version);
                        } else if (config.command == "power") {
                            // Turn on/off device depending on msg.payload
                            ret = await set_onoff_device(ret.device, config.version, (msg.payload == true));
                        } else if (config.command == "on") {
                            // Turn on device
                            ret = await set_onoff_device(ret.device, config.version, true);
                        } else if (config.command == "off") {
                            // Turn off device
                            ret = await set_onoff_device(ret.device, config.version, false);
                        } else if (config.command == "toggle") {
                            // Toggle device
                            ret = await toggle_device(ret.device, config.version);
                        } else if (config.command == "color") {
                            // Set color of device depending on msg.payload
                            ret = await set_color_device(ret.device, config.version, msg.payload.toString());
                        } else if (config.command == "brightness") {
                            // Set brightness of device depending on msg.payload
                            ret = await set_brightness_device(ret.device, config.version, msg.payload);
                        } else if (config.command == "components") {
                            // Set brightness of device depending on msg.payload
                            ret = await get_component(ret.device, config.version);
                        } else if (config.command == "command") {
                            // Prepare the request with msg.payload components
                            const request: TapoRequest = new TapoRequest(msg.payload?.method, msg.payload?.params);
                            // Set brightness of device depending on msg.payload
                            ret = await send_request(ret.device, config.version, request);
                        }
                    }

                    // Update the client device in the node
                    config.device = ret.device;
                    node.device = ret.device;

                    // Delete device info from ret
                    delete ret.device;
                    
                } else {

                    // Throw error indicating that there is a config issue
                    throw new Error("Failed to get config");
                }

                // Prepare result in msg.payload and set the status indicator
                msg.payload = ret;
                if (ret.result) {
                    
                    // Change status according to config
                    if (config.version == TapoProtocolType.KLAP) {
                        node.status({ fill: "green", shape: "dot", text: "resources.message.complete_klap" });
                    } else if (config.version == TapoProtocolType.PASSTHROUGH) {
                        node.status({ fill: "green", shape: "dot", text: "resources.message.complete_pass" });
                    } else {
                        node.status({ fill: "green", shape: "dot", text: "resources.message.complete_auto" });
                    }

                } else {
                             
                    // Check verbose to remove track
                    if (!config.verbose) {
                    //    if (typeof(msg.payload.errorInf["track"]) != 'undefined') delete msg.payload.errorInf["track"];
                        if (typeof(ret.errorInf["cause"]) != 'undefined') {
                            ret.errorInf["cause"]["message"] = ret.errorInf["cause"]["message"].split(":")[0];
                            msg.payload.errorInf = ret.errorInf["cause"];
                        }
                    }
                    node.status({ fill: "red", shape: "ring", text: msg.payload.errorInf.message.split(":")[0] });
                }

            } catch (error) {

                // Prepare result in error and set the status indicator
                node.status({ fill: "red", shape: "ring", text: "resources.message.communicationError" });
                node.error(error);
                msg.payload = { result: false, errorInf: error };
            }

            // Send the message to the next node
            node.send(msg);
        });
    }


    RED.nodes.registerType(REGISTER_TYPE, tapo_actions_constructor, { credentials: { email: { type:"text" }, password: { type:"password" }} });
};

export = nodeInit;
