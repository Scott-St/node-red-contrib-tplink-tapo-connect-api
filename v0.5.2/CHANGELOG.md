
# Change Log
All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [0.5.2] - 2024-02-05
  
Reduction of debug messages to avoid too much `syslog`information. If you have many buttons and/or you want to avoid too much information to appear in the log, please update to this version. 
 
### Added

- [tapo_klap_protocol.js](https://github.com/mbserran/node-red-contrib-tapo-new-api/blob/master/src/nodes/tapo_klap_protocol.ts)
  MINOR   New `debug` calling option introduced in api to avoid by default debugging information in the log. Buttons always call the api with `debug`set to false (default).

### Changed
 
### Fixed

## [0.5.1] - 2024-02-04
  
Bugs corrected on selection of TapoProtocolType at device creation time. Solved some pending issues with axios on old version 1 devices (not supporting Keep_alive connections). It is highly recommended to change to this version. Version 0.5.0 does not work with old V1 devices due to `keep_alive` parameter introduced in that version.
 
### Added

- [tapo_klap_protocol.js](https://github.com/mbserran/node-red-contrib-tapo-new-api/blob/master/src/nodes/tapo_klap_protocol.ts)
  BUG   Optimized management of sockets on `keep_alive` parameter. Default is `true` but, if device does not support it, changes to `false`.
  BUG   TapoProtocoltype corrected on creation of a TapoDevice.

### Changed
 
### Fixed

## [0.5.0] - 2024-01-30
  
New commands added to complete the set. Bug fixed for esporadic errors when connecting first time to device. Spanish locale lenguage added. Meaningfull non verbose errors.
 
### Added

- [tapo_klap_protocol.js](https://github.com/mbserran/node-red-contrib-tapo-new-api/blob/master/src/nodes/tapo_klap_protocol.ts)
  BUG   Optimized management of sockets through `http & https Agents`. Quicker response and less sporadic issues of connectivity.
  BUG   Error message on Axios corrected on `verbose` not activated.

### Changed
 
### Fixed
 
## [0.4.9] - 2024-01-24
  
New commands added to complete the set. Bug fixed for esporadic errors when connecting first time to device. Spanish locale lenguage added. Meaningfull non verbose errors.
 
### Added

- [tapo_klap_protocol.js](https://github.com/mbserran/node-red-contrib-tapo-new-api/blob/master/src/nodes/tapo_klap_protocol.ts)
  MINOR `terminal_uuid` included in klap calls and `TapoDevice` handler includes possibility to call with a random uuid.
  BUG   Initial esporadic `negotiation errors`solved. Now 99.99% of initial message results in proper protocol when `AUTO`. Also when protocol is manually selected.
  MINOR Error intial description separated by `:` to facilitate more meaningfull descriptions. Easy to use `split(":")[0]` and get only that part (non verbose).

- [tapo_actions.js](https://github.com/mbserran/node-red-contrib-tapo-new-api/blob/master/src/nodes/tapo_actions.ts) 
  MAJOR Two more commands included: `components` to get device components in device object and `command` to send a customized request.

- [tapo_actions.json](https://github.com/mbserran/node-red-contrib-tapo-new-api/blob/master/src/nodes/locales/es-ES/tapo_actions.json)
  New `es-ES` language support included

### Changed
 
### Fixed

## [0.4.5] - 2024-01-21
  
Minor changes on README. CHANGELOG also added. No functional changes
 
### Added

- [CHANGELOG.md](https://github.com/mbserran/node-red-contrib-tapo-new-api/blob/master/CHANGELOG.md)
  MINOR `CHANGELOG.md` description of version changes added.

### Changed
 
### Fixed

## [0.4.1] - 2024-01-20
  
Help description added to the node and accessible from Node-RED.
 
### Added

- [tapo_actions.html](https://github.com/mbserran/node-red-contrib-tapo-new-api/blob/master/src/nodes/tapo_actions.html)
  MAJOR `help` description script added to the node. Now full explanation is accessible from Node-RED.

### Changed
 
### Fixed
 
 
## [0.4.0] - 2024-01-19
 
Fully functional version. Complete set of features added to control Tapo devices with both protocols.
Help not yet included in the node.

### Added
   
### Changed

- [tapo_klap_protocol.js](https://github.com/mbserran/node-red-contrib-tapo-new-api/blob/master/src/nodes/tapo_klap_protocol.ts)
  MINOR `webcrypto` alias in `node:crypto` module now call through `webcrypto` module to extend compatibility with Node-RED versions. Now extended from v20 to v15.
 
### Fixed
 