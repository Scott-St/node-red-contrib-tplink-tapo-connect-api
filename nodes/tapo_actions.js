"use strict";
// New tapo api
const tapo_klap_protocol_1 = require("./tapo_klap_protocol");
const nodeInit = (RED) => {
    const REGISTER_TYPE = 'tapo_new_actions';
    // Check parameters are complete
    function check_parameter(config) {
        let _result = false;
        if ((config === null || config === void 0 ? void 0 : config.email.length) > 0 && (config === null || config === void 0 ? void 0 : config.password.length) > 0) {
            if (('ip' === (config === null || config === void 0 ? void 0 : config.searchMode) && (config === null || config === void 0 ? void 0 : config.deviceIp.length) > 0) ||
                ('alias' === (config === null || config === void 0 ? void 0 : config.searchMode) && (config === null || config === void 0 ? void 0 : config.deviceAlias.length) > 0 && (config === null || config === void 0 ? void 0 : config.deviceIpRange.length) > 0)) {
                _result = true;
            }
        }
        return _result;
    }
    // Tapo actions constructor
    function tapo_actions_constructor(config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        RED.nodes.createNode(this, config);
        let node = this;
        try {
            node.email = (_b = (_a = this === null || this === void 0 ? void 0 : this.credentials) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : "";
            node.password = (_d = (_c = this === null || this === void 0 ? void 0 : this.credentials) === null || _c === void 0 ? void 0 : _c.password) !== null && _d !== void 0 ? _d : "";
            node.deviceIp = (_e = config === null || config === void 0 ? void 0 : config.deviceIp) !== null && _e !== void 0 ? _e : "";
            node.deviceAlias = (_f = config === null || config === void 0 ? void 0 : config.deviceAlias) !== null && _f !== void 0 ? _f : "";
            node.deviceIpRange = (_g = config === null || config === void 0 ? void 0 : config.deviceIpRange) !== null && _g !== void 0 ? _g : "";
            node.searchMode = (_h = config === null || config === void 0 ? void 0 : config.searchMode) !== null && _h !== void 0 ? _h : "ip";
            node.command = (_j = config === null || config === void 0 ? void 0 : config.command) !== null && _j !== void 0 ? _j : "status";
            node.version = (_k = config === null || config === void 0 ? void 0 : config.version) !== null && _k !== void 0 ? _k : tapo_klap_protocol_1.TapoProtocolType.AUTO;
            node.verbose = false;
            node.device = null;
            node.terminal_random = false;
        }
        catch (error) {
            node.status({ fill: "red", shape: "ring", text: "resources.message.error" });
            node.error(error);
        }
        // Get device object handler
        async function get_device_handler(config) {
            // Process parameters
            const proto = (typeof (config.version) == 'undefined' ? tapo_klap_protocol_1.TapoProtocolType.AUTO : config.version);
            // Try to get Device Info with config  
            try {
                // Set the optional parameters
                let response = { result: false };
                // In case of client available skip create client
                if (config.device == null) {
                    // Get credentials object
                    const tapo_cred = new tapo_klap_protocol_1.AuthCredential(config.email, config.password);
                    // Create the device object depending on the ip option
                    if (config.searchMode === "ip") {
                        response.device = await new tapo_klap_protocol_1.TapoDevice(config.terminal_random).get_device_by_IP(tapo_cred, config.deviceIp);
                    }
                    else {
                        response.device = await new tapo_klap_protocol_1.TapoDevice(config.terminal_random).get_device_by_alias(tapo_cred, config.deviceAlias, config.deviceIpRange);
                    }
                    // Update the config device
                    config.device = response.device;
                }
                // Return positive result
                response.result = true;
                response.device = config.device;
                return response;
            }
            catch (error) {
                return { result: false, errorInf: error, device: null };
            }
        }
        // Action: Status - Get device info
        async function get_device_info(device, proto) {
            // Process parameters
            let response = { result: false };
            // Try to get Device Info with config  
            try {
                // Get device info in Tapo format
                const device_info = await device.get_device_info(proto);
                if (!Object.keys(device_info).length) {
                    throw new Error("Tapo device info not found");
                }
                response.tapoDeviceInfo = device_info;
                // Get energy usage if model supports it
                if (tapo_klap_protocol_1.supportEnergyUsage.includes(device_info.model)) {
                    const energy_usage = await device.get_energy_usage(proto);
                    if (!Object.keys(energy_usage).length) {
                        throw new Error("Tapo device energy not found");
                    }
                    response.tapoEnergyUsage = energy_usage;
                }
                // Return positive result
                response.result = true;
                response.device = device;
                return response;
            }
            catch (error) {
                return { result: false, errorInf: error, device: null };
            }
        }
        // Action: Turn_on - Activate device
        async function set_onoff_device(device, proto, status) {
            // Process parameters
            let response = { result: false };
            // Try to get Device Info with config  
            try {
                // Turn on or off device depending on status requested
                const answer = await device.turn_onoff_device(status, proto);
                // Return positive result
                response.result = true;
                response.device = device;
                return response;
            }
            catch (error) {
                return { result: false, errorInf: error, device: null };
            }
        }
        // Action: Toggle - Change device status
        async function toggle_device(device, proto) {
            // Process parameters
            let response = { result: false };
            // Try to get Device Info with config  
            try {
                // Get device info in Tapo format
                const device_info = await device.get_device_info(proto);
                if (!Object.keys(device_info).length) {
                    throw new Error("Tapo device info not found");
                }
                // Turn on or off device depending on current tatus
                const answer = await device.turn_onoff_device(!device_info.device_on, proto);
                // Return positive result
                response.result = true;
                response.device = device;
                return response;
            }
            catch (error) {
                return { result: false, errorInf: error, device: null };
            }
        }
        // Action: Color - Change device color
        async function set_color_device(device, proto, color) {
            // Process parameters
            let response = { result: false };
            // Try to set color of device 
            try {
                // Set device color as requested
                const answer = await device.set_color_device(color, proto);
                // Return positive result
                response.result = true;
                response.device = device;
                return response;
            }
            catch (error) {
                // Check verbose
                if (config.verbose) {
                    if (typeof (error.track) != 'undefined')
                        delete error.track;
                }
                // Prepare result in error and set the status indicator
                node.status({ fill: "red", shape: "ring", text: "resources.message.communicationError" });
                return { result: false, errorInf: error, device: null };
            }
        }
        // Action: Brightness - Change device brightness
        async function set_brightness_device(device, proto, level) {
            // Process parameters
            let response = { result: false };
            // Try to set device brightness 
            try {
                // Set device color as requested
                const answer = await device.set_brightness_device(level, proto);
                // Return positive result
                response.result = true;
                response.device = device;
                return response;
            }
            catch (error) {
                return { result: false, errorInf: error, device: null };
            }
        }
        // Action: Components - Get components of device
        async function get_component(device, proto) {
            // Process parameters
            let response = { result: false };
            // Try to get components from device 
            try {
                // Set device color as requested
                const answer = await device.get_component_negotiation(proto);
                response.tapoComponents = answer;
                // Return positive result
                response.result = true;
                response.device = device;
                return response;
            }
            catch (error) {
                return { result: false, errorInf: error, device: null };
            }
        }
        // Action: Command - Send command with custom request
        async function send_request(device, proto, request) {
            // Process parameters
            let response = { result: false };
            // Try to send request to device 
            try {
                // Set device color as requested
                const answer = await device.send_request(request, proto);
                // Return positive result
                response.result = true;
                response.device = device;
                return response;
            }
            catch (error) {
                return { result: false, errorInf: error, device: null };
            }
        }
        node.on('input', async (msg) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
            try {
                // Prepare config information 
                let config = {
                    email: (_b = (_a = msg === null || msg === void 0 ? void 0 : msg.config) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : node.email,
                    password: (_d = (_c = msg === null || msg === void 0 ? void 0 : msg.config) === null || _c === void 0 ? void 0 : _c.password) !== null && _d !== void 0 ? _d : node.password,
                    deviceIp: (_f = (_e = msg === null || msg === void 0 ? void 0 : msg.config) === null || _e === void 0 ? void 0 : _e.deviceIp) !== null && _f !== void 0 ? _f : node.deviceIp,
                    deviceAlias: (_h = (_g = msg === null || msg === void 0 ? void 0 : msg.config) === null || _g === void 0 ? void 0 : _g.deviceAlias) !== null && _h !== void 0 ? _h : node.deviceAlias,
                    deviceIpRange: (_k = (_j = msg === null || msg === void 0 ? void 0 : msg.config) === null || _j === void 0 ? void 0 : _j.deviceIpRange) !== null && _k !== void 0 ? _k : node.deviceIpRange,
                    searchMode: (_m = (_l = msg === null || msg === void 0 ? void 0 : msg.config) === null || _l === void 0 ? void 0 : _l.searchMode) !== null && _m !== void 0 ? _m : node.searchMode,
                    command: (_p = (_o = msg === null || msg === void 0 ? void 0 : msg.config) === null || _o === void 0 ? void 0 : _o.command) !== null && _p !== void 0 ? _p : node.command,
                    version: (_r = (_q = msg === null || msg === void 0 ? void 0 : msg.config) === null || _q === void 0 ? void 0 : _q.version) !== null && _r !== void 0 ? _r : node.version,
                    verbose: (_t = (_s = msg === null || msg === void 0 ? void 0 : msg.config) === null || _s === void 0 ? void 0 : _s.verbose) !== null && _t !== void 0 ? _t : node.verbose,
                    terminal_random: (_v = (_u = msg === null || msg === void 0 ? void 0 : msg.config) === null || _u === void 0 ? void 0 : _u.terminal_random) !== null && _v !== void 0 ? _v : node.terminal_random,
                    device: node.device
                };
                // Print config in the log
                console.log(`config[${REGISTER_TYPE}]:`, config);
                // Prepare result variable to false
                let ret = {
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
                        }
                        else if (config.command == "power") {
                            // Turn on/off device depending on msg.payload
                            ret = await set_onoff_device(ret.device, config.version, (msg.payload == true));
                        }
                        else if (config.command == "on") {
                            // Turn on device
                            ret = await set_onoff_device(ret.device, config.version, true);
                        }
                        else if (config.command == "off") {
                            // Turn off device
                            ret = await set_onoff_device(ret.device, config.version, false);
                        }
                        else if (config.command == "toggle") {
                            // Toggle device
                            ret = await toggle_device(ret.device, config.version);
                        }
                        else if (config.command == "color") {
                            // Set color of device depending on msg.payload
                            ret = await set_color_device(ret.device, config.version, msg.payload.toString());
                        }
                        else if (config.command == "brightness") {
                            // Set brightness of device depending on msg.payload
                            ret = await set_brightness_device(ret.device, config.version, msg.payload);
                        }
                        else if (config.command == "components") {
                            // Set brightness of device depending on msg.payload
                            ret = await get_component(ret.device, config.version);
                        }
                        else if (config.command == "command") {
                            // Set brightness of device depending on msg.payload
                            ret = await send_request(ret.device, config.version, msg.payload);
                        }
                    }
                    // Update the client device in the node
                    config.device = ret.device;
                    node.device = ret.device;
                    // Delete device info from ret
                    delete ret.device;
                }
                else {
                    // Throw error indicating that there is a config issue
                    throw new Error("Failed to get config");
                }
                // Prepare result in msg.payload and set the status indicator
                msg.payload = ret;
                if (ret.result) {
                    // Change status according to config
                    if (config.version == tapo_klap_protocol_1.TapoProtocolType.KLAP) {
                        node.status({ fill: "green", shape: "dot", text: "resources.message.complete_klap" });
                    }
                    else if (config.version == tapo_klap_protocol_1.TapoProtocolType.PASSTHROUGH) {
                        node.status({ fill: "green", shape: "dot", text: "resources.message.complete_pass" });
                    }
                    else {
                        node.status({ fill: "green", shape: "dot", text: "resources.message.complete_auto" });
                    }
                }
                else {
                    // Check verbose to remove track
                    if (!config.verbose) {
                        if (typeof (msg.payload.errorInf["track"]) != 'undefined')
                            delete msg.payload.errorInf["track"];
                    }
                    node.status({ fill: "red", shape: "ring", text: msg.payload.errorInf.message });
                }
            }
            catch (error) {
                // Prepare result in error and set the status indicator
                node.status({ fill: "red", shape: "ring", text: "resources.message.communicationError" });
                node.error(error);
                msg.payload = { result: false, errorInf: error };
            }
            // Send the message to the next node
            node.send(msg);
        });
    }
    RED.nodes.registerType(REGISTER_TYPE, tapo_actions_constructor, { credentials: { email: { type: "text" }, password: { type: "password" } } });
};
module.exports = nodeInit;
//# sourceMappingURL=tapo_actions.js.map